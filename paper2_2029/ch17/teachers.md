# Teacher guide - Chapter 17

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Scenario initialisation

Initialise votes with 8 zeros for a small development fixture. Create four independent [activity,0] rows for activities 1 to 4. Print Size: and then each summary row as two space-separated values.



```python
votes = [0] * 8
summary = []
for activity in range(1, 5):
    summary.append([activity, 0])
print("Size:", len(votes))
for row in summary:
    print(row[0], row[1])
```

Tests:
- Inputs `[]`; exact output lines `['Size: 8', '1 0', '2 0', '3 0', '4 0']`.

## Level 2 - Scenario collection

Input four valid votes from 1 to 4 and store them at indices 0 to 3. Then display each vote on its own line. This is a reduced practice size.



```python
votes = [0] * 4
for index in range(4):
    votes[index] = int(input("Activity 1-4: "))
for vote in votes:
    print(vote)
```

Tests:
- Inputs `['2', '1', '4', '3']`; exact output lines `['2', '1', '4', '3']`.
- Inputs `['1', '1', '1', '1']`; exact output lines `['1', '1', '1', '1']`.

## Level 3 - Scenario counting

Use .count() to fill the supplied summary rows from the fixture. Display each activity and count separated by a space.



```python
votes = [2, 1, 2, 4, 1, 2, 4, 3]
summary = [[1, 0], [2, 0], [3, 0], [4, 0]]
for index in range(4):
    summary[index][1] = votes.count(summary[index][0])
for row in summary:
    print(row[0], row[1])
```

Tests:
- Inputs `[]`; exact output lines `['1 2', '2 3', '3 1', '4 2']`.

## Level 4 - Scenario sorting

Bubble-sort the supplied rows by descending count, preserving activity identifiers and the original order of ties. Display Activity x Votes y for each row.



```python
summary = [[1, 2], [2, 3], [3, 1], [4, 2]]
swapped = True
while swapped:
    swapped = False
    for index in range(len(summary) - 1):
        if summary[index][1] < summary[index + 1][1]:
            temporary = summary[index]
            summary[index] = summary[index + 1]
            summary[index + 1] = temporary
            swapped = True
for row in summary:
    print("Activity", row[0], "Votes", row[1])
```

Tests:
- Inputs `[]`; exact output lines `['Activity 2 Votes 3', 'Activity 1 Votes 2', 'Activity 4 Votes 2', 'Activity 3 Votes 1']`.

