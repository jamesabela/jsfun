# Tutorial: https://jamesabela.github.io/jsfun/whileloops/13_turtle_shrinking_spiral.html

# Level 13 - Turtle Shrinking Spiral
# Puzzle: fix the update so the spiral shrinks.

import turtle

turtle.speed(0)
turtle.bgcolor("black")
turtle.color("cyan")

length = 160
turns = 0

while length > 0:
    turtle.forward(length)
    turtle.right(90)
    length = length + 10
    turns = turns + 1

print("Final length:", length)

#Input
# ""

#output
# Final length: 0

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/14_final_pet_game.py
