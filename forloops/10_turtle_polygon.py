# Tutorial: https://jamesabela.github.io/jsfun/forloops/10_turtle_polygon.html

# Level 10 - Turtle Polygon
# Puzzle: fix the turn angle so it works for any regular polygon.

import turtle

turtle.speed(0)

sides = int(input("Sides: "))

for i in range(sides):
    turtle.forward(70)
    turtle.right(90)

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
