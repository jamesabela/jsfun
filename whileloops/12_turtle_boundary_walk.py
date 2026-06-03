# Tutorial: https://jamesabela.github.io/jsfun/whileloops/12_turtle_boundary_walk.html

# Level 12 - Turtle Boundary Walk
# Move the turtle until it reaches the right side.

import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-160, 0)
turtle.pendown()

while turtle.xcor() < 160:
    turtle.forward(20)
    turtle.dot(8)

print("Boundary reached")

#Input
# ""

#output
# Boundary reached

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/13_turtle_shrinking_spiral.py
