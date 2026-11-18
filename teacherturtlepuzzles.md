# Turtle Quest — Teacher Solutions Guide

Tested 3-star Python reference solutions for all 40 levels of [Turtle Quest](turtlepuzzles.html).

## World 1: Turtle Training (Training Grounds)

*Learn sequencing, movement, turns, and debugging.*

### Level 1: First Steps

- **Objective:** Move forward to reach the flag.
- **3-Star Line Limit:** 3 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 3 meaningful lines, 3 executed Turtle ops (3 ⭐)

```python
import turtle

turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
```

### Level 2: Around the Corner

- **Objective:** Navigate a single left-hand corner.
- **3-Star Line Limit:** 7 meaningful lines (2-Star: 8)
- **Reference Solution Stats:** 7 meaningful lines, 7 executed Turtle ops (3 ⭐)

```python
import turtle

turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
```

### Level 3: The Other Way

- **Objective:** Navigate a right-hand corner.
- **3-Star Line Limit:** 7 meaningful lines (2-Star: 8)
- **Reference Solution Stats:** 7 meaningful lines, 7 executed Turtle ops (3 ⭐)

```python
import turtle

turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
```

### Level 4: Treasure Trail

- **Objective:** Collect three gems along a winding path.
- **3-Star Line Limit:** 13 meaningful lines (2-Star: 14)
- **Reference Solution Stats:** 13 meaningful lines, 13 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
```

### Level 5: Reverse Gear

- **Objective:** Move backwards out of a dead end.
- **3-Star Line Limit:** 6 meaningful lines (2-Star: 8)
- **Reference Solution Stats:** 6 meaningful lines, 6 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.backward(40)
turtle.backward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
```

### Level 6: Zigzag

- **Objective:** Navigate a corridor with alternating turns.
- **3-Star Line Limit:** 12 meaningful lines (2-Star: 14)
- **Reference Solution Stats:** 12 meaningful lines, 12 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
```

### Level 7: Choose Your Route

- **Objective:** Find the shortest route through a maze.
- **3-Star Line Limit:** 12 meaningful lines (2-Star: 14)
- **Reference Solution Stats:** 12 meaningful lines, 12 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
```

### Level 8: The Great Escape

- **Objective:** Complete a larger maze using all the movement commands.
- **3-Star Line Limit:** 17 meaningful lines (2-Star: 19)
- **Reference Solution Stats:** 17 meaningful lines, 17 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.right(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
turtle.left(90)
turtle.forward(40)
turtle.forward(40)
turtle.forward(40)
```

## World 2: The Loop Forest (Woodland Environment)

*Master count-controlled loops to make your programs shorter.*

### Level 9: Walking the Line

- **Objective:** Replace repeated forward commands with a loop.
- **3-Star Line Limit:** 2 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 2 meaningful lines, 7 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(7):
    turtle.forward(40)
```

### Level 10: Staircase

- **Objective:** Repeat a movement pattern through a staircase-shaped maze.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 20 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(5):
    turtle.forward(40)
    turtle.left(90)
    turtle.forward(40)
    turtle.right(90)
```

### Level 11: A Square Deal

- **Objective:** Travel around a square using iteration.
- **3-Star Line Limit:** 6 meaningful lines (2-Star: 8)
- **Reference Solution Stats:** 4 meaningful lines, 20 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(4):
    for j in range(4):
        turtle.forward(40)
    turtle.left(90)
```

### Level 12: The Repeating Trail

- **Objective:** Follow a corridor containing repeated turns.
- **3-Star Line Limit:** 13 meaningful lines (2-Star: 15)
- **Reference Solution Stats:** 13 meaningful lines, 24 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(2):
    turtle.forward(40)
    turtle.forward(40)
    turtle.left(90)
    turtle.forward(40)
    turtle.forward(40)
    turtle.right(90)
    turtle.forward(40)
    turtle.forward(40)
    turtle.right(90)
    turtle.forward(40)
    turtle.forward(40)
    turtle.left(90)
```

### Level 13: Stepping Stones

- **Objective:** Collect gems placed at regular intervals along a repeating path.
- **3-Star Line Limit:** 2 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 2 meaningful lines, 8 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(8):
    turtle.forward(40)
```

### Level 14: Zigzag Again

- **Objective:** Repeat a four-command zigzag pattern.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 24 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(6):
    turtle.forward(40)
    turtle.left(90)
    turtle.forward(40)
    turtle.right(90)
```

### Level 15: The Long Road

- **Objective:** Complete a lengthy repeating maze within a small line limit.
- **3-Star Line Limit:** 8 meaningful lines (2-Star: 10)
- **Reference Solution Stats:** 8 meaningful lines, 24 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(8):
    turtle.forward(40)
turtle.right(90)
for i in range(6):
    turtle.forward(40)
turtle.right(90)
for i in range(8):
    turtle.forward(40)
```

### Level 16: Forest Guardian

- **Objective:** Combine repeated sequences and individual commands to escape a complex maze.
- **3-Star Line Limit:** 11 meaningful lines (2-Star: 13)
- **Reference Solution Stats:** 11 meaningful lines, 19 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(4):
    turtle.forward(40)
turtle.left(90)
for i in range(4):
    turtle.forward(40)
turtle.right(90)
for i in range(4):
    turtle.forward(40)
turtle.left(90)
for i in range(4):
    turtle.forward(40)
```

## World 3: The Art Academy (Colourful Drawing Studio)

*Explore angles, pen control, and colours to draw shapes.*

### Level 17: Draw a Square

- **Objective:** Draw a square using iteration.
- **3-Star Line Limit:** 3 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 3 meaningful lines, 8 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(4):
    turtle.forward(120)
    turtle.left(90)
```

### Level 18: The Triangle

- **Objective:** Discover the correct turning angle for an equilateral triangle.
- **3-Star Line Limit:** 3 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 3 meaningful lines, 6 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(3):
    turtle.forward(120)
    turtle.left(120)
```

### Level 19: Hexagon Island

- **Objective:** Draw a regular hexagon.
- **3-Star Line Limit:** 3 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 3 meaningful lines, 12 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(6):
    turtle.forward(80)
    turtle.left(60)
```

### Level 20: Reach for the Stars

- **Objective:** Draw a five-pointed star.
- **3-Star Line Limit:** 3 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 3 meaningful lines, 10 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(5):
    turtle.forward(140)
    turtle.right(144)
```

### Level 21: Colour Splash

- **Objective:** Complete a drawing using specified colours.
- **3-Star Line Limit:** 12 meaningful lines (2-Star: 13)
- **Reference Solution Stats:** 12 meaningful lines, 12 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.pencolor("red")
turtle.forward(120)
turtle.left(90)
turtle.pencolor("blue")
turtle.forward(120)
turtle.left(90)
turtle.pencolor("green")
turtle.forward(120)
turtle.left(90)
turtle.pencolor("purple")
turtle.forward(120)
turtle.left(90)
```

### Level 22: Invisible Ink

- **Objective:** Use pen up and pen down to draw two separate shapes.
- **3-Star Line Limit:** 9 meaningful lines (2-Star: 11)
- **Reference Solution Stats:** 9 meaningful lines, 19 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(4):
    turtle.forward(80)
    turtle.left(90)
turtle.penup()
turtle.forward(160)
turtle.pendown()
for i in range(4):
    turtle.forward(80)
    turtle.left(90)
```

### Level 23: The Octagon

- **Objective:** Draw an octagon using iteration.
- **3-Star Line Limit:** 3 meaningful lines (2-Star: 4)
- **Reference Solution Stats:** 3 meaningful lines, 16 executed Turtle ops (3 ⭐)

```python
import turtle

for i in range(8):
    turtle.forward(60)
    turtle.left(45)
```

### Level 24: Flower Power

- **Objective:** Draw a geometric flower using repeated shapes.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 54 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(6):
    for j in range(4):
        turtle.forward(60)
        turtle.left(90)
    turtle.left(60)
```

## World 4: The Crystal Caves (Underground Crystal Caverns)

*Combine nested loops for patterns and complex mazes.*

### Level 25: Double Trouble

- **Objective:** Use two separate loops to complete two repeating paths.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 11 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(4):
    turtle.forward(40)
turtle.left(90)
for i in range(6):
    turtle.forward(40)
```

### Level 26: Square Within a Square

- **Objective:** Draw a pattern of squares using nested loops.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 36 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(4):
    for j in range(4):
        turtle.forward(80)
        turtle.left(90)
    turtle.left(90)
```

### Level 27: The Gem Grid

- **Objective:** Collect gems arranged in rows and columns.
- **3-Star Line Limit:** 13 meaningful lines (2-Star: 15)
- **Reference Solution Stats:** 12 meaningful lines, 15 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(3):
    turtle.forward(40)
turtle.left(90)
turtle.forward(80)
turtle.left(90)
for i in range(3):
    turtle.forward(40)
turtle.right(90)
turtle.forward(80)
turtle.right(90)
for i in range(3):
    turtle.forward(40)
```

### Level 28: Robot Factory

- **Objective:** Navigate several identical obstacle patterns.
- **3-Star Line Limit:** 13 meaningful lines (2-Star: 15)
- **Reference Solution Stats:** 9 meaningful lines, 24 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(3):
    turtle.forward(40)
    turtle.left(90)
    turtle.forward(80)
    turtle.right(90)
    turtle.forward(80)
    turtle.right(90)
    turtle.forward(80)
    turtle.left(90)
```

### Level 29: The Colourful Wheel

- **Objective:** Draw repeated shapes around a central point.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 56 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(8):
    for j in range(3):
        turtle.forward(80)
        turtle.left(120)
    turtle.left(45)
```

### Level 30: The Long Staircase

- **Objective:** Use nested loops to navigate a large staircase maze.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 32 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(8):
    turtle.forward(40)
    turtle.left(90)
    turtle.forward(40)
    turtle.right(90)
```

### Level 31: Pattern Master

- **Objective:** Reproduce a complex geometric pattern within a code limit.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 7)
- **Reference Solution Stats:** 5 meaningful lines, 78 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(6):
    for j in range(6):
        turtle.forward(60)
        turtle.left(60)
    turtle.left(60)
```

### Level 32: Crystal Guardian

- **Objective:** Complete a challenging maze combining nested loops and individual commands.
- **3-Star Line Limit:** 4 meaningful lines (2-Star: 6)
- **Reference Solution Stats:** 4 meaningful lines, 32 executed Turtle ops (3 ⭐)

```python
import turtle
for i in range(4):
    for j in range(7):
        turtle.forward(40)
    turtle.left(90)
```

## World 5: The Algorithm Kingdom (Futuristic Castle)

*Build reusable functions and combine everything you know.*

### Level 33: Your First Function

- **Objective:** Create a function that draws a square.
- **3-Star Line Limit:** 5 meaningful lines (2-Star: 6)
- **Reference Solution Stats:** 5 meaningful lines, 8 executed Turtle ops (3 ⭐)

```python
import turtle
def my_function():
    for i in range(4):
        turtle.forward(100)
        turtle.left(90)
my_function()
```

### Level 34: Twin Towers

- **Objective:** Call a drawing function in two different locations.
- **3-Star Line Limit:** 9 meaningful lines (2-Star: 11)
- **Reference Solution Stats:** 9 meaningful lines, 19 executed Turtle ops (3 ⭐)

```python
import turtle
def my_function():
    for i in range(4):
        turtle.forward(80)
        turtle.left(90)
my_function()
turtle.penup()
turtle.forward(160)
turtle.pendown()
my_function()
```

### Level 35: The Village

- **Objective:** Use a reusable function to draw several houses.
- **3-Star Line Limit:** 13 meaningful lines (2-Star: 15)
- **Reference Solution Stats:** 9 meaningful lines, 33 executed Turtle ops (3 ⭐)

```python
import turtle
def my_function():
    for i in range(4):
        turtle.forward(60)
        turtle.left(90)
for j in range(3):
    my_function()
    turtle.penup()
    turtle.forward(120)
    turtle.pendown()
```

### Level 36: Reusable Route

- **Objective:** Create a function to navigate a recurring obstacle.
- **3-Star Line Limit:** 11 meaningful lines (2-Star: 13)
- **Reference Solution Stats:** 11 meaningful lines, 24 executed Turtle ops (3 ⭐)

```python
import turtle
def my_function():
    turtle.forward(40)
    turtle.left(90)
    turtle.forward(80)
    turtle.right(90)
    turtle.forward(80)
    turtle.right(90)
    turtle.forward(80)
    turtle.left(90)
for i in range(3):
    my_function()
```

### Level 37: Treasure Hunter

- **Objective:** Use functions to collect gems from several similar locations.
- **3-Star Line Limit:** 13 meaningful lines (2-Star: 15)
- **Reference Solution Stats:** 9 meaningful lines, 16 executed Turtle ops (3 ⭐)

```python
import turtle
def my_function():
    turtle.forward(80)
    turtle.left(90)
    turtle.forward(120)
    turtle.backward(120)
    turtle.right(90)
for i in range(3):
    my_function()
turtle.forward(80)
```

### Level 38: Robot Architect

- **Objective:** Combine functions and loops to construct a complex drawing.
- **3-Star Line Limit:** 7 meaningful lines (2-Star: 8)
- **Reference Solution Stats:** 7 meaningful lines, 42 executed Turtle ops (3 ⭐)

```python
import turtle
def my_function():
    for i in range(3):
        turtle.forward(80)
        turtle.left(120)
for j in range(6):
    my_function()
    turtle.left(60)
```

### Level 39: Algorithm Challenge

- **Objective:** Complete a complicated maze using as few lines of code as possible.
- **3-Star Line Limit:** 11 meaningful lines (2-Star: 13)
- **Reference Solution Stats:** 10 meaningful lines, 17 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.forward(40)
for i in range(2):
    turtle.left(90)
    turtle.forward(160)
    turtle.right(90)
    turtle.forward(80)
    turtle.right(90)
    turtle.forward(160)
    turtle.left(90)
    turtle.forward(80)
```

### Level 40: Turtle Grandmaster

- **Objective:** Complete a final challenge combining sequencing, loops, nested loops, functions and drawing.
- **3-Star Line Limit:** 12 meaningful lines (2-Star: 14)
- **Reference Solution Stats:** 12 meaningful lines, 102 executed Turtle ops (3 ⭐)

```python
import turtle
turtle.pencolor("gold")
for i in range(8):
    for j in range(4):
        turtle.forward(60)
        turtle.left(90)
    turtle.left(45)
turtle.pencolor("purple")
for i in range(4):
    for j in range(3):
        turtle.forward(100)
        turtle.left(120)
    turtle.left(90)
```

