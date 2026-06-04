# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level06_grid_totals.html
# Breadcrumb: Level 6 of 10 - Total a Grid
# 2D lists can store tables of numbers.
# Complete the program to total each row and then the whole grid.

sales = [
    [3, 4, 2],
    [5, 1, 6],
    [2, 2, 8]
]

grand_total = 0

for row in sales:
    # TODO: Calculate the row total using sum(row).
    row_total = 0
    print("Row total:", row_total)
    grand_total = grand_total + row_total

print("Grand total:", grand_total)

#Input
# ""

#output
# Row total: 9, Row total: 12, Row total: 12, Grand total: 33

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level07_search_grid.py