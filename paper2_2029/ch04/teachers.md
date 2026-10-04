# Teacher guide - Chapter 4

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Inclusive counting

Input a positive integer n. Use a for loop to display integers 1 to n, one per line.



```python
n = int(input("Limit: "))
for number in range(1, n + 1):
    print(number)
```

Tests:
- Inputs `['1']`; exact output lines `['1']`.
- Inputs `['4']`; exact output lines `['1', '2', '3', '4']`.

## Level 2 - Score total

Input three integer scores and display Total: followed by their sum.



```python
total = 0
for index in range(3):
    total = total + int(input("Score: "))
print("Total:", total)
```

Tests:
- Inputs `['5', '7', '9']`; exact output lines `['Total: 21']`.
- Inputs `['0', '0', '0']`; exact output lines `['Total: 0']`.

## Level 3 - Pass counter

Input four marks. Display Passes: followed by how many marks are at least 50.



```python
count = 0
for index in range(4):
    mark = int(input("Mark: "))
    if mark >= 50:
        count = count + 1
print("Passes:", count)
```

Tests:
- Inputs `['49', '50', '51', '0']`; exact output lines `['Passes: 2']`.
- Inputs `['80', '90', '50', '100']`; exact output lines `['Passes: 4']`.

## Level 4 - Sentinel total

Input non-negative integers until -1. Display Total: and exclude the sentinel.



```python
total = 0
value = int(input("Value or -1: "))
while value != -1:
    total = total + value
    value = int(input("Value or -1: "))
print("Total:", total)
```

Tests:
- Inputs `['-1']`; exact output lines `['Total: 0']`.
- Inputs `['4', '6', '-1']`; exact output lines `['Total: 10']`.
- Inputs `['0', '2', '3', '-1']`; exact output lines `['Total: 5']`.

## Level 5 - Input before checking

Use while True and break to ask for GO until it is entered. Display Try again for every rejected answer, then Continuing once.



```python
while True:
    answer = input("Enter GO: ")
    if answer == "GO":
        break
    print("Try again")
print("Continuing")
```

Tests:
- Inputs `['GO']`; exact output lines `['Continuing']`.
- Inputs `['no', 'go', 'GO']`; exact output lines `['Try again', 'Try again', 'Continuing']`.

## Level 6 - Grid coordinates

Use nested loops to display row and column coordinates for 2 rows and 3 columns, starting at zero.



```python
for row in range(2):
    for column in range(3):
        print(row, column)
```

Tests:
- Inputs `[]`; exact output lines `['0 0', '0 1', '0 2', '1 0', '1 1', '1 2']`.

