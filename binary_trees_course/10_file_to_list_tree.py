#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_words.txt
# Level 10 of 12 - Binary Trees
# Help: https://jamesabela.github.io/jsfun/binary_trees_course/10_file_to_list_tree.html

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/11_file_to_oop_tree.py

tree = []

def insert(value):
    if len(tree) == 0:
        tree.append([value, -1, -1])
        return
    current = 0
    while True:
        if value < tree[current][0]:
            if tree[current][1] == -1:
                tree.append([value, -1, -1])
                tree[current][1] = len(tree) - 1
                return
            current = tree[current][1]
        else:
            if tree[current][2] == -1:
                tree.append([value, -1, -1])
                tree[current][2] = len(tree) - 1
                return
            current = tree[current][2]

with open("tree_words.txt", "r") as f:
    for line in f:
        word = line.strip()
        if word != "":
            # TODO: insert the word into the tree
            pass

print("Nodes:", len(tree))
print("Root:", tree[0][0])

#Input
# ""

#output
# Nodes: 20, Root: mango
