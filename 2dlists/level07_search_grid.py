# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level07_search_grid.html
# Breadcrumb: Level 7 of 10 - Search a Grid
# Search each row and column to find a target value.
# Complete the program so it finds the treasure.

island = [
    ["water", "tree", "water"],
    ["tree", "water", "treasure"],
    ["water", "rock", "tree"]
]

target = "treasure"

# TODO: Use nested loops to search the whole island.
for row in range(1):
    for column in range(1):
        if island[row][column] == target:
            print("Treasure found at", row, column)

#Input
# ""

#output
# Treasure found at 1 2

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level08_booking_grid.py