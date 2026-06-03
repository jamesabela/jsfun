# Tutorial: https://jamesabela.github.io/jsfun/forloops/13_turtle_dot_grid.html

# Level 13 - Turtle Dot Grid
# Puzzle: fix the columns so each row has five dots.

import turtle

turtle.speed(0)
turtle.penup()
turtle.goto(-100, 100)

for row in range(5):
    for column in range(3):
        turtle.dot(10)
        turtle.forward(40)

    turtle.goto(-100, 100 - ((row + 1) * 40))

print("Grid complete")

#Input
# ""

#output
# Grid complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/14_final_turtle_art.py
