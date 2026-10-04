# Teacher guide - Chapter 20

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Mixed selection

Input a score. Display Gold at 80 or above, Silver from 50 to 79, otherwise Bronze.



```python
score = int(input("Score: "))
if score >= 80:
    print("Gold")
elif score >= 50:
    print("Silver")
else:
    print("Bronze")
```

Tests:
- Inputs `['49']`; exact output lines `['Bronze']`.
- Inputs `['50']`; exact output lines `['Silver']`.
- Inputs `['79']`; exact output lines `['Silver']`.
- Inputs `['80']`; exact output lines `['Gold']`.

## Level 2 - Mixed trace result

Input three integers. Display their total then the count of values at least 5, each on its own line.



```python
total = 0
count = 0
for index in range(3):
    value = int(input("Value: "))
    total = total + value
    if value >= 5:
        count = count + 1
print(total)
print(count)
```

Tests:
- Inputs `['4', '7', '5']`; exact output lines `['16', '2']`.
- Inputs `['1', '2', '3']`; exact output lines `['6', '0']`.

## Level 3 - Rating frequencies

Count the supplied eight-rating fixture into five [rating,count] rows. Display each rating and count separated by a space.



```python
ratings = [5, 3, 5, 1, 3, 5, 2, 4]
frequency = []
for rating in range(1, 6):
    frequency.append([rating, ratings.count(rating)])
for row in frequency:
    print(row[0], row[1])
```

Tests:
- Inputs `[]`; exact output lines `['1 1', '2 1', '3 2', '4 1', '5 3']`.

## Level 4 - Final rating sort

Bubble-sort the supplied frequency rows in descending count order. Preserve the original order of ties. Output Rating x Count y for every row.



```python
frequency = [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3]]
swapped = True
while swapped:
    swapped = False
    for index in range(len(frequency) - 1):
        if frequency[index][1] < frequency[index + 1][1]:
            temporary = frequency[index]
            frequency[index] = frequency[index + 1]
            frequency[index + 1] = temporary
            swapped = True
for row in frequency:
    print("Rating", row[0], "Count", row[1])
```

Tests:
- Inputs `[]`; exact output lines `['Rating 5 Count 3', 'Rating 3 Count 2', 'Rating 1 Count 1', 'Rating 2 Count 1', 'Rating 4 Count 1']`.

