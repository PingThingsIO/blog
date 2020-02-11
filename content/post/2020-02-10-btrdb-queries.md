---
title: "Memory Efficient Btrdb Queries"
date: 2020-02-10T19:03:22-05:00
draft: true
---
[The Berkeley Tree Database (BTrDB)](http://sdb.cs.berkeley.edu/sdb/btrdb.php#) provides effective distributed storage of dense scalar-valued telemetry data. It can store data with nanosecond precision, supports 16.7 million writes per second, and can perform 19.8 million reads per second. As a result it is an excellent tool for analyzing historical high-frequency (usually 30-240 Hz) sensor readings that produce gigabytes of data an hour.

When working with such large amounts of data, it is important to conduct queries in a manner that efficiently utilizes the main memory of your machine. While the BTrDB API supports streaming raw values and windows over large time ranges, it is often not necessary or wise to do so when most computations can be composed of batches and when such analytics require non-trivial computation time. BTrDB also supports queries at arbitrary levels of time granularity with constant time aggregation. Moreover, the database has native support for windowing and time alignment queries. It is recommended that BTrDB queries should start with window queries with a higher point width (interval between data points), and only query at more granular levels if needed. Conducting queries in this way reduces the amount of the BTrDB tree that needs to be traversed and held in memory, thus greatly improving performance. 

We will review two important concepts for traversing tree data structures: depth first search and breadth first search. We will first introduce the concepts generally and then provide examples to illustrate how they can be used with the BTrDB.

### Depth First Search (DFS)
When using Depth First Search (DFS), we are traversing trees by starting at the root node, and then exploring as far as possible along each branch before backtracking. This concept is much easier to visualize, so let’s look at a basic example using Python:

~~~~{.python}
class Node(object):
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
def make_tree():
   A = Node("A")
   B = A.add_child("B")
   C = A.add_child("C")
   B.add_child("D")
   E = B.add_child("E")
   B.add_child("F")
   E.add_child("J")
   E.add_child("K")
   G = C.add_child("G")
   G.add_child("H")
   G.add_child("I")
 
   return A
 
def depth_first(root, func):
   if len(root) > 0:
       for child in root:
           depth_first(child, func)
   func(root)
 
if __name__ == "__main__":
   depth_first(make_tree(), print)
~~~~
 
Calling the `make_tree()` function produces a tree that looks like the following:
 
 ![alt text](/assets/img/example_tree.png)

The `depth_first()` function takes a node (in our case the it will start with `Node` A) as well as a function as arguments. The function first checks if the node has any children. If it does, it iterates through the children and recursively calls the depth_first() until it reaches the bottom of the tree. Once it does it will call the function passed to it (`print()` in this example). 
 
The expected print output from depth_first is D, J, K, E, F, B, H, I, G, C, A.

### Breadth First Search
Breadth First Search (BFS) uses the opposite strategy as DFS, BFS starts at the root node and traverses all of the nodes are the present depth before moving on to the nodes at the next level. 

Here is an example of a function that executes BFS:
~~~~{.python}
def breadth_first(nodes, func):
   # Helper to make it easier to pass the root node
   if isinstance(nodes, Node):
       nodes = [nodes]
   # Quit if no more nodes
   if len(nodes) == 0:
       return
   current = nodes[0]
   func(current)
   if len(current) > 0:
       nodes += list(current)
   breadth_first(nodes[1:], func)
 ~~~~
The `breadth_first()` function takes a `Node` object and converts it to a list. We then check to make sure that `nodes` contains at least one element (if it doesn't, we have traversed the whole tree and can exit the function). We then print out the current values of the nodes, which are the nodes at the highest remaining level of the tree. Finally, we add the current nodes to our list of traversed nodes and pass the non-traversed nodes back into `breadth_first()`.

The expected printed order of this function is A, B, C, D, E, F, G, J, K, H, I

### Examples Using BTrDB
TODO: Add example code here and brief explanation
TODO: discuss chunked time queries
