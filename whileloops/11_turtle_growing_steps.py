# Tutorial: https://jamesabela.github.io/jsfun/whileloops/11_turtle_growing_steps.html

# Level 11 - Turtle Growing Steps
# Draw steps that get longer each time.

import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-180, -150)
turtle.pendown()

length = 20

while length <= 100:
    turtle.forward(length)
    turtle.left(90)
    turtle.forward(20)
    turtle.right(90)
    length = length + 20

print("Steps complete")

#Input
# ""

#output
# Steps complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/12_turtle_boundary_walk.py
