# Teacher Guide - Python Validation and Verification

This guide gives teacher notes and solution code for the `verivalid` course.

## 01_validate_or_verify.py

Introduces the difference between validation and verification. Students learn that valid data may still be incorrect.

```python
username = input("Enter a username: ")

if username == "":
    print("Validation failed")
else:
    print("Validation passed")

print("Verification means checking copied data against the original.")
```

## 02_range_check.py

Uses selection to check whether a numeric value lies within lower and upper bounds.

```python
mark = int(input("Enter the exam mark: "))

if mark >= 0 and mark <= 100:
    print("Valid mark")
else:
    print("Invalid mark")
```

## 03_length_check.py

Uses len() to count characters in a string.

```python
school_id = input("Enter the school ID: ")

if len(school_id) == 6:
    print("Valid ID")
else:
    print("Invalid ID")
```

## 04_type_check.py

Uses isdigit() before converting input to an integer, preventing a crash on text input.

```python
user_input = input("How many tickets? ")

if user_input.isdigit():
    tickets = int(user_input)
    print("Valid integer")
    print("Tickets:", tickets)
else:
    print("Invalid integer")
```

## 05_presence_check.py

Uses a while loop to keep asking until a required field is not empty.

```python
reason = input("Why do you enjoy Computer Science? ")

while reason == "":
    reason = input("Please enter something: ")

print("Thank you for answering")
print("Reason:", reason)
```

## 06_format_check.py

Combines length, slicing, isalpha() and isdigit() to test a pattern.

```python
code = input("Enter the challenge code: ")

if len(code) == 4 and code[0:2].isalpha() and code[2:4].isdigit():
    print("Valid code")
else:
    print("Invalid code")
```

## 07_check_digit.py

Introduces the idea of calculating a check digit from other digits. This is a simplified check digit algorithm before ISBN-style algorithms.

```python
code = input("Enter a 4 digit code: ")

total = 0

for i in range(3):
    total = total + int(code[i])

calculated_check_digit = total % 10
actual_check_digit = int(code[3])

print("Calculated check digit:", calculated_check_digit)

if calculated_check_digit == actual_check_digit:
    print("Code validated")
else:
    print("Code not valid")
```

## 08_visual_check.py

Shows visual checking as verification. The computer displays both versions, but the human makes the judgement.

```python
original = "Maya Patel"
entered_name = input("Copy this name exactly: Maya Patel\n")

print("Original:", original)
print("You entered:", entered_name)

visual_check = input("Do they match? Type YES or NO: ")

if visual_check == "YES":
    print("Visual check accepted")
else:
    print("Visual check failed")
```

## 09_double_entry.py

Shows double entry verification by comparing two pieces of entered data.

```python
email_one = input("Enter email address: ")
email_two = input("Enter email address again: ")

if email_one == email_two:
    print("Emails match")
else:
    print("Emails do not match")
```

## 10_combined_form.py

Combines presence, range, format and double entry checks in a single booking form.

```python
name = input("Enter your name: ")
age = int(input("Enter your age: "))
code = input("Enter booking code: ")
email_one = input("Enter email: ")
email_two = input("Enter email again: ")

valid = True

if name == "":
    print("Name missing")
    valid = False

if age < 0 or age > 120:
    print("Age invalid")
    valid = False

if not (len(code) == 4 and code[0:2].isalpha() and code[2:4].isdigit()):
    print("Code invalid")
    valid = False

if email_one != email_two:
    print("Emails do not match")
    valid = False

if valid == True:
    print("Booking accepted")
else:
    print("Booking rejected")
```

