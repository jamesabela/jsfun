# Tutorial: https://jamesabela.github.io/jsfun/course_functions/03_turtle_square.html
# Breadcrumb: Level 3 of 10 - Turtle Square Procedure
# Key terms: procedure, parameter, abstraction, decomposition

import turtle

turtle.speed(0)
turtle.bgcolor("white")

def square_draw(x, y, size):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()

    # TODO: use a for loop to draw 4 sides
    # Each side should move forward by size and turn right 90 degrees.

# These calls should draw three different squares.
square_draw(-150, 100, 40)
square_draw(-40, 40, 70)
square_draw(80, -80, 50)

print("square procedure complete")

turtle.done()

#Input
# ""

#output
# square procedure complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/course_functions/04_function_return.py
