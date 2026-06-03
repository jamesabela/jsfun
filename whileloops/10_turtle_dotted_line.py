# Tutorial: https://jamesabela.github.io/jsfun/whileloops/10_turtle_dotted_line.html

# Level 10 - Turtle Dotted Line
# Draw dots while x is less than or equal to 180.

import turtle

turtle.speed(0)
turtle.penup()

x = -180

while x <= 180:
    turtle.goto(x, 0)
    turtle.dot(10)
    x = x + 30

print("Line complete")

#Input
# ""

#output
# Line complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/11_turtle_growing_steps.py
