# Tutorial: https://jamesabela.github.io/jsfun/course_functions/08_value_reference.html
# Breadcrumb: Level 8 of 10 - By Value and By Reference Ideas
# Key terms: BYVAL, BYREF, passing by value, passing by reference, mutable data

# Python does not use BYVAL or BYREF keywords.
# Lists are mutable, so a procedure can change a list that is passed in.

def add_item(inventory, item):
    # TODO: append item to inventory
    pass

bag = ["map", "torch"]
add_item(bag, "key")

print(bag)

#Input
# ""

#output
# map, torch, key

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/course_functions/09_decomposition.py
