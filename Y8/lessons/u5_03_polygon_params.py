# Tutorial: https://jamesabela.github.io/jsfun/Y8/lessons/u5_03_polygon_params.html

import turtle

def draw_shape(sides, length):
    angle = 360 / sides
    for i in range(sides):
        turtle.forward(length)
        turtle.right(angle)

draw_shape(5, 80)
turtle.penup()
turtle.forward(150)
turtle.pendown()
draw_shape(6, 50)

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/Y8/lessons/u5_04_village_stars.py
