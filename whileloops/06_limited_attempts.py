# Tutorial: https://jamesabela.github.io/jsfun/whileloops/06_limited_attempts.html

# Level 6 - Limited Attempts
# Give the user 3 attempts to type apple.
# Stop early if they get it right.

attempts = 0
word = ""

while attempts < 3 and word != "apple":
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
