# Level 6 of 12 - Binary Trees
# Help: https://jamesabela.github.io/jsfun/binary_trees_course/06_oop_node.html

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/07_oop_insert.py

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

root = Node(50)
root.left = Node(30)
# TODO: create root.right as Node(70)

print("Root:", root.data)
print("Left:", root.left.data)
print("Right:", root.right.data)

#Input
# ""

#output
# Root: 50, Left: 30, Right: 70
