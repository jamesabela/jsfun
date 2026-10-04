# Teacher guide - Chapter 9

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Procedure call

Define show_title() to print Score Centre. Call it once.



```python
def show_title():
    print("Score Centre")

show_title()
```

Tests:
- Inputs `[]`; exact output lines `['Score Centre']`.

## Level 2 - Parameters

Define greet(name) and call it using an entered name. Output Hello followed by a space and the name.



```python
def greet(name):
    print("Hello", name)

name = input("Name: ")
greet(name)
```

Tests:
- Inputs `['Aisha']`; exact output lines `['Hello Aisha']`.
- Inputs `['Ben']`; exact output lines `['Hello Ben']`.

## Level 3 - Return a calculation

Define area(width, height) that returns the product. Input two integers and print the returned value.

Check that the calculation is returned, not printed inside area.

```python
def area(width, height):
    return width * height

width = int(input("Width: "))
height = int(input("Height: "))
print(area(width, height))
```

Tests:
- Inputs `['4', '3']`; exact output lines `['12']`.
- Inputs `['7', '2']`; exact output lines `['14']`.

## Level 4 - Local result

Complete doubled(number), using a local result variable and returning it. Input an integer and print the returned result.



```python
def doubled(number):
    result = number * 2
    return result

number = int(input("Number: "))
print(doubled(number))
```

Tests:
- Inputs `['6']`; exact output lines `['12']`.
- Inputs `['-3']`; exact output lines `['-6']`.

## Level 5 - Numeric helpers

Use the supplied scores to display Total:, Count: for 8, Maximum:, Minimum: and Mean:, in that order. Use statistics.mean and the appropriate helpers.



```python
import statistics
scores = [8, 12, 8, 20]
print("Total:", sum(scores))
print("Count:", scores.count(8))
print("Maximum:", max(scores))
print("Minimum:", min(scores))
print("Mean:", statistics.mean(scores))
```

Tests:
- Inputs `[]`; exact output lines `['Total: 48', 'Count: 2', 'Maximum: 20', 'Minimum: 8', 'Mean: 12']`.

