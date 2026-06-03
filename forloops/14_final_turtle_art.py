# Tutorial: https://jamesabela.github.io/jsfun/forloops/14_final_turtle_art.html

# Level 14 - Final Turtle Art
# Use a for loop to create a colourful pattern.

import turtle

turtle.speed(0)
turtle.bgcolor("black")

colours = ["red", "yellow", "lime", "cyan", "magenta", "white"]

for i in range(60):
    turtle.color(colours[i % len(colours)])
    turtle.forward(i * 3)
    turtle.right(121)

print("Art complete")

#Input
# ""

#output
# Art complete

#End Python For Loops
