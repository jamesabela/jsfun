# Tutorial: https://jamesabela.github.io/jsfun/whileloops/04_guess_the_number.html

# Level 4 - Guess the Number
# Puzzle: fix the condition so the correct answer is 7.

guess = 0

while guess != 5:
    guess = int(input("Guess: "))

print("Correct")

#Input
# 7
# 3, 7
# 1, 2, 7

#output
# Correct
# Correct
# Correct

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/05_guess_with_clues.py
