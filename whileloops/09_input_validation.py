# Tutorial: https://jamesabela.github.io/jsfun/whileloops/09_input_validation.html

# Level 9 - Input Validation
# Puzzle: fix the validation condition.

age = 0

while age < 1 and age > 120:
    age = int(input("Age: "))

print("Age accepted:", age)

#Input
# 10
# 0, 12
# 150, 15

#output
# Age accepted: 10
# Age accepted: 12
# Age accepted: 15

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/10_turtle_dotted_line.py
