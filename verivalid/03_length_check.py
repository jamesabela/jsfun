# Tutorial: https://jamesabela.github.io/jsfun/verivalid/03_length_check.html
# Breadcrumb: Level 3 of 10 - Length Check

# Level 3 of 10
# A length check tests the number of characters in data.
# Spaces count as characters too.
# A school ID must be exactly 6 characters long.

school_id = input("Enter the school ID: ")

# TODO: Use len(school_id) to check that the ID is exactly 6 characters long.
if len(school_id) == 0:
    print("Valid ID")
else:
    print("Invalid ID")

#Input
# AB1234
# A123
# ABC1234

#output
# Valid ID
# Invalid ID
# Invalid ID

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/04_type_check.py
