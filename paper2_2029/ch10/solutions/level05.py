grid = [[2, 4, 6], [1, 3, 5]]
for row in grid:
    total = 0
    for value in row:
        total = total + value
    print("Total:", total)
