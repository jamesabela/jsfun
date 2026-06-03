# Selection Course: Teacher Guide & Answers

This guide contains the correct code solutions and pedagogical notes for teachers running the Selection Course.

---

## 1. football.py (Rain Check)
* **Goal:** Output "umbrella" if it is raining, or "sunscreen" otherwise.
* **Solution Code:**
```python
test = input("Is it raining?")
if test == "y":
    print("umbrella")
else:
    print("sunscreen")
```
* **Teacher Note:** Teaches basic selection using `if` and `else` with string equality checking (`==`).

---

## 2. numbereat.py (Number ranges)
* **Goal:** Output bounds checking for a number.
* **Solution Code:**
```python
number = int(input("Number: "))
if number > 5:
    print("bigger than 5")
if number < 10:
    print("smaller than 10")
if number == 9:
    print("afraid")
```
* **Teacher Note:** Demonstrates multiple independent `if` statements. In this exercise, a single input (e.g. `6`) can trigger multiple true conditions ("bigger than 5" and "smaller than 10").

---

## 3. magician.py (Magician Guess)
* **Goal:** Validate guess against a secret number.
* **Solution Code:**
```python
guess = int(input("Guess: "))
secret = 5

if guess == secret:
    print("Correct!")
elif guess < secret:
    print("Too Low!")
else:
    print("Too High!")
```
* **Teacher Note:** Teaches three-way comparison using `if`, `elif`, and `else` where conditions are mutually exclusive.

---

## 4. letters.py (Alphabet letters)
* **Goal:** Print correctness based on letter count input.
* **Solution Code:**
```python
letters = int(input("Letters: "))
if letters == 26:
    print("Correct Number of letters!")
else:
    print("Wrong number of letters!")
```
* **Teacher Note:** Reinforces integers, input validation, and equality testing.

---

## 5. nums.py (Larger Number Picker)
* **Goal:** Find the larger of two inputs.
* **Solution Code:**
```python
num1 = int(input("First: "))
num2 = int(input("Second: "))

if num1 > num2:
    print(num1)
else:
    print(num2)
```
* **Teacher Note:** Introduces conditional outputs based on comparison operators (`>`).

---

## 6. bugs.py (Compare numbers)
* **Goal:** Compare two numbers, print which is bigger or if they are equal.
* **Solution Code:**
```python
num1 = int(input("Num 1: "))
num2 = int(input("Num 2: "))

if num1 > num2:
    print("number 1 is bigger")
elif num2 > num1:
    print("number 2 is bigger")
else:
    print("same")
```
* **Teacher Note:** Extends comparison to handle equal numbers using `elif` and `else`.

---

## 7. divides.py (Divisibility by 3)
* **Goal:** Output whether a number is divisible by 3.
* **Solution Code:**
```python
number = int(input("Num: "))
if number % 3 == 0:
    print("That divides by 3")
else:
    print("That doesn't divide by 3")
```
* **Teacher Note:** Integrates math operators (modulo `%`) into decision statements.

---

## 8. clocktime.py (12-hour to 24-hour time)
* **Goal:** Convert hours and AM/PM flag to 24h clock string.
* **Solution Code:**
```python
hours = int(input("Hours: "))
minutes = int(input("Minutes: "))
ampm = input("am or pm: ").strip().lower()

if ampm == "pm" and hours != 12:
    hours = hours + 12
elif ampm == "am" and hours == 12:
    hours = 0

print(f"{hours:02d}:{minutes:02d}")
```
* **Teacher Note:** Explores complex condition testing using logical operations (`and`). Demonstrates time boundary conversions (12 AM is 00 hours, PM adjustments).

---

## 9. movies.py (Movie Ticket Price)
* **Goal:** Print total price based on age and quantity.
* **Solution Code:**
```python
quantity = int(input("Quantity: "))
ticket_type = input("Type: ").strip().lower()

price = 10
if ticket_type == "child":
    price = 5
elif ticket_type == "student" or ticket_type == "senior":
    price = 6

print(quantity * price)
```
* **Teacher Note:** Final selection exercise combining string evaluations, multiple ticket discounts, and numeric calculation output.
