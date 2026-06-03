# For Loops Course: Teacher Guide & Answers

This guide contains the correct code solutions and pedagogical notes for teachers running the For Loops Course.

---

## 1. 01_repeat_message.py (Level 1 - Repeat Message)
* **Goal:** Edit loop range to repeat message 5 times on the same line.
* **Solution Code:**
```python
for i in range(5):
    print("Python", end=" ")
```
* **Teacher Note:** Teaches simple iteration limits. The `range(5)` runs the loop body exactly 5 times. Pre-sets `end=" "` to print horizontally.

---

## 2. 02_counting_up.py (Level 2 - Counting Up)
* **Goal:** Edit loop range to count from 1 to 5.
* **Solution Code:**
```python
for number in range(1, 6):
    print(number)
```
* **Teacher Note:** Introduces starting bounds in `range()`. Explain that `range(start, stop)` includes `start` but excludes `stop`, meaning `range(1, 6)` generates `1, 2, 3, 4, 5`.

---

## 3. 03_counting_down.py (Level 3 - Counting Down)
* **Goal:** Count down from 5 to 1.
* **Solution Code:**
```python
for number in range(5, 0, -1):
    print(number)

print("Blast off!")
```
* **Teacher Note:** Explores loops with negative steps. The third argument `-1` in `range(5, 0, -1)` specifies counting backwards.

---

## 4. 04_times_table.py (Level 4 - Times Table)
* **Goal:** Multiply input number by 1 through 5.
* **Solution Code:**
```python
number = int(input("Choose a number: "))

for i in range(1, 6):
    print(i * number)
```
* **Teacher Note:** Combines user input and mathematical operations inside a loop to output times table multiples.

---

## 5. 05_total_score.py (Level 5 - Total Score)
* **Goal:** Accumulate 5 scores.
* **Solution Code:**
```python
total = 0

for i in range(5):
    score = int(input("Enter score: "))
    total = total + score

print("Total score:", total)
```
* **Teacher Note:** Introduces accumulators (running totals). Explain how `total = total + score` stores the running sum across loop steps.

---

## 6. 06_average_score.py (Level 6 - Average Score)
* **Goal:** Accumulate 5 scores and calculate average.
* **Solution Code:**
```python
total = 0

for i in range(5):
    score = int(input("Enter score: "))
    total = total + score

print("Average score:", total / 5)
```
* **Teacher Note:** Extends loops by performing a final calculation (division) outside the loop using the accumulated total.

---

## 7. 07_loop_through_colours.py (Level 7 - Loop Through Colours)
* **Goal:** Loop through list and prefix colours.
* **Solution Code:**
```python
colours = ["red", "green", "blue", "purple"]

for colour in colours:
    print("Colour:", colour)
```
* **Teacher Note:** Teaches iterating directly over members of a List.

---

## 8. 08_emoji_stairs.py (Level 8 - Emoji Stairs)
* **Goal:** Multiply output characters to form stairs.
* **Solution Code:**
```python
symbol = input("Symbol: ")

for i in range(1, 6):
    print(symbol * i)
```
* **Teacher Note:** Teaches string repetition. In Python, multiplying a string by an integer (e.g. '*' * 3) repeats the character ('***').

---

## 9. 09_turtle_square.py (Level 9 - Turtle Square)
* **Goal:** Draw a square using Turtle loops.
* **Solution Code:**
```python
import turtle

for i in range(4):
    turtle.forward(100)
    turtle.right(90)
```
* **Teacher Note:** Introduction to visual Turtle loops. A square is drawn by repeating forward moves and 90-degree turns 4 times.

---

## 10. 10_turtle_polygon.py (Level 10 - Turtle Polygon)
* **Goal:** Draw any polygon using user-defined sides.
* **Solution Code:**
```python
import turtle

sides = int(input("How many sides? "))
angle = 360 / sides

for i in range(sides):
    turtle.forward(100)
    turtle.left(angle)
```
* **Teacher Note:** Advanced math with geometry. Show how loop count (`range(sides)`) and turning angles (`360 / sides`) dynamically adjust based on inputs.

---

## 11. 11_turtle_spiral.py (Level 11 - Turtle Spiral)
* **Goal:** Draw a spiral pattern.
* **Solution Code:**
```python
import turtle

for i in range(100):
    turtle.forward(i * 2)
    turtle.right(90)
```
* **Teacher Note:** Demonstrates using the dynamic loop counter `i` inside turtle motions. Because `i` increases every loop step, `forward(i * 2)` moves further each time, making a spiral.

---

## 12. 12_nested_grid.py (Level 12 - Nested Grid)
* **Goal:** Output a grid of hashtags.
* **Solution Code:**
```python
for row in range(4):
    for col in range(4):
        print("#", end="")
    print()
```
* **Teacher Note:** Introduces nested loops. Explain that the inner loop runs to completion for each step of the outer loop. `print()` adds a newline after each row completes.

---

## 13. 13_turtle_dot_grid.py (Level 13 - Turtle Dot Grid)
* **Goal:** Update the loop to draw a grid with 5 columns.
* **Solution Code:**
```python
import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-100, 100)

for row in range(5):
    for column in range(5):
        turtle.dot(10)
        turtle.forward(40)

    turtle.goto(-100, 100 - ((row + 1) * 40))
```
* **Teacher Note:** Practical application of nested loops in Turtle graphics. Changing `range(3)` to `range(5)` draws the expected columns.

---

## 14. 14_final_turtle_art.py (Level 14 - Final Turtle Art)
* **Goal:** Creative assignment drawing complex patterns.
* **Solution Code:**
```python
import turtle

turtle.speed(0)
turtle.bgcolor("black")

colours = ["red", "yellow", "lime", "cyan", "magenta", "white"]

for i in range(60):
    turtle.color(colours[i % 6])
    turtle.forward(i * 3)
    turtle.right(59)

print("Art complete")
```
* **Teacher Note:** Final creative project utilizing loops, modulo coloring, and index-based scaling.
