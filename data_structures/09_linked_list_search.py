# Tutorial: https://jamesabela.github.io/jsfun/data_structures/09_linked_list_search.html
# Vocabulary: https://jamesabela.github.io/jsfun/data_structures/vocabulary.html
# Breadcrumb: Level 9 of 10 - Data Structures

data = ["ant", "bee", "cat", "dog"]
next_node = [2, -1, 3, 1]
start = 0
target = "dog"
found = False

pointer = start
while pointer != -1 and found == False:
    if data[pointer] == target:
        found = True
    else:
        pointer = ___[pointer]

print("Found:", found)
print("Pointer:", pointer)

#Input
# ""

#output
# Found: True, Pointer: 3

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/data_structures/10_final_project.py
