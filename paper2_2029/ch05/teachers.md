# Teacher guide - Chapter 5

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Length and first character

Input a non-empty string. Display Length: then First: on separate lines.



```python
text = input("Text: ")
print("Length:", len(text))
print("First:", text[0])
```

Tests:
- Inputs `['Python']`; exact output lines `['Length: 6', 'First: P']`.
- Inputs `['A']`; exact output lines `['Length: 1', 'First: A']`.

## Level 2 - Search position

Input text. Search for lowercase help and display Position: followed by its first index or -1. This level is case sensitive.



```python
text = input("Text: ")
print("Position:", text.find("help"))
```

Tests:
- Inputs `['help me']`; exact output lines `['Position: 0']`.
- Inputs `['need help']`; exact output lines `['Position: 5']`.
- Inputs `['hello']`; exact output lines `['Position: -1']`.

## Level 3 - Substring count

Input a string. Display Count: followed by the number of non-overlapping occurrences of aa.



```python
text = input("Text: ")
print("Count:", text.count("aa"))
```

Tests:
- Inputs `['aaaa']`; exact output lines `['Count: 2']`.
- Inputs `['banana']`; exact output lines `['Count: 0']`.
- Inputs `['aaa']`; exact output lines `['Count: 1']`.

## Level 4 - Normalise and decide

Input yes or another response in any letter case. Display Continue only when its lowercase form is yes; otherwise display Stop.



```python
answer = input("Continue? ").lower()
if answer == "yes":
    print("Continue")
else:
    print("Stop")
```

Tests:
- Inputs `['YES']`; exact output lines `['Continue']`.
- Inputs `['Yes']`; exact output lines `['Continue']`.
- Inputs `['no']`; exact output lines `['Stop']`.

## Level 5 - Team label

Input a team name. Display its uppercase version and then a version with all spaces replaced by underscores.



```python
team = input("Team: ")
print(team.upper())
print(team.replace(" ", "_"))
```

Tests:
- Inputs `['red foxes']`; exact output lines `['RED FOXES', 'red_foxes']`.
- Inputs `['Code']`; exact output lines `['CODE', 'Code']`.

