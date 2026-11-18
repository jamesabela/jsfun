# Tutorial: https://jamesabela.github.io/jsfun/Y8/lessons/u5_01_draw_square_def.html

import turtle

def draw_square():
    for i in range(4):
        turtle.forward(80)
        turtle.right(90)

draw_square()
turtle.penup()
turtle.forward(120)
turtle.pendown()
draw_square()

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/Y8/lessons/u5_02_draw_triangle_def.py
