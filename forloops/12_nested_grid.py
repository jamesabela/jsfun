# Tutorial: https://jamesabela.github.io/jsfun/forloops/12_nested_grid.html

# Level 12 - Nested Grid
# Puzzle: fix the inner loop so each row has four symbols.

for row in range(4):
    line = ""

    for column in range(2):
        line = line + "#"

    print(line)

#Input
# ""

#output
# ####
# ####
# ####
# ####

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/forloops/13_turtle_dot_grid.py
