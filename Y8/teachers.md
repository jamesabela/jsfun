# Year 8 Python — Teacher Guide & Solutions

This guide accompanies `Y8/index.html` and the 29 PRIMM lessons in `Y8/lessons/`.

Teachers can share any single lesson via `pythoncopy.html?url=https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/Y8/lessons/<slug>.py`.

## Unit 1: Printing, Variables & Operators — Fix the Greeting (Syntax Errors) (`u1_01_fix_greeting.py`)

- **Type:** Mini-Course 1A (Step 1 of 4)
- **PRIMM:** Predict, Run, Investigate, Modify
- **Note:** From Y8 Code 1.1 & Task 1.1. Emphasise reading the line number in the SyntaxError traceback and matching parentheses.

```python
print("Hello World")
print("Happy Monday... Year 8!")

name = input("What is your name: ")
hobby = input("What is your favourite hobby: ")
print("Nice to meet you,", name, "- enjoy", hobby)
```

## Unit 1: Printing, Variables & Operators — Streaming Profile Tracker (`u1_02_streaming_profile.py`)

- **Type:** Mini-Course 1A (Step 2 of 4)
- **PRIMM:** Predict, Run, Investigate, Modify
- **Note:** From Y8 Python 1.2 Variables. Reinforce why strings need quotes and integers do not, and why descriptive names like current_episode beat single letters.

```python
profile_name = "Sam"
current_episode = 4
current_episode = current_episode + 3

print("Welcome back,", profile_name)
print("Next up is Episode:", current_episode)
```

## Unit 1: Printing, Variables & Operators — Video Dashboard Counter (`u1_03_video_dashboard.py`)

- **Type:** Mini-Course 1A (Step 3 of 4)
- **PRIMM:** Make
- **Note:** From Y8 Python 1.2 Task B. Checks that students can update an integer variable and print both before and after states.

```python
video_title = "Python Tutorial"
likes = 99
print("Video:", video_title, "has", likes, "likes.")
likes = likes + 1
print("Video:", video_title, "has", likes, "likes.")
```

## Unit 1: Printing, Variables & Operators — Silly Story Bug Hunt (`u1_04_silly_story.py`)

- **Type:** Mini-Course 1A (Step 4 of 4)
- **PRIMM:** Predict, Modify, Make
- **Note:** From Y8 Practical Task 1.1. Completes Mini-Course 1A with a certificate.

```python
animal = input("Name an animal: ")
place = input("Name a place: ")
action = input("What are they doing? ")
name = input("Enter a person's name: ")
favourite_food = input("What is their favourite food? ")

print("The", animal, "went to", place, "to", action)
print(name, "brought some", favourite_food, "along for the trip!")
```

## Unit 1: Printing, Variables & Operators — The Shopping Basket Trap (str vs int) (`u1_05_casting_basket.py`)

- **Type:** Mini-Course 1B (Step 1 of 6)
- **PRIMM:** Predict, Run, Investigate, Modify
- **Note:** From Y8 Python 1.2 PRIMM Challenge 1 & 2. Classic str vs int misconception.

```python
item1 = int(input("Enter cost for Item 1: "))
item2 = int(input("Enter cost for Item 2: "))
item3 = int(input("Enter cost for Item 3: "))

total = item1 + item2 + item3
print("The total cost is", total)
```

## Unit 1: Printing, Variables & Operators — Concert Ticket Calculator (`u1_06_concert_tickets.py`)

- **Type:** Mini-Course 1B (Step 2 of 6)
- **PRIMM:** Predict, Modify
- **Note:** From Y8 Practical Task 1.2. Great opportunity to show that string * int repeats text in Python.

```python
print("--- Welcome to concert bookings! ---")
tickets = int(input("How many tickets would you like to buy? "))
price_per_ticket = 12
handling_charge = 3

total_cost = (tickets * price_per_ticket) + handling_charge
print("Your total price comes to: £", total_cost)
```

## Unit 1: Printing, Variables & Operators — Pet Age Calculator (`u1_07_pet_age.py`)

- **Type:** Mini-Course 1B (Step 3 of 6)
- **PRIMM:** Make
- **Note:** From Y8 Practical Task 1.2 Make challenge.

```python
human_years = int(input("How old is your dog in human years? "))
dog_years = human_years * 7
print("Your dog is", dog_years, "years old in dog years!")
```

## Unit 1: Printing, Variables & Operators — Theme Park Budget Planner (`u1_08_theme_park.py`)

- **Type:** Mini-Course 1B (Step 4 of 6)
- **PRIMM:** Investigate, Modify
- **Note:** From Y8 Practical Task 1.3. Good dry-run tracing practice.

```python
group_size = int(input("How many people are coming? "))
pocket_money = int(input("How much spending money does each person have (£)? "))
parking_fee = 5

total_budget = group_size * pocket_money
entry_pass_total = group_size * 25
money_left = total_budget - entry_pass_total - parking_fee
print("After buying entry passes and parking, your group has £", money_left, "left for food!")
```

## Unit 1: Printing, Variables & Operators — Retirement Countdown (`u1_09_retirement.py`)

- **Type:** Mini-Course 1B (Step 5 of 6)
- **PRIMM:** Make
- **Note:** From Y8 Practical Task 1.3 Make challenge. Connects to Rubric Level 3 (avoiding hardcoded magic numbers).

```python
name = input("What is your name? ")
current_age = int(input("How old are you currently? "))
retirement_age = 67
years_left = retirement_age - current_age
print("Hello", name, "you have", years_left, "years left until you can retire!")
```

## Unit 1: Printing, Variables & Operators — Two-Number Calculator (`u1_10_calculator.py`)

- **Type:** Mini-Course 1B (Step 6 of 6)
- **PRIMM:** Make
- **Note:** From Y8 Python 1.3 Task 1.3.2. Bridges Unit 1 operators into Unit 2 selection.

```python
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))
op = input("Choose operator (+, -, *, /): ")

if op == "+":
    print("Result:", num1 + num2)
elif op == "-":
    print("Result:", num1 - num2)
elif op == "*":
    print("Result:", num1 * num2)
elif op == "/":
    print("Result:", num1 / num2)
else:
    print("Unknown operator")
```

## Unit 2: Conditional Statements — Comparing Two Numbers (Example) (`u2_01_compare_numbers.py`)

- **Type:** Mini-Course 2 (Step 1 of 5)
- **PRIMM:** Predict, Run, Modify
- **Note:** From Y8 2.1 Conditional Statements slide 2 & Problem 2.

```python
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))

if num1 > num2:
    print("Larger number:", num1)
elif num2 > num1:
    print("Larger number:", num2)
else:
    print("Values are the same")
```

## Unit 2: Conditional Statements — Alphabet Quiz (`u2_02_alphabet_quiz.py`)

- **Type:** Mini-Course 2 (Step 2 of 5)
- **PRIMM:** Make
- **Note:** From Y8 2.1 Problem 1.

```python
guess = int(input("How many letters are in the alphabet? "))
if guess == 26:
    print("Correct")
else:
    print("Incorrect")
```

## Unit 2: Conditional Statements — Screen Time & TV Checker (`u2_03_tv_time.py`)

- **Type:** Mini-Course 2 (Step 3 of 5)
- **PRIMM:** Make
- **Note:** From Y8 2.1 Problem 3.

```python
tv_time = int(input("How many hours of TV do you watch each day? "))

if tv_time < 2:
    print("That should be ok")
elif tv_time >= 2 and tv_time <= 4:
    print("That will rot your brain")
else:
    print("That is too much TV!")
```

## Unit 2: Conditional Statements — Holiday Allowance Calculator (`u2_04_holiday_allowance.py`)

- **Type:** Mini-Course 2 (Step 4 of 5)
- **PRIMM:** Make
- **Note:** From Y8 2.1 Problem 4. Shows how a single formula in else avoids repeating 4 identical elif blocks.

```python
days_worked = int(input("How many days a week do you work (1-5)? "))

if days_worked == 5:
    holidays = 28
else:
    holidays = (28 / 5) * days_worked

print("Days holiday are:", holidays)
```

## Unit 2: Conditional Statements — Guess the Secret Number (1–10) (`u2_05_guess_number.py`)

- **Type:** Mini-Course 2 (Step 5 of 5)
- **PRIMM:** Make
- **Note:** From Y8 2.1 Problem 5. Uses random.randint so no fixed I/O test is attached; students test interactively.

```python
import random

number = random.randint(1, 10)
guess = int(input("Enter a guess between 1 and 10: "))

if guess == number:
    print("Correct")
else:
    print("Not what I was thinking")
```

## Unit 3: Conditional Loops (while) — WHILE Loop Counter & Countdown (Example) (`u3_01_while_counter.py`)

- **Type:** Example (Worked Example)
- **PRIMM:** Predict, Run, Investigate
- **Note:** From Y8 WHILE demo.py. Use this as a live teacher demo before starting Mini-Course 3A.

```python
counter = 0
while counter <= 10:
    print("The counter is", counter)
    counter = counter + 2
```

## Unit 3: Conditional Loops (while) — Count Up to 100 (`u3_02_count_to_100.py`)

- **Type:** Mini-Course 3A (Step 1 of 3)
- **PRIMM:** Make
- **Note:** From Y8 3. Creating conditional loops slide 5 Problem 1.

```python
number = int(input("Enter a number below 100: "))
while number < 100:
    number = number + 1
    print(number)
```

## Unit 3: Conditional Loops (while) — 2 Times Table up to 100 (`u3_03_two_times_table.py`)

- **Type:** Mini-Course 3A (Step 2 of 3)
- **PRIMM:** Make
- **Note:** From Y8 Problem 2 - multiples by 2.py.

```python
number = 0
print("***Multiplying by 2***")
while number <= 100:
    print("The number is:", number)
    number = number + 2
print("You have finished")
```

## Unit 3: Conditional Loops (while) — Running Total to 100 (`u3_04_running_total.py`)

- **Type:** Mini-Course 3A (Step 3 of 3)
- **PRIMM:** Make
- **Note:** From Y8 Problem 1 & Problem 5. Highlights accumulator initialisation before the loop.

```python
total = 0
while total <= 100:
    number = int(input("Please enter a number: "))
    total = total + number
    print("Running total:", total)
print("Total has exceeded 100!")
```

## Unit 3: Conditional Loops (while) — Password Gatekeeper (`u3_05_password_gatekeeper.py`)

- **Type:** Mini-Course 3B (Step 1 of 2)
- **PRIMM:** Predict, Make
- **Note:** From Y8 Problem 3 & Problem 4.

```python
accepted = False
secret = "GISKLumpur"

while accepted == False:
    attempt = input("Enter password: ")
    if attempt == secret:
        print("Correct password")
        accepted = True
    else:
        print("Incorrect password")
```

## Unit 3: Conditional Loops (while) — Username & Password Length Validator (`u3_06_username_password.py`)

- **Type:** Mini-Course 3B (Step 2 of 2)
- **PRIMM:** Make
- **Note:** From Y8 Problem 6 - password.py. Great moment to discuss 'and' vs 'or' in range validation.

```python
username = input("Enter username: ")
while len(username) < 8:
    username = input("Invalid username, enter another username: ")
print("Your username has been accepted")

password = input("Enter a password: ")
while len(password) < 8 or len(password) > 15:
    password = input("Invalid password, enter another password: ")
print("Your password has been accepted")
```

## Unit 4: Count-Controlled Loops (for & Turtle) — WHILE vs FOR & List Sum (Example) (`u4_01_while_vs_for.py`)

- **Type:** Example (Worked Example)
- **PRIMM:** Predict, Run, Investigate
- **Note:** From Y8 4. Creating count controlled loops slides 1 & 9. Watch out for range(start, stop) off-by-one!

```python
for count in range(1, 11):
    print("Count is:", count)
```

## Unit 4: Count-Controlled Loops (for & Turtle) — Turtle Square with a FOR Loop (`u4_02_turtle_square.py`)

- **Type:** Mini-Course 4 (Step 1 of 3)
- **PRIMM:** Predict, Run, Modify
- **Note:** From Y8 4. Creating count controlled loops slides 6 & 11.

```python
import turtle
# Triangle example:
for i in range(3):
    turtle.forward(100)
    turtle.right(120)
```

## Unit 4: Count-Controlled Loops (for & Turtle) — Two Squares with penup() & pendown() (`u4_03_two_squares.py`)

- **Type:** Mini-Course 4 (Step 2 of 3)
- **PRIMM:** Predict, Run, Modify
- **Note:** From Y8 4. Creating count controlled loops slide 12.

```python
import turtle
# Students add a third square or change pencolor("blue") before the second loop.
```

## Unit 4: Count-Controlled Loops (for & Turtle) — User-Defined Polygon (`u4_04_user_polygon.py`)

- **Type:** Mini-Course 4 (Step 3 of 3)
- **PRIMM:** Investigate, Modify, Make
- **Note:** From Y8 4.2 User-defined count controlled loops slides 1-3.

```python
import turtle

sides = int(input("How many sides would you like? "))
colour = input("What pen colour would you like? ")
angle = 360 / sides

turtle.pencolor(colour)
for i in range(sides):
    turtle.forward(60)
    turtle.right(angle)
```

## Unit 5: Subroutines (def) — Your First Subroutine: draw_square() (`u5_01_draw_square_def.py`)

- **Type:** Mini-Course 5 (Step 1 of 4)
- **PRIMM:** Predict, Run, Investigate
- **Note:** From Y8 5. Subroutines slides 3-4.

```python
import turtle
def draw_square():
    for i in range(4):
        turtle.forward(80)
        turtle.right(90)
draw_square()
```

## Unit 5: Subroutines (def) — Fill in the Blanks: draw_triangle() (`u5_02_draw_triangle_def.py`)

- **Type:** Mini-Course 5 (Step 2 of 4)
- **PRIMM:** Modify
- **Note:** From Y8 5. Subroutines slide 5.

```python
import turtle

def draw_triangle():
    for i in range(3):
        turtle.forward(80)
        turtle.right(120)

draw_triangle()
turtle.penup()
turtle.forward(120)
turtle.pendown()
draw_triangle()
```

## Unit 5: Subroutines (def) — Adding Parameters: draw_shape(sides, length) (`u5_03_polygon_params.py`)

- **Type:** Mini-Course 5 (Step 3 of 4)
- **PRIMM:** Predict, Run, Modify
- **Note:** From Y8 5. Subroutines slides 7 & 10 (Polygon Picker).

```python
import turtle

def draw_shape(sides, length):
    angle = 360 / sides
    for i in range(sides):
        turtle.forward(length)
        turtle.right(angle)

s = int(input("How many sides? "))
l = int(input("How big should each side be? "))
draw_shape(s, l)
```

## Unit 5: Subroutines (def) — Capstone: The House & Village Builder (`u5_04_village_stars.py`)

- **Type:** Mini-Course 5 (Step 4 of 4)
- **PRIMM:** Make
- **Note:** From Y8 5. Subroutines slides 8 & 10. Completes Mini-Course 5 with a certificate.

```python
import turtle

def draw_square():
    for i in range(4):
        turtle.forward(60)
        turtle.right(90)

def draw_triangle():
    for i in range(3):
        turtle.forward(60)
        turtle.left(120)

turtle.penup()
turtle.backward(150)
turtle.pendown()

for house in range(3):
    draw_square()
    draw_triangle()
    turtle.penup()
    turtle.forward(100)
    turtle.pendown()
```
