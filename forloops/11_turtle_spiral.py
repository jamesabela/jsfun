# Tutorial: https://jamesabela.github.io/jsfun/forloops/11_turtle_spiral.html

# Level 11 - Turtle Spiral
# Puzzle: use the loop variable to make the spiral grow.

import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("cyan")

for i in range(40):
    turtle.forward(20)
    turtle.right(90)

print("Spiral complete")

#Input
# ""

#output
# Spiral complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/12_nested_grid.py
