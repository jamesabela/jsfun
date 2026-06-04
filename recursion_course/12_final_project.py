# Level 12 of 12 - Python Recursion Course
# Tutorial: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/12_final_project.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/vocabulary.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/exam_examples.html

# Final project: Fractal cinema.
# Create a recursive turtle project.
# Teacher assessment should check that your program has:
# - a recursive function
# - a base case
# - a general case
# - comments explaining the recursive call

import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("white")

# Starter idea: a recursive screen effect.
def screen_effect(x, y, size):
    if size < 10:
        return

    turtle.penup()
    turtle.goto(x, y - size)
    turtle.pendown()
    turtle.circle(size)

    # TODO: add at least one recursive call here

screen_effect(0, 60, 100)

print("Project complete")
turtle.done()

#Input
# ""

#output
# Project complete

#End Python Recursion Course
