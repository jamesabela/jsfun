# Teacher Guide - Python 2D Lists

## Course Purpose

This course helps students understand 2D lists as lists of lists. It begins with direct access using row and column indexes, then moves towards updating cells, nested loops, searching, simple validation and a creative final project.

## Key Terms

- 2D list
- nested list
- row
- column
- index
- cell
- row-major order
- nested loop
- traversal
- search
- grid
- table
- validation

## Level Notes and Solutions

### Level 1 - Find the Location

Teaches that `array2d[row][column]` accesses one value.

```python
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

if answer == "array2d[2][3]":
    print("Correct location")
else:
    print("Not quite")
    print("The correct command is array2d[2][3]")
```

### Level 2 - Create a 2D List

Teaches that each inner list is one row.

```python
cinema = [
    ["O", "O", "O", "O"],
    ["O", "O", "O", "O"],
    ["O", "O", "O", "O"]
]

print("Cinema seating grid")
for row in cinema:
    print(row)

print("Rows:", len(cinema))
print("Columns in first row:", len(cinema[0]))
```

### Level 3 - Access Rows and Cells

```python
menu = [
    ["pizza", "pasta", "salad"],
    ["tea", "juice", "water"],
    ["cake", "fruit", "ice cream"]
]

print("Whole menu:")
print(menu)
print("Drinks row:", menu[1])
print("Chosen drink:", menu[1][2])
```

### Level 4 - Update a Cell

```python
map_grid = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."]
]

row = int(input("Enter row: "))
column = int(input("Enter column: "))
map_grid[row][column] = "P"

for row_data in map_grid:
    print(*row_data)
```

### Level 5 - Use Nested Loops

```python
weather = [
    [28, 29, 30],
    [31, 30, 29],
    [27, 28, 29]
]

for row in range(3):
    for column in range(3):
        print("row", row, "column", column, "value", weather[row][column])
```

### Level 6 - Total a Grid

```python
sales = [
    [3, 4, 2],
    [5, 1, 6],
    [2, 2, 8]
]

grand_total = 0

for row in sales:
    row_total = sum(row)
    print("Row total:", row_total)
    grand_total = grand_total + row_total

print("Grand total:", grand_total)
```

### Level 7 - Search a Grid

```python
island = [
    ["water", "tree", "water"],
    ["tree", "water", "treasure"],
    ["water", "rock", "tree"]
]

target = "treasure"

for row in range(3):
    for column in range(3):
        if island[row][column] == target:
            print("Treasure found at", row, column)
```

### Level 8 - Booking Grid

```python
seats = [
    ["O", "O", "O", "O"],
    ["O", "X", "O", "O"],
    ["O", "O", "O", "O"]
]

row = int(input("Choose row 0 to 2: "))
column = int(input("Choose column 0 to 3: "))

if row < 0 or row > 2 or column < 0 or column > 3:
    print("Invalid seat")
elif seats[row][column] == "X":
    print("Seat already booked")
else:
    seats[row][column] = "X"
    print("Seat booked")

for seat_row in seats:
    print(*seat_row)
```

### Level 9 - Picture Grid

```python
picture = [
    ["B", "Y", "Y", "B"],
    ["Y", "W", "W", "Y"],
    ["Y", "B", "B", "Y"],
    ["B", "Y", "Y", "B"]
]

for row in picture:
    line = ""
    for pixel in row:
        if pixel == "B":
            line = line + "⬛"
        elif pixel == "Y":
            line = line + "🟨"
        elif pixel == "W":
            line = line + "⬜"
    print(line)
```

### Level 10 - Final Project Example

This is one possible solution. Students can add score, lives, emojis or repeated guesses.

```python
world = [
    ["water", "tree", "water", "rock"],
    ["tree", "water", "rock", "water"],
    ["water", "tree", "treasure", "water"],
    ["rock", "water", "tree", "water"]
]

print("Treasure Grid Project")
print("Choose a row and column from 0 to 3.")

for row in world:
    hidden = []
    for item in row:
        hidden.append("?")
    print(*hidden)

row = int(input("Row: "))
column = int(input("Column: "))
found = world[row][column]
print("You found", found)

if found == "treasure":
    print("You win!")
else:
    print("Keep exploring!")
```
