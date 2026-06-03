# Tutorial: https://jamesabela.github.io/jsfun/verivalid/06_format_check.html
# Breadcrumb: Level 6 of 10 - Format Check

# Level 6 of 10
# A format check tests whether data follows a required pattern.
# A challenge code must be two letters followed by two digits, such as AB12.

code = input("Enter the challenge code: ")

# TODO: Complete the format check.
# It should check length, letters and digits.
if len(code) == 4:
    print("Valid code")
else:
    print("Invalid code")

#Input
# AB12
# A123
# ABCD
# XY99

#output
# Valid code
# Invalid code
# Invalid code
# Valid code

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/07_check_digit.py
