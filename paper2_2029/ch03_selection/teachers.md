# Teacher Guide - Selection and Decisions

## Level 1 - Simple if
Goal: include the boundary value 50.
```python
score = int(input("Score: "))
if score >= 50:
    print("Pass")
```

## Level 2 - if and else
Goal: recognise that 13 is not below 13.
```python
age = int(input("Age: "))
if age < 13:
    print("Child")
else:
    print("Teen or adult")
```

## Level 3 - elif
Goal: order overlapping conditions from highest/specific to lower/general.
```python
score = int(input("Score: "))
if score >= 80:
    print("Excellent")
elif score >= 50:
    print("Pass")
else:
    print("Not yet passed")
```

## Level 4 - and and or
Goal: use and when both requirements must be met.
```python
age = int(input("Age: "))
height = int(input("Height in cm: "))
if age >= 12 and height >= 140:
    print("Allowed")
else:
    print("Not allowed")
```

## Level 5 - not
Goal: reverse a Boolean condition.
```python
logged_in_text = input("Logged in? True/False: ")
logged_in = logged_in_text == "True"
if not logged_in:
    print("Please log in")
else:
    print("Welcome")
```

## Level 6 - Nested selection
Goal: include the 100 point boundary inside a membership check.
```python
member_text = input("Member? True/False: ")
member = member_text == "True"
points = int(input("Points: "))
if member == True:
    if points >= 100:
        print("Reward unlocked")
    else:
        print("More points needed")
else:
    print("Membership required")
```

## Level 7 - Strings
Goal: use == for comparison.
```python
answer = input("Continue? ")
if answer == "yes":
    print("Continuing")
else:
    print("Stopping")
```

## Level 8 - match-case
Goal: use fixed cases and a default wildcard.
```python
option = int(input("Choose 1-3: "))
match option:
    case 1:
        print("Play")
    case 2:
        print("Settings")
    case 3:
        print("Quit")
    case _:
        print("Invalid")
```
