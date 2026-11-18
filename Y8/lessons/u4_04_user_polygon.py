# Tutorial: https://jamesabela.github.io/jsfun/Y8/lessons/u4_04_user_polygon.html

import turtle

sides = int(input("How many sides would you like? "))
# Ask for pen colour and calculate angle = 360 / sides!

for i in range(sides):
    turtle.pencolor("red")
    turtle.forward(60)
    turtle.right(30)

#End Year 8 Python: For Loops & Turtle
