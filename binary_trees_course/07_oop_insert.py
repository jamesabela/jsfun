# Level 7 of 12 - Binary Trees
# Help: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/07_oop_insert.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/vocabulary.html
# Skills needed: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/skill_map.html
# Visualiser: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_visualiser.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/exam_examples.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/08_oop_search.py

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
            self._insert_recursive(self.root, value)

    def _insert_recursive(self, current, value):
        if value < current.data:
            if current.left is None:
                current.left = Node(value)
            else:
                self._insert_recursive(current.left, value)
        else:
            # TODO: write the right-side recursive case
            pass

tree = BinaryTree()
for value in [50, 30, 70, 60, 80]:
    tree.insert(value)

print(tree.root.data)
print(tree.root.left.data)
print(tree.root.right.data)
print(tree.root.right.left.data)

#Input
# ""

#output
# 50, 30, 70, 60
