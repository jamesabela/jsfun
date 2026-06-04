# Level 7 of 12 - Python Recursion Course
# Tutorial: https://jamesabela.github.io/jsfun/recursion_course/07_recursive_cinema.html

# Recursive cinema drawing using turtle.
# Complete the recursive call so the next row is drawn.

import turtle

turtle.speed(0)
turtle.bgcolor("midnight blue")
turtle.color("gold")

def draw_seat(x, y):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    turtle.begin_fill()
    for i in range(4):
        turtle.forward(12)
        turtle.right(90)
    turtle.end_fill()

def draw_row(row_number, max_rows, seats, y):
    if row_number > max_rows:
        return

    start_x = -seats * 8
    for seat in range(seats):
        draw_seat(start_x + seat * 18, y)

    # TODO: recursively draw the next row
    # Increase row_number by 1, increase seats by 1, and move y down by 25


draw_row(1, 5, 4, 120)
print("Cinema recursion complete")

turtle.done()

#Input
# ""

#output
# Cinema recursion complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/08_recursive_binary_search.py
