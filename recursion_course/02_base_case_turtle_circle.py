# Level 2 of 12 - Python Recursion Course
# Tutorial: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/02_base_case_turtle_circle.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/vocabulary.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/exam_examples.html

# This level uses turtle to visualise recursion.
# Complete the base case so the circles stop getting smaller.

import turtle

turtle.speed(0)
turtle.bgcolor("white")

def draw_circle(x, y, radius):
    turtle.penup()
    turtle.goto(x, y - radius)
    turtle.pendown()
    turtle.circle(radius)

    # TODO: only call the function again if radius is greater than 20
    # The new radius should be radius - 20


draw_circle(0, 0, 120)
print("Circle recursion complete")

turtle.done()

#Input
# ""

#output
# Circle recursion complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/03_factorial_math.py
