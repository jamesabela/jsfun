# Tutorial: https://jamesabela.github.io/jsfun/verivalid/07_check_digit.html
# Breadcrumb: Level 7 of 10 - Check Digit

# Level 7 of 10
# A check digit is calculated from the other digits.
# This small example uses the first 3 digits and checks the final digit.
# Rule: add the first 3 digits. The check digit is the last digit of that total.
# 5724 is valid because 5 + 7 + 2 = 14, and the check digit is 4.

code = input("Enter a 4 digit code: ")

total = 0

# TODO: Add the first three digits to total.
# Hint: use a for loop from 0 to 2.
for i in range(0):
    total = total + int(code[i])

calculated_check_digit = total % 10
actual_check_digit = int(code[3])

print("Calculated check digit:", calculated_check_digit)

if calculated_check_digit == actual_check_digit:
    print("Code validated")
else:
    print("Code not valid")

#Input
# 5724
# 1236
# 1235

#output
# Calculated check digit: 4, Code validated
# Calculated check digit: 6, Code validated
# Calculated check digit: 6, Code not valid

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/08_visual_check.py
