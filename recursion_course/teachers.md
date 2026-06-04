# Teacher Guide - Python Recursion Course

## Teaching notes

This course is deliberately more guided than many beginner courses because recursion is conceptually difficult. It uses three strands:

1. Mathematical recursion - factorial, Fibonacci and greatest common divisor.
2. Visual recursion - turtle circles, cinema rows and fractal trees.
3. Exam recursion - binary search, stack frames, unwinding and stack overflow.

Some levels are more tutorial-based. They still have light output checks so students can progress through Python Code Lab, but the teacher should focus on discussion, tracing and explanation.

## Key vocabulary to emphasise

Base case, general case, recursive call, call stack, stack frame, return address, local variable, parameter, unwinding, stack overflow, trace, iteration, memoisation.

## Solution code

## 01_what_is_recursion.py - What is recursion?

```python
def countdown(n):
    if n == 0:
        print("Blast off!")
    else:
        print(n)
        countdown(n - 1)

start = int(input("Start number: "))
countdown(start)
```

## 02_base_case_turtle_circle.py - Base case with turtle circles

```python
import turtle

turtle.speed(0)
turtle.bgcolor("white")

def draw_circle(x, y, radius):
    turtle.penup()
    turtle.goto(x, y - radius)
    turtle.pendown()
    turtle.circle(radius)
    if radius > 20:
        draw_circle(x, y, radius - 20)

draw_circle(0, 0, 120)
print("Circle recursion complete")
turtle.done()
```

## 03_factorial_math.py - Factorial as a mathematical pattern

```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

number = int(input("Enter a number: "))
print(factorial(number))
```

## 04_call_stack_unwinding.py - Call stack and unwinding

```python
# Tutorial level: read the guide and run this trace.
# There is a small output check, but the main learning is the stack explanation.

def factorial_trace(n, depth=0):
    print("  " * depth + "Call factorial(" + str(n) + ")")

    if n == 1:
        print("  " * depth + "Base case reached")
        return 1

    result = n * factorial_trace(n - 1, depth + 1)
    print("  " * depth + "Return " + str(result))
    return result

answer = factorial_trace(3)
print("Final answer", answer)
print("Stack unwinding complete")
```

## 05_fibonacci_sequence.py - Fibonacci sequence

```python
def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fib(n - 1) + fib(n - 2)

number = int(input("Which Fibonacci position? "))
print(fib(number))
```

## 06_gcd_euclid.py - Greatest common divisor

```python
def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

first = int(input("First number: "))
second = int(input("Second number: "))
print(gcd(first, second))
```

## 07_recursive_cinema.py - Recursive cinema rows

```python
import turtle

turtle.speed(0)
turtle.bgcolor("midnight blue")
turtle.color("gold")

def draw_seat(x, y):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    turtle.begin_fill()
    for i in range(4):
        turtle.forward(12)
        turtle.right(90)
    turtle.end_fill()

def draw_row(row_number, max_rows, seats, y):
    if row_number > max_rows:
        return
    start_x = -seats * 8
    for seat in range(seats):
        draw_seat(start_x + seat * 18, y)
    draw_row(row_number + 1, max_rows, seats + 1, y - 25)

draw_row(1, 5, 4, 120)
print("Cinema recursion complete")
turtle.done()
```

## 08_recursive_binary_search.py - Recursive binary search

```python
def binary_search(data, first, last, to_find):
    if first > last:
        return -1
    middle = (first + last) // 2
    if data[middle] == to_find:
        return middle
    if to_find < data[middle]:
        return binary_search(data, first, middle - 1, to_find)
    else:
        return binary_search(data, middle + 1, last, to_find)

numbers = [1, 3, 5, 9, 12, 15, 18]
target = int(input("Number to find: "))
print(binary_search(numbers, 0, len(numbers) - 1, target))
```

## 09_towers_of_hanoi.py - Towers of Hanoi

```python
def hanoi(disks, start, helper, end):
    if disks == 1:
        print("Move disk from", start, "to", end)
    else:
        hanoi(disks - 1, start, end, helper)
        print("Move disk from", start, "to", end)
        hanoi(disks - 1, helper, start, end)

hanoi(3, "A", "B", "C")
print("Hanoi complete")
```

## 10_gray_code.py - Gray code

```python
def gray(n):
    if n == 1:
        return ["0", "1"]
    smaller = gray(n - 1)
    first_half = []
    second_half = []
    for code in smaller:
        first_half.append("0" + code)
    for code in reversed(smaller):
        second_half.append("1" + code)
    return first_half + second_half

bits = int(input("Bits: "))
print(gray(bits))
```

## 11_turtle_tree.py - Recursive turtle tree

```python
import turtle

turtle.speed(0)
turtle.left(90)
turtle.penup()
turtle.goto(0, -180)
turtle.pendown()

def branch(length):
    if length < 10:
        return
    turtle.forward(length)
    turtle.right(30)
    branch(length - 15)
    turtle.left(60)
    branch(length - 15)
    turtle.right(30)
    turtle.backward(length)

branch(80)
print("Tree recursion complete")
turtle.done()
```

## 12_final_project.py - Final project: fractal cinema

```python
import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("white")

def screen_effect(x, y, size):
    if size < 10:
        return
    turtle.penup()
    turtle.goto(x, y - size)
    turtle.pendown()
    turtle.circle(size)
    screen_effect(x - size / 3, y, size / 2)
    screen_effect(x + size / 3, y, size / 2)

screen_effect(0, 60, 100)
print("Project complete")
turtle.done()
```

