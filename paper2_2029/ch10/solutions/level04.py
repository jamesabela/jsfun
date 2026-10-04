grid = []
for row in range(3):
    grid.append([0] * 2)
grid[0][0] = 7
for row in grid:
    for value in row:
        print(value)
