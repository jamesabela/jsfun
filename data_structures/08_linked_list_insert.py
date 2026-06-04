# Tutorial: https://jamesabela.github.io/jsfun/data_structures/08_linked_list_insert.html
# Vocabulary: https://jamesabela.github.io/jsfun/data_structures/vocabulary.html
# Breadcrumb: Level 8 of 10 - Data Structures

data = ["ant", "bee", "cat", "dog", ""]
next_node = [2, -1, 3, 1, -1]
start = 0
free = 4

# Put eel into the free node.
data[free] = "___"

# Make eel point to the old start, then update start.
next_node[free] = ___
start = ___

pointer = start
while pointer != -1:
    print(data[pointer])
    pointer = next_node[pointer]

#Input
# ""

#output
# eel, ant, cat, dog, bee

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/data_structures/09_linked_list_search.py
