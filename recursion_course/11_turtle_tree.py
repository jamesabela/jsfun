# Level 11 of 12 - Python Recursion Course
# Tutorial: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/11_turtle_tree.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/vocabulary.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/exam_examples.html

# Recursive turtle tree.
# Complete the base case and recursive calls.

import turtle

turtle.speed(0)
turtle.left(90)
turtle.penup()
turtle.goto(0, -180)
turtle.pendown()

def branch(length):
    # TODO: base case - return if length is less than 10

    turtle.forward(length)
    turtle.right(30)

    # TODO: recursive call with length - 15

    turtle.left(60)

    # TODO: recursive call with length - 15

    turtle.right(30)
    turtle.backward(length)

branch(80)
print("Tree recursion complete")

turtle.done()

#Input
# ""

#output
# Tree recursion complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/12_final_project.py
