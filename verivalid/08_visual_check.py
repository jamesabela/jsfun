# Tutorial: https://jamesabela.github.io/jsfun/verivalid/08_visual_check.html
# Breadcrumb: Level 8 of 10 - Visual Check

# Level 8 of 10
# A visual check is a verification check.
# The user compares the entered data with the original source.
# This cannot prove the data is correct, but it can check it was copied accurately.

original = "Maya Patel"
entered_name = input("Copy this name exactly: Maya Patel
")

print("Original:", original)
print("You entered:", entered_name)

# TODO: Ask the user to type YES if the two versions look identical.
visual_check = input("Do they match? Type YES or NO: ")

if visual_check == "NO":
    print("Visual check accepted")
else:
    print("Visual check failed")

#Input
# Maya Patel, YES
# Maya Patel, NO

#output
# Visual check accepted
# Visual check failed

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/09_double_entry.py
