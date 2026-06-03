# Tutorial: https://jamesabela.github.io/jsfun/verivalid/04_type_check.html
# Breadcrumb: Level 4 of 10 - Type Check

# Level 4 of 10
# A type check makes sure data is the correct type.
# This program should accept only whole numbers for the number of tickets.

user_input = input("How many tickets? ")

# TODO: Use user_input.isdigit() to check whether the input is a whole number.
if user_input == "4":
    tickets = int(user_input)
    print("Valid integer")
    print("Tickets:", tickets)
else:
    print("Invalid integer")

#Input
# 4
# four
# 12

#output
# Valid integer, Tickets: 4
# Invalid integer
# Valid integer, Tickets: 12

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/05_presence_check.py
