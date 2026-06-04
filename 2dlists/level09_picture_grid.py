# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level09_picture_grid.html
# Breadcrumb: Level 9 of 10 - Picture Grid
# A 2D list can store a tiny picture.
# Each letter represents one symbol.
# Complete the code to convert the picture into emojis.

picture = [
    ["B", "Y", "Y", "B"],
    ["Y", "W", "W", "Y"],
    ["Y", "B", "B", "Y"],
    ["B", "Y", "Y", "B"]
]

for row in picture:
    line = ""
    for pixel in row:
        # TODO: Add the missing choices.
        if pixel == "B":
            line = line + "⬛"
        else:
            line = line + "?"
    print(line)

#Input
# ""

#output
# ⬛🟨🟨⬛, 🟨⬜⬜🟨, 🟨⬛⬛🟨

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level10_final_project.py