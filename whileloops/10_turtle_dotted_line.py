# Tutorial: https://jamesabela.github.io/jsfun/whileloops/10_turtle_dotted_line.html

# Level 10 - Turtle Dotted Line
# Puzzle: fix the starting x value.

import turtle

turtle.speed(0)
turtle.penup()

x = 0

while x <= 180:
    turtle.goto(x, 0)
    turtle.dot(10)
    x = x + 30

print("Final x:", x)

#Input
# ""

#output
# Final x: 210

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/11_turtle_growing_steps.py
