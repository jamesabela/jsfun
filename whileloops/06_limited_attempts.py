# Tutorial: https://jamesabela.github.io/jsfun/whileloops/06_limited_attempts.html

# Level 6 - Limited Attempts
# Puzzle: give the user 3 attempts to type apple.

attempts = 0
word = ""

while attempts < 1 and word != "apple":
    word = input("Word: ")
    attempts = attempts + 1

if word == "apple":
    print("Unlocked")
else:
    print("Locked")

#Input
# apple
# pear, apple
# pear, banana, orange

#output
# Unlocked
# Unlocked
# Locked

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/07_running_total_until_zero.py
