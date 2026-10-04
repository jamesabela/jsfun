# Teacher guide - Chapter 8

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - First-match search

Search the supplied list for an input integer. Use linear search and output Position: with the first index or -1.

Inspect for sequential comparisons; membership alone does not satisfy the algorithm requirement.

```python
values = [12, 4, 7, 4, 19]
target = int(input("Target: "))
position = -1
for index in range(len(values)):
    if values[index] == target:
        position = index
        break
print("Position:", position)
```

Tests:
- Inputs `['12']`; exact output lines `['Position: 0']`.
- Inputs `['4']`; exact output lines `['Position: 1']`.
- Inputs `['19']`; exact output lines `['Position: 4']`.
- Inputs `['8']`; exact output lines `['Position: -1']`.

## Level 2 - One bubble pass

Input four integers into the supplied list. Perform exactly one left-to-right ascending bubble pass, then print each value on its own line.



```python
values = []
for index in range(4):
    values.append(int(input("Value: ")))
for index in range(len(values) - 1):
    if values[index] > values[index + 1]:
        temporary = values[index]
        values[index] = values[index + 1]
        values[index + 1] = temporary
for value in values:
    print(value)
```

Tests:
- Inputs `['6', '2', '5', '1']`; exact output lines `['2', '5', '1', '6']`.
- Inputs `['1', '2', '3', '4']`; exact output lines `['1', '2', '3', '4']`.

## Level 3 - Ascending bubble sort

Input four integers, bubble-sort them in ascending order and print one value per line. Do not use .sort().

Teacher review must confirm adjacent comparisons, repeated passes and swaps.

```python
values = []
for index in range(4):
    values.append(int(input("Value: ")))
swapped = True
while swapped:
    swapped = False
    for index in range(len(values) - 1):
        if values[index] > values[index + 1]:
            temporary = values[index]
            values[index] = values[index + 1]
            values[index + 1] = temporary
            swapped = True
for value in values:
    print(value)
```

Tests:
- Inputs `['6', '2', '5', '1']`; exact output lines `['1', '2', '5', '6']`.
- Inputs `['4', '4', '0', '-2']`; exact output lines `['-2', '0', '4', '4']`.
- Inputs `['1', '2', '3', '4']`; exact output lines `['1', '2', '3', '4']`.

## Level 4 - Descending bubble sort

Input four integers, bubble-sort them in descending order and print one value per line. Do not use .sort().

Teacher review must confirm adjacent comparisons, repeated passes and swaps.

```python
values = []
for index in range(4):
    values.append(int(input("Value: ")))
swapped = True
while swapped:
    swapped = False
    for index in range(len(values) - 1):
        if values[index] < values[index + 1]:
            temporary = values[index]
            values[index] = values[index + 1]
            values[index + 1] = temporary
            swapped = True
for value in values:
    print(value)
```

Tests:
- Inputs `['6', '2', '5', '1']`; exact output lines `['6', '5', '2', '1']`.
- Inputs `['4', '4', '0', '-2']`; exact output lines `['4', '4', '0', '-2']`.
- Inputs `['1', '2', '3', '4']`; exact output lines `['4', '3', '2', '1']`.

