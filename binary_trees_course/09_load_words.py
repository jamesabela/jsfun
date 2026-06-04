#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/tree_words.txt
# Level 9 of 12 - Binary Trees
# Help: https://jamesabela.github.io/jsfun/binary_trees_course/09_load_words.html

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/10_file_to_list_tree.py

# This file is loaded by the #load line above.
# In Python Code Lab this puts tree_words.txt into the virtual file system.

words = []

with open("tree_words.txt", "r") as f:
    for line in f:
        word = line.strip()
        # TODO: only append non-empty words

print("Words loaded:", len(words))
print(words[0])
print(words[-1])

#Input
# ""

#output
# Words loaded: 20, mango, nectarine
