# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level02_create_grid.html
# Breadcrumb: Level 2 of 10 - Create a 2D List
# A 2D list is a list that contains other lists.
# Complete the cinema grid so it has 3 rows and 4 columns.

# TODO: Replace this one-row list with a 3 by 4 cinema seating grid.
cinema = [["O", "O", "O", "O"]]

print("Cinema seating grid")
for row in cinema:
    print(row)

print("Rows:", len(cinema))
print("Columns in first row:", len(cinema[0]))

#Input
# ""

#output
# Rows: 3, Columns in first row: 4

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level03_access_cells.py