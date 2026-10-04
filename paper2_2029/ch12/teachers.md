# Teacher guide - Chapter 12

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Inclusive range

Input integers until one is from 1 to 8 inclusive. Print Rejected for each invalid value and Accepted: with the final value.



```python
value = int(input("Value: "))
while value < 1 or value > 8:
    print("Rejected")
    value = int(input("Value: "))
print("Accepted:", value)
```

Tests:
- Inputs `['1']`; exact output lines `['Accepted: 1']`.
- Inputs `['8']`; exact output lines `['Accepted: 8']`.
- Inputs `['0', '9', '4']`; exact output lines `['Rejected', 'Rejected', 'Accepted: 4']`.

## Level 2 - Six-character code

Repeat input until its length is six. Print Wrong length for each invalid entry, then Accepted.



```python
code = input("Code: ")
while len(code) != 6:
    print("Wrong length")
    code = input("Code: ")
print("Accepted")
```

Tests:
- Inputs `['ABC123']`; exact output lines `['Accepted']`.
- Inputs `['ABCDE', 'ABCDEFG', '123456']`; exact output lines `['Wrong length', 'Wrong length', 'Accepted']`.

## Level 3 - Presence rule

Input a name. Accept a non-empty string; otherwise ask again. Print Missing for every empty entry, then Name: with the accepted value.

The empty-input retry is checked by the local verifier and should also be checked manually in Code Lab. It is omitted from the embedded tests because course.md does not specify an unambiguous encoding for an empty value within a multi-input test.

```python
name = input("Name: ")
while name == "":
    print("Missing")
    name = input("Name: ")
print("Name:", name)
```

Tests:
- Inputs `['Aisha']`; exact output lines `['Name: Aisha']`.
- Inputs `['', 'Ben']`; exact output lines `['Missing', 'Name: Ben']`.

## Level 4 - Code format

Accept exactly one uppercase letter followed by three digits. Input once and display Valid: True or Valid: False.



```python
code = input("Code: ")
valid = False
if len(code) == 4:
    if code[0] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        valid = True
        for index in range(1, 4):
            if code[index] not in "0123456789":
                valid = False
print("Valid:", valid)
```

Tests:
- Inputs `['A123']`; exact output lines `['Valid: True']`.
- Inputs `['a123']`; exact output lines `['Valid: False']`.
- Inputs `['AB12']`; exact output lines `['Valid: False']`.
- Inputs `['A12']`; exact output lines `['Valid: False']`.

## Level 5 - Double entry

Input a code twice. While the entries differ, display Mismatch and re-input both. Finally display Match.



```python
first = input("Code: ")
second = input("Again: ")
while first != second:
    print("Mismatch")
    first = input("Code: ")
    second = input("Again: ")
print("Match")
```

Tests:
- Inputs `['ABC', 'ABC']`; exact output lines `['Match']`.
- Inputs `['ABC', 'ABD', 'XYZ', 'XYZ']`; exact output lines `['Mismatch', 'Match']`.

