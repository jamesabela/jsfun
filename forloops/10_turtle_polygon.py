# Tutorial: https://jamesabela.github.io/jsfun/forloops/10_turtle_polygon.html

# Level 10 - Turtle Polygon
# Ask for the number of sides.
# Draw a regular polygon using a for loop.

import turtle

turtle.speed(0)

sides = int(input("Sides: "))

for i in range(sides):
    turtle.forward(70)
    turtle.right(360 / sides)

print("Polygon complete")

#Input
# 3
# 4
# 6

#output
# Polygon complete
# Polygon complete
# Polygon complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/11_turtle_spiral.py
