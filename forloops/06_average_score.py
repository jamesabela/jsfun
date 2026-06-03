# Tutorial: https://jamesabela.github.io/jsfun/forloops/06_average_score.html

# Level 6 - Average Score
# Puzzle: fix the average calculation.

total = 0

for i in range(4):
    score = int(input("Score: "))
    total = total + score

average = total / 2
print("Average:", average)

#Input
# 10, 10, 10, 10
# 2, 4, 6, 8
# 1, 2, 3, 4

#output
# Average: 10.0
# Average: 5.0
# Average: 2.5

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/07_loop_through_colours.py
