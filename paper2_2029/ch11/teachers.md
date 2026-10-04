# Teacher guide - Chapter 11

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Write and read

Write Ready followed by a newline to message.txt, then read and display it. Use end="" to avoid adding a second newline.



```python
with open("message.txt", "w") as file:
    file.write("Ready\n")
with open("message.txt", "r") as file:
    text = file.read()
print(text, end="")
```

Tests:
- Inputs `[]`; exact output lines `['Ready']`.

## Level 2 - Read and transform

Keep the setup. Read notice.txt and display the original contents, then an uppercase version. Avoid extra blank lines.



```python
with open("notice.txt", "w") as file:
    file.write("Keep learning.\n")
with open("notice.txt", "r") as file:
    text = file.read()
print(text, end="")
print(text.upper(), end="")
```

Tests:
- Inputs `[]`; exact output lines `['Keep learning.', 'KEEP LEARNING.']`.

## Level 3 - Append a record

Keep the setup. Input a name and append it with a newline. Then display both names from the file.



```python
with open("names.txt", "w") as file:
    file.write("Aisha\n")
name = input("Name: ")
with open("names.txt", "a") as file:
    file.write(name + "\n")
with open("names.txt", "r") as file:
    print(file.read(), end="")
```

Tests:
- Inputs `['Ben']`; exact output lines `['Aisha', 'Ben']`.
- Inputs `['Chen']`; exact output lines `['Aisha', 'Chen']`.

## Level 4 - List of lines

Keep the setup. Use readlines() to obtain the lines and display Lines: followed by their count.



```python
with open("lines.txt", "w") as file:
    file.write("One\nTwo\nThree\n")
with open("lines.txt", "r") as file:
    lines = file.readlines()
print("Lines:", len(lines))
```

Tests:
- Inputs `[]`; exact output lines `['Lines: 3']`.

## Level 5 - Numeric file total

Keep the setup. Read one integer per line and display Total: followed by their sum.



```python
with open("scores.txt", "w") as file:
    file.write("12\n18\n9\n")
total = 0
with open("scores.txt", "r") as file:
    for line in file:
        total = total + int(line)
print("Total:", total)
```

Tests:
- Inputs `[]`; exact output lines `['Total: 39']`.

