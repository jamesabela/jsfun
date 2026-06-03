# Tutorial: https://jamesabela.github.io/jsfun/forloops/05_total_score.html

# Level 5 - Total Score
# Ask the user for 3 scores.
# Add them together using a for loop.

total = 0

for i in range(3):
    score = int(input("Score: "))
    total = total + score

print("Total:", total)

#Input
# 5, 4, 3
# 10, 20, 30
# 7, 7, 7

#output
# Total: 12
# Total: 60
# Total: 21

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/06_average_score.py
