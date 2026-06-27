# Teacher Guide - Python Error Detectives: Top 10 Beginner Mistakes

## Course goals

Students learn to use Python error messages as clues, recognise ten common beginner mistakes and repair code with small, deliberate changes.

## Suggested routine

1. Predict what the broken code is meant to do.
2. Run it and read the error message.
3. Find the relevant line.
4. Make the smallest possible repair.
5. Run the automated test.

## Solutions

### Level 1: Case Closed?

**Focus:** Python is case-sensitive. Built-in function names must use the correct lowercase letters.

**Likely message:** `NameError`

```python
print("Welcome, detective!")
```

### Level 2: The Missing Quotes

**Focus:** Python needs speech marks around text. Without them, it treats the text as a variable name.

**Likely message:** `SyntaxError`

```python
print("Evidence found")
```

### Level 3: Close the Case

**Focus:** Opening and closing brackets must come in matching pairs.

**Likely message:** `SyntaxError`

```python
print("Case 3 complete")
```

### Level 4: Line Up the Evidence

**Focus:** Indented code belongs inside an if statement, loop or function. Python uses indentation to understand the structure.

**Likely message:** `IndentationError`

```python
code = 7

if code == 7:
    print("Secret message unlocked")
```

### Level 5: The Missing Signal

**Focus:** Statements such as if, else, for, while and def end with a colon.

**Likely message:** `SyntaxError`

```python
key = "gold"

if key == "gold":
    print("Door unlocked")
```

### Level 6: Create Before Use

**Focus:** Python runs from top to bottom. A variable must receive a value before the program tries to use it.

**Likely message:** `NameError`

```python
detective = "Riley"
print(detective)
```

### Level 7: A Suspicious Spelling

**Focus:** A variable name must be written exactly the same way each time, including underscores and capital letters.

**Likely message:** `NameError`

```python
high_score = 250
print(high_score)
```

### Level 8: Text or Number?

**Focus:** The input function returns text. Use int() when you need to calculate with a whole number.

**Likely message:** `TypeError`

```python
age = int(input("Enter your age: "))
next_age = age + 1
print("Next year you will be", next_age)
```

### Level 9: Assign or Compare?

**Focus:** A single equals sign assigns a value. A double equals sign compares two values.

**Likely message:** `SyntaxError`

```python
password = "python"

if password == "python":
    print("Access granted")
```

### Level 10: Escape the Loop

**Focus:** A while loop must make progress towards its stopping condition. Otherwise, it can continue forever.

**Likely message:** `Logic error`

```python
count = 1

while count <= 5:
    print(count)
    count = count + 1
```
