# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level01_find_location.html
# Breadcrumb: Level 1 of 10 - Find the Location
# In a 2D list, the first index is the row and the second index is the column.
# Complete the program so it checks whether the user typed the correct location.

array2d = [
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34]
]

print("2D List Location Trainer")
for row in array2d:
    print(row)

print("The target value is", array2d[2][3])
answer = input("Type the command to print it: ")

# TODO: Change the condition so the correct command is accepted.
if answer == "array2d[0][0]":
    print("Correct location")
else:
    print("Not quite")
    print("The correct command is array2d[2][3]")

#Input
# array2d[2][3]

#output
# Correct location

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level02_create_grid.py