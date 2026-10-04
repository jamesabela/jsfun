# Teacher guide - Chapter 10

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Update by index

Input an integer and store it at index 1 of the supplied list. Print every value on a separate line.



```python
scores = [12, 18, 9]
value = int(input("New score: "))
scores[1] = value
for score in scores:
    print(score)
```

Tests:
- Inputs `['20']`; exact output lines `['12', '20', '9']`.
- Inputs `['0']`; exact output lines `['12', '0', '9']`.

## Level 2 - Add and insert

Append Dina to the supplied list, then insert Ben at index 1. Print every name on a separate line.



```python
names = ["Aisha", "Chen"]
names.append("Dina")
names.insert(1, "Ben")
for name in names:
    print(name)
```

Tests:
- Inputs `[]`; exact output lines `['Aisha', 'Ben', 'Chen', 'Dina']`.

## Level 3 - Remove and return

Input an index from 0 to 2. Pop that index and display Removed: with the removed name, followed by each remaining name on its own line.



```python
names = ["Aisha", "Ben", "Chen"]
index = int(input("Index: "))
removed = names.pop(index)
print("Removed:", removed)
for name in names:
    print(name)
```

Tests:
- Inputs `['0']`; exact output lines `['Removed: Aisha', 'Ben', 'Chen']`.
- Inputs `['2']`; exact output lines `['Removed: Chen', 'Aisha', 'Ben']`.

## Level 4 - Independent rows

Create three independent rows of two zeros. Set row 0 column 0 to 7. Print each cell row by row, one per line.



```python
grid = []
for row in range(3):
    grid.append([0] * 2)
grid[0][0] = 7
for row in grid:
    for value in row:
        print(value)
```

Tests:
- Inputs `[]`; exact output lines `['7', '0', '0', '0', '0', '0']`.

## Level 5 - Row totals

Use nested loops to display each supplied row total with the label Total:.



```python
grid = [[2, 4, 6], [1, 3, 5]]
for row in grid:
    total = 0
    for value in row:
        total = total + value
    print("Total:", total)
```

Tests:
- Inputs `[]`; exact output lines `['Total: 12', 'Total: 9']`.

## Level 6 - Sort complete records

Bubble-sort the supplied player rows by descending score. Print name and score on each line, separated by a space. Keep each score with its name.



```python
players = [["Aisha", 12], ["Ben", 18], ["Chen", 9]]
swapped = True
while swapped:
    swapped = False
    for index in range(len(players) - 1):
        if players[index][1] < players[index + 1][1]:
            temporary = players[index]
            players[index] = players[index + 1]
            players[index + 1] = temporary
            swapped = True
for row in players:
    print(row[0], row[1])
```

Tests:
- Inputs `[]`; exact output lines `['Ben 18', 'Aisha 12', 'Chen 9']`.

