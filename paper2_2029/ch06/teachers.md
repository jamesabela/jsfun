# Teacher guide - Chapter 6

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Plan a fee calculation

First identify the input, process, output and storage in writing. Then input student count and display Total: using 5 per student plus one fixed charge of 12.

Review the written plan separately; output checks cannot assess abstraction explanations.

```python
FEE = 5
EQUIPMENT = 12
students = int(input("Students: "))
print("Total:", students * FEE + EQUIPMENT)
```

Tests:
- Inputs `['4']`; exact output lines `['Total: 32']`.
- Inputs `['10']`; exact output lines `['Total: 62']`.

## Level 2 - Extend the model

Use the same fee calculation but deduct 10 when there are at least 10 students. Display Total:. Explain why student count is essential.



```python
FEE = 5
EQUIPMENT = 12
students = int(input("Students: "))
total = students * FEE + EQUIPMENT
if students >= 10:
    total = total - 10
print("Total:", total)
```

Tests:
- Inputs `['9']`; exact output lines `['Total: 57']`.
- Inputs `['10']`; exact output lines `['Total: 52']`.
- Inputs `['12']`; exact output lines `['Total: 62']`.

