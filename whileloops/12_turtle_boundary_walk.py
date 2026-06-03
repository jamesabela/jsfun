# Tutorial: https://jamesabela.github.io/jsfun/whileloops/12_turtle_boundary_walk.html

# Level 12 - Turtle Boundary Walk
# Puzzle: fix the condition so the turtle reaches the right side.

import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-160, 0)
turtle.pendown()

while turtle.xcor() < 60:
    turtle.forward(20)
    turtle.dot(8)

print("Final position:", int(turtle.xcor()))

#Input
# ""

#output
# Final position: 160

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/13_turtle_shrinking_spiral.py
