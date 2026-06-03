# Tutorial: https://jamesabela.github.io/jsfun/forloops/11_turtle_spiral.html

# Level 11 - Turtle Spiral
# Use the loop variable to create a growing spiral.

import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("cyan")

for i in range(40):
    turtle.forward(i * 4)
    turtle.right(90)

print("Spiral complete")

#Input
# ""

#output
# Spiral complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/12_nested_grid.py
