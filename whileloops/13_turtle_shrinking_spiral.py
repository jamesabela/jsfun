# Tutorial: https://jamesabela.github.io/jsfun/whileloops/13_turtle_shrinking_spiral.html

# Level 13 - Turtle Shrinking Spiral
# Draw a spiral that gets smaller.

import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("cyan")

length = 160

while length > 0:
    turtle.forward(length)
    turtle.right(90)
    length = length - 10

print("Spiral complete")

#Input
# ""

#output
# Spiral complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/14_final_pet_game.py
