# Level 3 of 12 - Binary Trees
# Help: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/03_list_search.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/vocabulary.html
# Skills needed: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/skill_map.html
# Visualiser: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_visualiser.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/exam_examples.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/04_recursive_traversal.py

tree = [
    [50, 1, 2],
    [30, -1, -1],
    [70, 3, 4],
    [60, -1, -1],
    [80, -1, -1]
]

def find(value):
    current = 0
    while current != -1:
        if tree[current][0] == value:
            return True
        elif value < tree[current][0]:
            current = tree[current][1]
        else:
            # TODO: move to the right child
            current = -1
    return False

print("Find 60:", find(60))
print("Find 99:", find(99))

#Input
# ""

#output
# Find 60: True, Find 99: False
