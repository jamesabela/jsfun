# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level05_nested_loops.html
# Breadcrumb: Level 5 of 10 - Use Nested Loops
# A nested loop is useful for visiting every value in a 2D list.
# Complete the loops so every value is printed with its row and column.

weather = [
    [28, 29, 30],
    [31, 30, 29],
    [27, 28, 29]
]

# TODO: Change the ranges so all rows and columns are visited.
for row in range(1):
    for column in range(1):
        print("row", row, "column", column, "value", weather[row][column])

#Input
# ""

#output
# row 2 column 2 value 29, row 1 column 0 value 31

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level06_grid_totals.py