# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level04_update_cells.html
# Breadcrumb: Level 4 of 10 - Update a Cell
# A 2D list can be changed by assigning a new value to one cell.
# Complete the code to place the player on the map.

map_grid = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."]
]

row = int(input("Enter row: "))
column = int(input("Enter column: "))

# TODO: Use row and column to place P in the correct cell.
map_grid[0][0] = "P"

for row_data in map_grid:
    print(*row_data)

#Input
# 1, 2

#output
# . . P

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level05_nested_loops.py