---
title: "Memory Efficient Btrdb Queries"
date: 2020-02-10T19:03:22-05:00
description: "How to leverage the Berkeley Tree to create memory efficient queries"
tags: ["btrdb", "python", "data structures", "algorithms", "analytics"]
---

[The Berkeley Tree Database (BTrDB)](http://btrdb.io/) provides effective distributed storage of dense scalar-valued telemetry data. It can store data with nanosecond precision, supports 16.7 million writes per second, and can perform 19.8 million reads per second. As a result it is an excellent tool for analyzing historical high-frequency (usually 30-240 Hz) sensor readings that produce gigabytes of data an hour.

When working with such large amounts of data, it is important to conduct queries in a manner that efficiently utilizes the main memory of your machine. While the BTrDB API supports streaming raw values and windows over large time ranges, it is often not necessary or wise to do so when most computations can be composed of batches and when such analytics require non-trivial computation time. BTrDB's unique tree structure was designed to support queries at arbitrary levels of time granularity with constant time aggregation. This structure can also be used to compose multiple queries, loading data into a computation on demand, while pruning away unnecessary data before it is retrieved from the database. Conducting queries in this way reduces the amount of the BTrDB tree that needs to be traversed and held in memory, thus greatly improving performance.

In this post we will review three multi-query approaches for memory safety. First, we will explore chunked queries that allow us to scan across the database, loading fixed size chunks of memory at a time. Then, using this as a building block, we will explore tree based queries that execute at higher levels of time granularity (higher in the tree), only querying at lower levels when needed. There are two primary methods for accessing trees: depth-first and breadth-first. We will introduce these concepts generally and then provide examples of how they can be used to directly access BTrDB data.

## Chunked Queries

Consider the problem where you would like to conduct an analysis over a month of data. At a 120 Hz sample rate, this query will collect 313,632,000 points of data, which at roughly 16 bytes per point is a total query size of 5.02 GB. Although most modern laptops can easily hold this in memory at a given time, consider that many computations may double or triple the memory requirements to produce a result, and if the computation takes a long time, holding a database cursor open for that long may lead to in-process failures which require restarting the whole computation.

One solution is to query only a week or a day at a time, yielding the materialized data to the computation before issuing the next query. This is a fairly simple function to write in Python:

```python
from btrdb.utils.timez import ns_delta, to_nanoseconds

def chunked_values(stream, start, end, chunk=ns_delta(days=1), version=0):
    # Convert start and end to nanoseconds to make range math easier.
    start, end = to_nanoseconds(start), to_nanoseconds(end)

    # Range over the chunk start times using the chunk step
    for time in range(start, end, chunk):
        # Perform the database query and yield it
        yield stream.values(time, time+chunk, version=version)


# Use the function to issue 4 queries
start = "2020-01-01T00:00:00.000Z"
end = "2020-01-31T00:00:00.000Z"
for result in chunked_values(stream, start, end, ns_delta(weeks=1)):
    for point, _ in result:
        # use point
```

Similar functions can be written for `windows` and `aligned_windows` as well.

There is a trade-off to using this function, although you are using a quarter of the memory than you would have by materializing an entire month of data, you do so at the increased latency of issuing 3 more queries to the database. Balance between the amount of data loaded per query and the number of queries issued is very important; when computing across a month of data you would only want to query no less than a few days at a time. Using this basic building block of issuing multiple queries across specific ranges of time, we will explore more complex queries that directly leverage the Berkeley Tree to only access data required for the computation, pruning away unnecessary queries.

## Tree Data Structures

The first step to understanding tree query algorithms is to understand the tree data structure. To simply illustrate this, we can implement a simple tree structure in Python as follows:

```python
class Node(object):
    """
    A tree node has a label that identifies it as well as children and a single parent.
    Any k-ary tree can be constructed using this simple data structure.
    """

    def __init__(self, label, children=None, parent=None):
        self.label = label
        self.parent = parent
        self.children = children or []
​
    def add_child(self, label):
        child = Node(label, [], self)
        self.children.append(child)
        return child
​
    def __iter__(self):
        for child in self.children:
            yield child
​
    def __len__(self):
        return len(self.children)
​
    def __str__(self):
        return self.label
```

Trees are constructed with `Node` objects that have a label, children, and a parent. The first node in the tree is called the _root node_ - it is the only node in the tree that does not have a parent. Nodes with children are called _interior nodes_ because they are in the middle of the tree. Nodes without children are called _leaf nodes_ because they are on the outside of the tree. The size of the tree is the number of nodes and the depth of the tree is the number of connections from the root to the farthest leaf node.

Consider the following example tree with size=11 and depth=3 that we will use throughout the rest of the post:

![An example tree with size=11 and depth=3](/assets/img/example_tree.png)

Creating this tree using a Python function is as follows:

```python
def make_tree():
    # Create root node and its children
    A = Node("A")
    B = A.add_child("B")
    C = A.add_child("C")

    # Add the second layer of the tree through B and C
    B.add_child("D")
    E = B.add_child("E")
    B.add_child("F")
    G = C.add_child("G")

    # Add the third layer of the tree via E and G
    E.add_child("J")
    E.add_child("K")
    G.add_child("H")
    G.add_child("I")

    # Return the root node of the tree
    return A

tree = make_tree()
```

To traverse this tree, we will start at the root and then _recursively_ access children. There are two primary methods of traversing trees: depth-first and breadth-first. In our examples using this tree we will consider a method that is designed to apply a function to each node in the tree. The function should return `True` if the traversal should continue or `False` if the traversal should stop (`break`). The most common example is to conduct a search, where we want to find a node that meets a specific criteria, once that criteria is found, we can stop our search.

### Depth-First

Depth-first traversal starts at the root and goes as deep to the left of the tree as possible before traversing back up the tree and down again. The goal of depth-first traversal is to access the leaf nodes in the tree as quickly as possible given the structure described above. This kind of traversal is implemented as follows:

```python
def depth_first(root, func):
    # If the node has children, traverse down into the chidren
    if len(root) > 0:
        for child in root:
            depth_first(child, func)

    # Apply the function to the node
    func(root)


# Start depth-first traversal with the root of the tree
depth_first(make_tree(), print)
```

The `depth_first()` function recursively applies a function, `func` to each node in the tree starting with the lowest left node. It does this by first applying the function to any children the node has, by traversing the children using the depth first call. If the node does not have children (it is a leaf node) or the function has been applied to all children of the current node, the function is applied. This allows the function to quickly reach the bottom of the tree.

The expected print output from depth_first is:

```
D
J
K
E
F
B
H
I
G
C
A
```

Depth-first traversal is commonly used because of its ease of implementation and the fact that it doesn't have book keeping requirements that might require increased memory usage. If the order of applying the function matters, e.g. if you're searching for a value and will stop when you find it, then it is important to consider the path the traversal takes. For example, in BTrDB where moving left to right across the tree means moving increasing time-order, depth-first traversal is the best way to find the _earliest_ example of something in time.

### Breadth-First

Breadth-first traversal prioritizes interior nodes rather than leaf nodes by traversing each level of the tree at a time. Starting at the root node, a breadth-first traversal collects all the children of the current level, then iterates accross them, collecting all of the children at the level below. The collection mechanism requires some extra bookkeeping, though we are still able to implement breadth-first search recursively.

Here is an example of a function that executes breadth-first to similarly apply a function, `func` to each node in the tree:

```python
def breadth_first(nodes, func):
    # Helper to make it easier to pass the root node
    if isinstance(nodes, Node):
        nodes = [nodes]

    # Quit if no more nodes
    if len(nodes) == 0:
        return

    # Get the current node and apply the function, stopping if it returns False
    current = nodes[0]
    func(current)

    # Append the children to the list of nodes to traverse and continue
    if len(current) > 0:
        nodes += list(current)

    return breadth_first(nodes[1:], func)


# Start breadth-first traversal with the root of the tree
breadth_first(make_tree(), print)
```

Instead of a single node object, the first argument to the recursive `breadth_first()` function is a list of nodes. To make passing the root node to the tree easier (the usually place where the traversal starts), the first step of the function is a check to convert a single node into a list of nodes. The recursive stop condition is to check if an empty list has been passed in. Otherwise, the first node in the list is fetched as the current node and the function applied to it. We then collect all of the children of the node and append them to the list, this ensures that the level below the current node is only started after the current level is completed and that traversal of the children in the level below happens in a left to right fashion. We can then continue to recurse on all of the children, omitting the current node from the next call.

The expected printed order of this function is

```
A
B
C
D
E
F
G
J
K
H
I
```

While breadth-first traversal is a bit trickier to implement, it is important to consider the tree traversal pattern. If you're searching for a value that is in the middle of the tree or to the far right of the tree, then breadth-first traversal could be a far better strategy. In the case of BTrDB, breadth-first traversal allows you to easily traverse all time at different time granularities, collecting statistical information about the values below. If you're looking for the latest window or all windows that meet certain criteria, breadth-first traversal might be the better strategy.

## Tree Traversal Queries in BTrDB

BTrDB is a tree data structure that is not dissimilar from the tree structure we saw above. It's root and interior nodes are composed of `StatPoints` that describe a window of time with statistical aggregates and it's leaf nodes can be thought of as individual points. Although you cannot directly query the children of a stat point in the tree, a similar effect is possible using `windows` and `aligned_windows` queries where the `depth` and `pointwidth` arguments specify the level of the tree that is being traversed and the time range specified by the query can be directly fetched from the parent node (which is also true for `values` queries).

To demonstrate this, let's take a toy example where we want to find the _time of the minimum value_ in a stream. We will explore both depth-first and breadth-first traversal strategies to see which is more efficient. To start, note that it is very fast to get the _minimum value_ of a stream:

```python
def get_minimum_value(stream, version=0):
    # Get all of the stat points at the highest level of the tree as possible
    windows = stream.aligned_windows(
        start=btrdb.MINIMUM_TIME, end=btrdb.MAXIMUM_TIME, pointwidth=60, version=version
    )

    # Unless you have decades of data, this will likely only be one stat point
    values = [window.min for window, _ in windows]
    return min(values)
```

This function collects the root node of the tree by performing an `aligned_windows` query at `pointwidth=60`, which should return only one stat point unless you have decades of data stored in the database (for completeness, we still take the minimum of all retunred windows if more than one is returned). Because a stat point is returned, we can directly fetch the minimum value from the point. However, what if we wanted to know _when_ that minimum value occurred?

```python
from btrdb.utils.general import pointwidth


def find_points_dfs(
    stream,
    value,
    start=btrdb.MINIMUM_TIME,
    end=btrdb.MAXIMUM_TIME,
    pw=48,
    version=0
):
    # Ensure pw is a pointwidth object
    pw = pointwidth(pw)

    # Begin by collecting all stat points at the specified pointwidth
    # Note that zip creates a list of windows and versions and we ignore the versions
    windows, _ = zip(*stream.aligned_windows(start, end, pw, version))

    # Traversing from left to right from the windows
    for window in windows:
        # Check to see if the value is in the window
        if window.min <= value <= window.max:
            # Get the time range of the current window
            wstart = window.time
            wend = window.time + pw.nanoseconds

            if pw <= 30:
                # If we are at a window length of a second, use values
                points, _ = zip(*stream.values(wstart, wend, version))
            else:
                # Otherwise, traverse the stat point children of this node
                points = find_points_dfs(stream, value, wstart, wend, pw-1, version)

            # Yield all points to the calling function
            for point in points:
                if point.value == value:
                    yield point


# Find the time of of the smallest value in the stream
value = get_minimum_value(stream)
for point in find_points_dfs(stream, value):
    print(point)
```

The `find_smallest()` function starts by performing an `aligned_windows` query to retrieve our `StatPoints`, which are aggregated points from BTrDB at the provided `point_width`. The function starts at the parent node and records the minimum value for that `StatPoint`, and thus the entire tree underneath it. It then loops through each of the `StatPoints` and if it finds a child that has the same minimum value as the parent node, it records the start and end dates of the window, subtracts one from the `point_width` and calls `find_smallest()` again, where it conducts another `aligned_windows()` and starts the process over. This continues until it finds the most granular `StatPoint` within our max depth (`point_width` of 30 in this case) that shares the tree's overall minimum value to hone in on where the minimum value is located.

The key concept to understand is that `find_smallest()` only traverses to child nodes when their parents have the target minimum value while ignoring the others, effectively pruning away unnecessary data and conducting a memory efficient query.