# Tutorial: https://jamesabela.github.io/jsfun/whileloops/11_turtle_growing_steps.html

# Level 11 - Turtle Growing Steps
# Puzzle: fix the starting length.

import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-180, -150)
turtle.pendown()

length = 60
steps = 0

while length <= 100:
    turtle.forward(length)
    turtle.left(90)
    turtle.forward(20)
    turtle.right(90)
    length = length + 20
    steps = steps + 1

print("Steps:", steps)

#Input
# ""

#output
# Steps: 5

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/12_turtle_boundary_walk.py
