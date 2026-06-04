# Tutorial: https://jamesabela.github.io/jsfun/sorts_searches_course/03_linear_turtle.html
# Breadcrumb: Level 3 of 12 - Sorts and Searches

import turtle

values = [4, 8, 2, 9, 6]
target = 9
x = -160
y = 0

turtle.penup()
turtle.speed(0)

for value in values:
    turtle.goto(x, y)
    turtle.pendown()
    turtle.write(value, align="center", font=("Arial", 16, "bold"))
    for i in range(4):
        turtle.forward(50)
        turtle.right(90)
    turtle.penup()

    turtle.goto(x + 25, y - 70)
    if value == target:
        turtle.write("FOUND", align="center", font=("Arial", 10, "bold"))
        break
    else:
        turtle.write("check", align="center", font=("Arial", 10, "normal"))

    x = x + 70

turtle.hideturtle()
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/sorts_searches_course/04_binary_search_concept.py
