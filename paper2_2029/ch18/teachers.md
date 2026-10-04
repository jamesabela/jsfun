# Teacher guide - Chapter 18

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Predict then implement

Predict cumulative totals of 2, 3 and 4. Use a loop to print the running total after each addition.



```python
total = 0
for value in range(2, 5):
    total = total + value
    print(total)
```

Tests:
- Inputs `[]`; exact output lines `['2', '5', '9']`.

## Level 2 - Exact output requirement

Input an integer from 1 to 5 inclusive, re-inputting silently until valid. Output only Accepted: and the value. Assume integer input.



```python
value = int(input("Value 1-5: "))
while value < 1 or value > 5:
    value = int(input("Value 1-5: "))
print("Accepted:", value)
```

Tests:
- Inputs `['1']`; exact output lines `['Accepted: 1']`.
- Inputs `['5']`; exact output lines `['Accepted: 5']`.
- Inputs `['0', '6', '3']`; exact output lines `['Accepted: 3']`.

## Level 3 - Correct the line

Repair the mean calculation. Input three scores and output Mean: with their mean.



```python
total = 0
for index in range(3):
    total = total + int(input("Score: "))
print("Mean:", total / 3)
```

Tests:
- Inputs `['2', '7', '9']`; exact output lines `['Mean: 6.0']`.
- Inputs `['5', '5', '5']`; exact output lines `['Mean: 5.0']`.

