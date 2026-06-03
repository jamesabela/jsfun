# While Loops Course: Teacher Guide & Answers

This guide contains the correct code solutions and pedagogical notes for teachers running the While Loops Course.

---

## 1. 01_count_to_five.py (Level 1 - Count to Five)

* **Goal:** Fix condition to print numbers up to 5.
* **Solution Code:**

```python
number = 1

while number <= 5:
    print(number)
    number = number + 1
```

* **Teacher Note:** Teaches basic while conditions. Explain that while loops repeat as long as the condition evaluates to `True`. Changing `number < 3` to `number <= 5` achieves the goal.

---

## 2. 02_countdown.py (Level 2 - Countdown)

* **Goal:** Update accumulator inside loop so number counts down.
* **Solution Code:**

```python
number = 5

while number > 0:
    print(number)
    number = number - 1

print("Go!")
```

* **Teacher Note:** Highlights updates. In infinite loops, if the loop variable is not updated correctly (e.g. `number = number + 1`), the loop runs forever. Changing it to `number - 1` counts down and triggers termination.

---

## 3. 03_password_gate.py (Level 3 - Password Gate)

* **Goal:** Prompt for password repeatedly until correct.
* **Solution Code:**

```python
password = ""

while password != "python":
    password = input("Enter password: ")

print("Access granted")
```

* **Teacher Note:** Introduces conditional looping using text inputs. The loop terminates when `password == "secret"`.

---

## 4. 04_guess_the_number.py (Level 4 - Guess the Number)

* **Goal:** Allow user to keep guessing secret number.
* **Solution Code:**

```python
guess = 0
secret = 7

while guess != secret:
    guess = int(input("Guess the number: "))

print("Correct!")
```

* **Teacher Note:** Teaches checking inputs against numbers.

---

## 5. 05_guess_with_clues.py (Level 5 - Guess With Clues)

* **Goal:** Give clues (Too low, Too high) on each guess.
* **Solution Code:**

```python
guess = 0
secret = 7

while guess != secret:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")

print("Correct")
```

* **Teacher Note:** Integrates selection (`if/elif`) checks inside a running while loop.

---

## 6. 06_limited_attempts.py (Level 6 - Limited Attempts)

* **Goal:** Limit guess attempts to 3.
* **Solution Code:**

```python
guess = 0
secret = 7
attempts = 0

attempts = 0
word = ""

while attempts < 3 and word != "apple":
    word = input("Word: ")
    attempts = attempts + 1

if word == "apple":
    print("Unlocked")
else:
    print("Locked")
```

* **Teacher Note:** Explores multiple conditions (`and`). Demonstrates tracking guess attempts alongside correct guess flags.

---

## 7. 07_running_total_until_zero.py (Level 7 - Total Until Zero)

* **Goal:** Add inputs together until user enters 0.
* **Solution Code:**

```python
total = 0
number = 1

while number != 0:
    number = int(input("Enter number: "))
    total = total + number

print("Total:", total)
```

* **Teacher Note:** Introduces sentinel values. Explain that `0` is used to end input collection and output the final sum.

---

## 8. 08_menu_loop.py (Level 8 - Menu Loop)

* **Goal:** Display menu options repeatedly until user quits.
* **Solution Code:**

```python
choice = ""

while choice != "q":
    print("1 - Hello")
    print("2 - Joke")
    print("q - Quit")

    choice = input("Choice: ")

    if choice == "1":
        print("Hello")
    elif choice == "2":
        print("Computer jokes are byte-sized")

print("Goodbye")
```

* **Teacher Note:** Practical menu loop structures where choice determines output commands.

---

## 9. 09_input_validation.py (Level 9 - Input Validation)

* **Goal:** Force user to enter 1, 2, or 3.
* **Solution Code:**

```python
age = 0

while age < 1 or age > 120:
    age = int(input("Age: "))

print("Age accepted:", age)
```

* **Teacher Note:** Introduces data validation concepts using lists and validation conditions (`not in`).

---

## 10. 10_turtle_dotted_line.py (Level 10 - Turtle Dotted Line)

* **Goal:** Draw dots until coordinate limit is reached.
* **Solution Code:**

```python
import turtle

turtle.speed(0)
turtle.penup()

x = -180

while x <= 180:
    turtle.goto(x, 0)
    turtle.dot(10)
    x = x + 30

print("Final x:", x)
```

* **Teacher Note:** While loops in Turtle graphics.

---

## 11. 11_turtle_growing_steps.py (Level 11 - Turtle Growing Steps)

* **Goal:** Draw steps that grow in size.
* **Solution Code:**

```python
import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-180, -150)
turtle.pendown()

length = 20
steps = 0

while length <= 100:
    turtle.forward(length)
    turtle.left(90)
    turtle.forward(20)
    turtle.right(90)
    length = length + 20
    steps = steps + 1

print("Steps:", steps)
```

* **Teacher Note:** Demonstrates incrementing variables (`step`) inside visual turtle loops.

---

## 12. 12_turtle_boundary_walk.py (Level 12 - Turtle Boundary Walk)

* **Goal:** Stop walking when coordinate limit is hit.
* **Solution Code:**

```python
import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-160, 0)
turtle.pendown()

while turtle.xcor() < 160:
    turtle.forward(20)
    turtle.dot(8)

print("Final position:", int(turtle.xcor()))
```

* **Teacher Note:** Combines multiple coordinates in a boundary check.

---

## 13. 13_turtle_shrinking_spiral.py (Level 13 - Turtle Shrinking Spiral)

* **Goal:** Draw shrinking segments until size is 0.
* **Solution Code:**

```python
import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("cyan")

length = 160
turns = 0

while length > 0:
    turtle.forward(length)
    turtle.right(90)
    length = length - 10
    turns = turns + 1

print("Final length:", length)
```

* **Teacher Note:** Decrementing values to draw inward-shrinking structures.

---

## 14. 14_final_pet_game.py (Level 14 - Final Pet Game)

* **Goal:** Make playing action decrease energy.
* **Solution Code:**

```python
energy = 3

while energy > 0:
    print("Energy:", energy)
    action = input("Type play or rest: ")

    if action == "play":
        print("The pet runs around")
        energy = energy - 1
    elif action == "rest":
        print("The pet rests")
        energy = energy + 1

    if energy > 5:
        energy = 5

print("Game over")
```

* **Teacher Note:** Final project implementing complex state changes (increase/decrease energy) and caps inside conditional loop iterations.
