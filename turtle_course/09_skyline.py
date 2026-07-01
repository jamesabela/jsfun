# Tutorial: https://jamesabela.github.io/jsfun/turtle_course/09_skyline.html
# Turtle Course - Level 9 of 10

import turtle

turtle.bgcolor("midnightblue")

def draw_building(x, y, width, height, colour):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    turtle.fillcolor(colour)
    turtle.begin_fill()

    # Draw the four corners of the building using goto().





    turtle.end_fill()

x_positions = [-190, -145, -90, -30, 35, 95, 150]
heights = [90, 140, 70, 170, 115, 155, 80]
colours = ["slategray", "darkgray", "gray", "dimgray",
           "slategray", "darkgray", "gray"]

for i in range(len(x_positions)):
    draw_building(x_positions[i], -190, 35, heights[i], colours[i])

print("Skyline complete")

#Input
# ""

#output
# Skyline complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/turtle_course/10_turtle_postcard.py
