# Tutorial: https://jamesabela.github.io/jsfun/sorts_searches_course/09_bubble_turtle.html
# Vocabulary: https://jamesabela.github.io/jsfun/sorts_searches_course/vocabulary.html
# Big O Lab: https://jamesabela.github.io/jsfun/sorts_searches_course/big_o_lab.html
# Exam Support: https://jamesabela.github.io/jsfun/sorts_searches_course/exam_support.html
# Breadcrumb: Level 9 of 12 - Sorts and Searches

import turtle

values = [7, 3, 9, 2, 6]

def draw_bars():
    turtle.clear()
    x = -170
    turtle.penup()
    for value in values:
        turtle.goto(x, -160)
        turtle.pendown()
        for i in range(2):
            turtle.forward(40)
            turtle.left(90)
            turtle.forward(value * 20)
            turtle.left(90)
        turtle.penup()
        turtle.goto(x + 20, -180)
        turtle.write(value, align="center", font=("Arial", 12, "bold"))
        x = x + 60

turtle.speed(0)
draw_bars()

for pass_num in range(len(values)):
    for i in range(len(values) - 1):
        if values[i] > values[i + 1]:
            temp = values[i]
            values[i] = values[i + 1]
            values[i + 1] = temp
            draw_bars()

turtle.hideturtle()
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/sorts_searches_course/10_insertion_sort.py
