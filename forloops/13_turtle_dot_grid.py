# Tutorial: https://jamesabela.github.io/jsfun/forloops/13_turtle_dot_grid.html

# Level 13 - Turtle Dot Grid
# Use nested loops to draw a 5 by 5 dot grid.

import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-100, 100)

for row in range(5):
    for column in range(5):
        turtle.dot(10)
        turtle.forward(40)

    turtle.goto(-100, 100 - ((row + 1) * 40))

print("Grid complete")

#Input
# ""

#output
# Grid complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/14_final_turtle_art.py
