#Input
# 15
# 22
# 5

#output
# Teenager
# Adult
# Child

#End
# Intro to Python: Age Classifier

# This script asks the user for their age and prints their age category:
# - Under 12: Child
# - 12 to 19: Teenager
# - 20 and above: Adult

age = int(input("Please enter your age: "))

if age < 12:
    print("Category: Child")
elif age <= 19:
    print("Category: Teenager")
else:
    print("Category: Adult")
