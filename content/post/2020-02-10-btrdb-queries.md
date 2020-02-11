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

## Depth-First

Depth-first traversal starts at the root and goes as deep to the left of the tree as possible before traversing back up the tree and down again. The goal of depth-first traversal is to access the leaf nodes in the tree as quickly as possible given the structure described above. This kind of traversal is implemented as follows:

```python
def depth_first(node, func):
    # If the node has children, traverse down into the chidren
    if len(node) > 0:
        for child in node:
            # If a node below this node returns False, stop iterating over children
            if not depth_first(child, func):
                return False

    # Apply the function to the node
    return func(node)


if __name__ == "__main__":
    depth_first(make_tree(), print)
```

The `depth_first()` function takes a node (in our case the it will start with `Node` A) as well as a function as arguments. The function first checks if the node has any children. If it does, it iterates through the children and recursively calls the depth_first() until it reaches the bottom of the tree. Once it does it will call the function passed to it (`print()` in this example).

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

## Breadth-First

Breadth First Search (BFS) uses the opposite strategy as DFS, BFS starts at the root node and traverses all of the nodes are the present depth before moving on to the nodes at the next level.

Here is an example of a function that executes BFS:

```python
def breadth_first(nodes, func):
    # Helper to make it easier to pass the root node
    if isinstance(nodes, Node):
        nodes = [nodes]

    # Quit if no more nodes
    if len(nodes) == 0:
        return True

    # Get the current node and apply the function, stopping if it returns False
    current = nodes[0]
    if not func(current):
        return False

    # Append the children to the list of nodes to traverse and continue
    if len(current) > 0:
        nodes += list(current)

    return breadth_first(nodes[1:], func)
```

The `breadth_first()` function takes a `Node` object and converts it to a list. We then check to make sure that `nodes` contains at least one element (if it doesn't, we have traversed the whole tree and can exit the function). We then print out the current values of the nodes, which are the nodes at the highest remaining level of the tree. Finally, we add the current nodes to our list of traversed nodes and pass the non-traversed nodes back into `breadth_first()`.

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

### Examples Using BTrDB
TODO: Add example code here and brief explanation
