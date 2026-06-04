# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level03_access_cells.html
# Breadcrumb: Level 3 of 10 - Access Rows and Cells
# Use grid[row][column] to access one item inside a 2D list.
# Complete the print statements.

menu = [
    ["pizza", "pasta", "salad"],
    ["tea", "juice", "water"],
    ["cake", "fruit", "ice cream"]
]

print("Whole menu:")
print(menu)

# TODO: Print the drinks row.
print("Drinks row:", menu[0])

# TODO: Print the word water using row and column indexes.
print("Chosen drink:", menu[0][0])

#Input
# ""

#output
# tea, juice, water, Chosen drink: water

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level04_update_cells.py