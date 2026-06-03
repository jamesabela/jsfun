# Tutorial: https://jamesabela.github.io/jsfun/verivalid/09_double_entry.html
# Breadcrumb: Level 9 of 10 - Double Entry Check

# Level 9 of 10
# A double entry check is a verification check.
# The same data is entered twice and the computer checks whether both entries match.

email_one = input("Enter email address: ")
email_two = input("Enter email address again: ")

# TODO: Compare email_one and email_two.
if email_one != email_two:
    print("Emails match")
else:
    print("Emails do not match")

#Input
# sam@example.com, sam@example.com
# sam@example.com, san@example.com

#output
# Emails match
# Emails do not match

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/verivalid/10_combined_form.py
