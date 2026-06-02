# Learn more: https://jamesabela.github.io/jsfun/selection/magician.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/selection/letters.py

# Input
# 5
# 3
# 7

# Output
# Correct!
# Too Low!
# Too High!

number = 5
print("I have thought of a number between 1 and 10")
guess = int(input("Can you guess what it is?"))

if guess  number:
    print("Correct!")
if guess  number:
    print("Too Low!")
if guess  number:
    print("Too High!")
