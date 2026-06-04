#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_words.txt
# Level 11 of 12 - Binary Trees
# Help: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/11_file_to_oop_tree.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/vocabulary.html
# Skills needed: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/skill_map.html
# Visualiser: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_visualiser.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/exam_examples.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/12_final_project.py

class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
        self.count = 0

    def insert(self, value):
        if self.root is None:
            self.root = Node(value)
            self.count += 1
        else:
            self._insert(self.root, value)

    def _insert(self, current, value):
        if value < current.data:
            if current.left is None:
                current.left = Node(value)
                self.count += 1
            else:
                self._insert(current.left, value)
        elif value > current.data:
            if current.right is None:
                current.right = Node(value)
                self.count += 1
            else:
                self._insert(current.right, value)
        # duplicate words are ignored

    def inorder(self):
        self._inorder(self.root)

    def _inorder(self, current):
        if current is None:
            return
        # TODO: print the words in sorted order using recursion

tree = BinaryTree()
with open("tree_words.txt", "r") as f:
    for line in f:
        word = line.strip()
        if word != "":
            tree.insert(word)

print("Unique words:", tree.count)
tree.inorder()

#Input
# ""

#output
# Unique words: 20, apple, banana, nectarine
