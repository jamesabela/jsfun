# Level 2 of 12 - Binary Trees
# Help: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/02_list_insert.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/vocabulary.html
# Skills needed: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/skill_map.html
# Visualiser: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_visualiser.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/exam_examples.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/03_list_search.py

# A list-based binary tree can store each node as:
# [data, left_pointer, right_pointer]
# -1 means no child yet.

tree = [[50, -1, -1]]

def insert(value):
    current = 0
    while True:
        if value < tree[current][0]:
            if tree[current][1] == -1:
                tree.append([value, -1, -1])
                tree[current][1] = len(tree) - 1
                return
            else:
                current = tree[current][1]
        else:
            # TODO: write the matching right-side insertion code
            pass

insert(30)
insert(70)
insert(60)
print(tree)

#Input
# ""

#output
# 50, 30, 70, 60
