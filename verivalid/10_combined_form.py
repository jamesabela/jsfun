# Tutorial: https://jamesabela.github.io/jsfun/verivalid/10_combined_form.html
# Breadcrumb: Level 10 of 10 - Combined Form

# Level 10 of 10
# Final challenge: combine validation and verification.
# A booking form needs:
# - presence check for name
# - range check for age
# - format check for code, such as AB12
# - double entry check for email

name = input("Enter your name: ")
age = int(input("Enter your age: "))
code = input("Enter booking code: ")
email_one = input("Enter email: ")
email_two = input("Enter email again: ")

valid = True

# TODO: Complete the checks below.
if name == "":
    print("Name missing")
    valid = False

if age < 0:
    print("Age invalid")
    valid = False

if len(code) != 4:
    print("Code invalid")
    valid = False

if email_one != email_two:
    print("Emails do not match")
    valid = False

if valid == True:
    print("Booking accepted")
else:
    print("Booking rejected")

#Input
# Sam, 14, AB12, sam@example.com, sam@example.com
# Sam, 140, AB12, sam@example.com, sam@example.com
# Sam, 14, A123, sam@example.com, sam@example.com
# Sam, 14, AB12, sam@example.com, san@example.com

#output
# Booking accepted
# Age invalid, Booking rejected
# Code invalid, Booking rejected
# Emails do not match, Booking rejected

#End Python Validation and Verification
