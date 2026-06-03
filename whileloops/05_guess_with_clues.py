# Tutorial: https://jamesabela.github.io/jsfun/whileloops/05_guess_with_clues.html

# Level 5 - Guess With Clues
# Puzzle: fix the clues.

secret = 7
guess = 0

while guess != secret:
    guess = int(input("Guess: "))

    if guess > secret:
        print("Too low")
    elif guess < secret:
        print("Too high")

print("Correct")

#Input
# 7
# 3, 7
# 9, 7

#output
# Correct
# Too low
# Correct
# Too high
# Correct

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/06_limited_attempts.py
