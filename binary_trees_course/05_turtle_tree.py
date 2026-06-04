# Level 5 of 12 - Binary Trees
# Help: https://jamesabela.github.io/jsfun/binary_trees_course/05_turtle_tree.html
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/binary_trees_course/06_oop_node.py

import turtle

turtle.speed(0)
turtle.penup()
turtle.hideturtle()

def draw_node(x, y, text):
    turtle.goto(x, y - 15)
    turtle.pendown()
    turtle.circle(15)
    turtle.penup()
    turtle.goto(x - 6, y - 5)
    turtle.write(text)

def draw_line(x1, y1, x2, y2):
    turtle.goto(x1, y1 - 15)
    turtle.pendown()
    turtle.goto(x2, y2 + 15)
    turtle.penup()

# This is a tutorial level. Add more nodes to make the visual tree match the data.
draw_node(0, 150, "50")
draw_line(0, 135, -80, 80)
draw_node(-80, 80, "30")
# TODO: draw the right child 70 at x=80, y=80

print("Turtle tree drawn")

turtle.done()

#Input
# ""

#output
# Turtle tree drawn
