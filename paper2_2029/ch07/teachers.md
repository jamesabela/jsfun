# Teacher guide - Chapter 7

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Ticket flowchart conversion

Follow the ticket diagram in Chapter 7. Input an integer age; output Child below 13, otherwise Standard. Draw or inspect the two labelled branches first.



```python
age = int(input("Age: "))
if age < 13:
    print("Child")
else:
    print("Standard")
```

Tests:
- Inputs `['12']`; exact output lines `['Child']`.
- Inputs `['13']`; exact output lines `['Standard']`.
- Inputs `['18']`; exact output lines `['Standard']`.

## Level 2 - Three-score trace

Before completing the code, trace inputs 4, 5, 8. Input three integers and display Total: plus Count: for values at least 5.



```python
total = 0
count = 0
for index in range(3):
    value = int(input("Value: "))
    total = total + value
    if value >= 5:
        count = count + 1
print("Total:", total)
print("Count:", count)
```

Tests:
- Inputs `['4', '5', '8']`; exact output lines `['Total: 17', 'Count: 2']`.
- Inputs `['0', '1', '2']`; exact output lines `['Total: 3', 'Count: 0']`.

## Level 3 - Independent extremes

Input three integers. Find both highest and lowest using independent comparisons and initialisation from actual data. Display Highest: then Lowest:.



```python
first = int(input("First: "))
highest = first
lowest = first
for index in range(2):
    value = int(input("Next: "))
    if value > highest:
        highest = value
    if value < lowest:
        lowest = value
print("Highest:", highest)
print("Lowest:", lowest)
```

Tests:
- Inputs `['2', '4', '6']`; exact output lines `['Highest: 6', 'Lowest: 2']`.
- Inputs `['-5', '-2', '-8']`; exact output lines `['Highest: -2', 'Lowest: -8']`.
- Inputs `['7', '7', '7']`; exact output lines `['Highest: 7', 'Lowest: 7']`.

