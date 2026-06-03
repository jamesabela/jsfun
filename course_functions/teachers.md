# Teacher Guide - Python Procedures and Functions
This guide gives teacher notes and solution code for the `course_functions` course. The course is intentionally less test-heavy because procedures and functions are best taught through tracing, explanation, editing and extension.

## Pedagogical notes

The course starts with simple procedures because they are easier for many students: a procedure performs an action and does not require students to understand returned values immediately. Functions are introduced once students can already read a procedure header and call a subroutine. Later levels introduce Cambridge 9618 terminology, including function/procedure interface, parameter, argument, return value, local variable, global variable, scope, BYVAL and BYREF.

A useful classroom routine is:

1. Ask students to read the breadcrumb and key terms.
2. Ask them to predict what the code should do.
3. Let them complete the TODO sections.
4. Ask them to explain the difference between the header, parameters and arguments.
5. Ask them to write one Cambridge-style sentence using the key terms.

## Level 1 of 10 - First Procedure
**Goal:** Complete the procedure so it prints a welcome message. Then call the procedure.

**Key terms:** subroutine, procedure, procedure header, procedure call, identifier.

```python
def show_welcome():
    print("Welcome to Python Functions")

show_welcome()
```

## Level 2 of 10 - Parameters and Arguments
**Goal:** Complete the procedure so it uses the player name and score passed into it.

**Key terms:** parameter, argument, procedure interface, reusability.

```python
def show_score(name, score):
    print(name, "scored", score)

show_score("Ada", 120)
show_score("Grace", 95)
```

## Level 3 of 10 - Turtle Square Procedure
**Goal:** Complete the square procedure. It should move to x and y, then draw a square with side length size.

**Key terms:** procedure, parameter, abstraction, decomposition.

```python
import turtle

turtle.speed(0)
turtle.bgcolor("white")

def square_draw(x, y, size):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    for i in range(4):
        turtle.forward(size)
        turtle.right(90)

square_draw(-150, 100, 40)
square_draw(-40, 40, 70)
square_draw(80, -80, 50)

print("square procedure complete")

turtle.done()
```

## Level 4 of 10 - First Function Return
**Goal:** Complete the function so it returns the total number of coins.

**Key terms:** function, return value, function call, expression.

```python
def total_coins(gold, silver):
    return gold + silver

answer = total_coins(8, 5)
print("Total coins:", answer)
```

## Level 5 of 10 - Use a Function in an Expression
**Goal:** Complete the area function and use it to calculate the total area of two rectangles.

**Key terms:** function call, expression, return value, assignment.

```python
def rectangle_area(width, height):
    return width * height

room_one = rectangle_area(5, 4)
room_two = rectangle_area(6, 3)

total_area = room_one + room_two
print("Total area:", total_area)
```

## Level 6 of 10 - Local Variables and Scope
**Goal:** Complete the function so it calculates a local final score without changing the global score.

**Key terms:** local variable, global variable, scope, identifier.

```python
score = 10

def add_bonus(start_score, bonus):
    final_score = start_score + bonus
    return final_score

new_score = add_bonus(score, 5)

print("Global score:", score)
print("New score:", new_score)
```

## Level 7 of 10 - Return Stops a Function
**Goal:** Complete the function so it returns Invalid for negative ages and Adult for ages 18 or above.

**Key terms:** return statement, selection, validation, function.

```python
def age_group(age):
    if age < 0:
        return "Invalid"

    if age >= 18:
        return "Adult"

    return "Child"

print(age_group(-1))
print(age_group(20))
print(age_group(12))
```

## Level 8 of 10 - By Value and By Reference Ideas
**Goal:** Complete the procedure so it adds a new item to the inventory list.

**Key terms:** passing by value, passing by reference, mutable data, procedure.

```python
def add_item(inventory, item):
    inventory.append(item)

bag = ["map", "torch"]
add_item(bag, "key")

print(bag)
```

## Level 9 of 10 - Decomposition with Subroutines
**Goal:** Complete the function and procedure to make a tiny ticket machine.

**Key terms:** decomposition, modularity, procedure, function, maintainability.

```python
PRICE = 15

def calculate_total(tickets, price):
    return tickets * price

def print_receipt(destination, tickets, total):
    print("Destination:", destination)
    print("Tickets:", tickets)
    print("Total:", total)

destination = "KL City Centre"
tickets = 3
total = calculate_total(tickets, PRICE)
print_receipt(destination, tickets, total)
```

## Level 10 of 10 - Final Mini Project
**Goal:** Complete the mini RPG helper. The function should return damage. The procedure should print a battle report.

**Key terms:** procedure, function, parameter, argument, return value, scope, decomposition.

```python
def calculate_damage(attack, defence):
    damage = attack - defence
    if damage < 0:
        return 0
    return damage

def show_battle_report(hero, monster, damage):
    print(hero, "attacked", monster)
    print("Damage:", damage)

hero_name = "Python Knight"
monster_name = "Bug Beast"
damage_done = calculate_damage(12, 5)
show_battle_report(hero_name, monster_name, damage_done)
```
