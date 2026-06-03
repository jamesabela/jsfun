# Tutorial: https://jamesabela.github.io/jsfun/verivalid/02_range_check.html
# Breadcrumb: Level 2 of 10 - Range Check

# Level 2 of 10
# A range check makes sure a number is between allowed limits.
# This program should only accept exam marks from 0 to 100.

mark = int(input("Enter the exam mark: "))

# TODO: Change the condition so only marks from 0 to 100 are valid.
if mark >= 0:
    print("Valid mark")
else:
    print("Invalid mark")

#Input
# 85
# 101
# -4

#output
# Valid mark
# Invalid mark
# Invalid mark

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/03_length_check.py
