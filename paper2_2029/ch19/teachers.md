# Teacher guide - Chapter 19

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Recall remainder

Input an integer and output its remainder on division by 6.



```python
number = int(input("Number: "))
print(number % 6)
```

Tests:
- Inputs `['29']`; exact output lines `['5']`.
- Inputs `['18']`; exact output lines `['0']`.

## Level 2 - Recall string methods

Input text. Display its title-case version and its length on separate lines.



```python
text = input("Text: ")
print(text.title())
print(len(text))
```

Tests:
- Inputs `['red fox']`; exact output lines `['Red Fox', '7']`.
- Inputs `['CODE']`; exact output lines `['Code', '4']`.

## Level 3 - Recall list removal

Pop the first item from [8,3,12]. Display Removed: with its value and Length: with the remaining length.



```python
values = [8, 3, 12]
removed = values.pop(0)
print("Removed:", removed)
print("Length:", len(values))
```

Tests:
- Inputs `[]`; exact output lines `['Removed: 8', 'Length: 2']`.

## Level 4 - Recall return values

Define triple(number) to return three times its argument. Input an integer and display the return value.



```python
def triple(number):
    return number * 3

number = int(input("Number: "))
print(triple(number))
```

Tests:
- Inputs `['7']`; exact output lines `['21']`.
- Inputs `['0']`; exact output lines `['0']`.
- Inputs `['-2']`; exact output lines `['-6']`.

