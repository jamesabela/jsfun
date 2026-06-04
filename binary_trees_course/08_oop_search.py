# Level 8 of 12 - Binary Trees
# Help: https://jamesabela.github.io/jsfun/binary_trees_course/08_oop_search.html

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/09_load_words.py

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None:
            self.root = Node(value)
        else:
            self._insert(self.root, value)

    def _insert(self, current, value):
        if value < current.data:
            if current.left is None:
                current.left = Node(value)
            else:
                self._insert(current.left, value)
        else:
            if current.right is None:
                current.right = Node(value)
            else:
                self._insert(current.right, value)

    def search(self, value):
        return self._search(self.root, value)

    def _search(self, current, value):
        if current is None:
            return False
        if current.data == value:
            return True
        if value < current.data:
            return self._search(current.left, value)
        # TODO: search the right subtree
        return False

tree = BinaryTree()
for value in [50, 30, 70, 60, 80]:
    tree.insert(value)

print("60:", tree.search(60))
print("99:", tree.search(99))

#Input
# ""

#output
# 60: True, 99: False
