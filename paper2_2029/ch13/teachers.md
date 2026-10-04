# Teacher guide - Chapter 13

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Repair a total

The code adds indices instead of entered scores. Correct it to input three integers and display Total:.



```python
total = 0
for index in range(3):
    value = int(input("Score: "))
    total = total + value
print("Total:", total)
```

Tests:
- Inputs `['8', '2', '5']`; exact output lines `['Total: 15']`.
- Inputs `['0', '0', '0']`; exact output lines `['Total: 0']`.

## Level 2 - Repair a boundary

Correct the code so both 1 and 8 are accepted. Input once and display Accepted or Rejected.



```python
value = int(input("Value: "))
if value >= 1 and value <= 8:
    print("Accepted")
else:
    print("Rejected")
```

Tests:
- Inputs `['1']`; exact output lines `['Accepted']`.
- Inputs `['8']`; exact output lines `['Accepted']`.
- Inputs `['0']`; exact output lines `['Rejected']`.
- Inputs `['9']`; exact output lines `['Rejected']`.

## Level 3 - Zero-data guard

Input count and total as integers, in that order. If count is zero print No data; otherwise print Mean: and total/count. Assume count is non-negative.



```python
count = int(input("Count: "))
total = int(input("Total: "))
if count == 0:
    print("No data")
else:
    print("Mean:", total / count)
```

Tests:
- Inputs `['0', '0']`; exact output lines `['No data']`.
- Inputs `['3', '15']`; exact output lines `['Mean: 5.0']`.

## Level 4 - Highest of negative values

Input three integers, which may all be negative. Display Highest:. Initialise from actual data.



```python
highest = int(input("First: "))
for index in range(2):
    value = int(input("Next: "))
    if value > highest:
        highest = value
print("Highest:", highest)
```

Tests:
- Inputs `['-8', '-3', '-5']`; exact output lines `['Highest: -3']`.
- Inputs `['1', '2', '9']`; exact output lines `['Highest: 9']`.

