# Turtle Course - Teacher Guide
## Course purpose
This beginner course develops Turtle graphics skills while reinforcing sequencing, loops, variables, coordinates and procedures. The automated tests check the completion message. Teachers should also inspect the drawing because output tests cannot judge visual accuracy.
## Python Code Lab notes
- The Turtle canvas uses approximately -200 to 200 on each axis.
- The activities avoid `tracer()` and long-running animation.
- Students can use Display Mode to step through drawing instructions.
- Students can save the final canvas as a PNG.

## Level 1: First Turtle Steps
**Learning goal:** A Turtle carries a pen. It draws a line as it moves. Distances are measured in pixels and turns are measured in degrees.

**Suggested solution:**

```python
import turtle

turtle.shape("turtle")
turtle.pensize(5)

turtle.forward(120)
turtle.right(90)
turtle.forward(80)

print("First steps complete")
```

## Level 2: Draw a Square
**Learning goal:** A square has four equal sides and four right-angle turns. A for loop can repeat the same drawing instructions.

**Suggested solution:**

```python
import turtle

turtle.shape("turtle")
turtle.pensize(4)

for side in range(4):
    turtle.forward(100)
    turtle.right(90)

print("Square complete")
```

## Level 3: Polygon Maker
**Learning goal:** The outside turn for a regular polygon is 360 divided by the number of sides.

**Suggested solution:**

```python
import turtle

sides = 6
length = 70
turn = 360 / sides

for side in range(sides):
    turtle.forward(length)
    turtle.right(turn)

print("Polygon complete")
```

## Level 4: Colour and Fill
**Learning goal:** pencolor() changes the outline. fillcolor() chooses the inside colour. Drawing between begin_fill() and end_fill() fills the completed shape.

**Suggested solution:**

```python
import turtle

turtle.pensize(5)
turtle.pencolor("navy")
turtle.fillcolor("gold")
turtle.begin_fill()

for side in range(5):
    turtle.forward(100)
    turtle.right(72)

turtle.end_fill()

print("Colour badge complete")
```

## Level 5: Lift the Pen
**Learning goal:** penup() lets the turtle move without drawing. pendown() puts the pen back on the canvas. goto(x, y) moves to an exact coordinate.

**Suggested solution:**

```python
import turtle

def square():
    for side in range(4):
        turtle.forward(80)
        turtle.right(90)

turtle.penup()
turtle.goto(-150, 60)
turtle.pendown()
square()

turtle.penup()
turtle.goto(50, 60)
turtle.pendown()
square()

print("Pen control complete")
```

## Level 6: Circle Art
**Learning goal:** circle(radius) draws a circle. Repeating circles with a small turn creates flower and rosette patterns.

**Suggested solution:**

```python
import turtle

turtle.pensize(2)

for petal in range(12):
    turtle.circle(70)
    turtle.right(30)

print("Circle art complete")
```

## Level 7: Drawing Procedures
**Learning goal:** A procedure groups instructions under a name. Parameters allow the same procedure to draw different sizes.

**Suggested solution:**

```python
import turtle

def triangle(size):
    for side in range(3):
        turtle.forward(size)
        turtle.right(120)

triangle(50)
triangle(80)
triangle(110)

print("Procedures complete")
```

## Level 8: Growing Spiral
**Learning goal:** A spiral can be made by increasing the distance moved on each repetition while keeping the turn angle similar.

**Suggested solution:**

```python
import turtle

distance = 5

for line in range(45):
    turtle.forward(distance)
    turtle.right(91)
    distance = distance + 4

print("Spiral complete")
```

## Level 9: Night-time Skyline
**Learning goal:** Complex pictures are built from simple shapes. Coordinates help position each building accurately.

**Suggested solution:**

```python
import turtle

turtle.bgcolor("midnightblue")

def draw_building(x, y, width, height, colour):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    turtle.fillcolor(colour)
    turtle.begin_fill()
    turtle.goto(x + width, y)
    turtle.goto(x + width, y + height)
    turtle.goto(x, y + height)
    turtle.goto(x, y)
    turtle.end_fill()

x_positions = [-190, -145, -90, -30, 35, 95, 150]
heights = [90, 140, 70, 170, 115, 155, 80]
colours = ["slategray", "darkgray", "gray", "dimgray",
           "slategray", "darkgray", "gray"]

for i in range(len(x_positions)):
    draw_building(x_positions[i], -190, 35, heights[i], colours[i])

print("Skyline complete")
```

## Level 10: Final Turtle Postcard
**Learning goal:** You now know movement, turning, loops, colour, fill, coordinates, circles and procedures. Combine them to create an original postcard.

**Suggested solution:**

```python
import turtle

turtle.bgcolor("skyblue")

def square(size, colour):
    turtle.fillcolor(colour)
    turtle.begin_fill()
    for side in range(4):
        turtle.forward(size)
        turtle.right(90)
    turtle.end_fill()

def move_to(x, y):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()

# Sun
move_to(120, 100)
turtle.fillcolor("gold")
turtle.begin_fill()
turtle.circle(35)
turtle.end_fill()

# House
move_to(-80, -120)
square(120, "tomato")

# Roof
move_to(-80, 0)
turtle.fillcolor("brown")
turtle.begin_fill()
for side in range(3):
    turtle.forward(120)
    turtle.left(120)
turtle.end_fill()

# Tree
move_to(90, -120)
turtle.pensize(15)
turtle.pencolor("saddlebrown")
turtle.left(90)
turtle.forward(80)
turtle.pensize(2)
turtle.pencolor("black")
turtle.fillcolor("green")
turtle.begin_fill()
turtle.circle(45)
turtle.end_fill()

print("Turtle postcard complete")
```
