# Level 4 of 12 - Binary Trees
# Help: https://jamesabela.github.io/jsfun/binary_trees_course/04_recursive_traversal.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/05_turtle_tree.py

tree = [
    [50, 1, 2],
    [30, -1, -1],
    [70, 3, 4],
    [60, -1, -1],
    [80, -1, -1]
]

def inorder(index):
    if index == -1:
        return
    inorder(tree[index][1])
    print(tree[index][0])
    # TODO: visit the right subtree

inorder(0)

#Input
# ""

#output
# 30, 50, 60, 70, 80
