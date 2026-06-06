# Files Basics Course - Level 4
# Tutorial: https://jamesabela.github.io/jsfun/files_basics_course/04_read_highscore.html

# This line creates a simple file for the test.
setup = open("highscore.txt", "w")
setup.write("75")
setup.close()

# Task:
# Read the saved high score from highscore.txt.
# Ask the player for today's score.
# If today's score is bigger, print New high score!
# Otherwise, print High score still: followed by the saved score.

# TODO: read the saved score from highscore.txt
saved_score = 0

today_score = int(input("Enter today's score: "))

if today_score > saved_score:
    print("New high score!")
else:
    print("High score still:", saved_score)

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_basics_course/05_typing_tutor_write.py

#Input
# 90
# 60

#output
# New high score!
# High score still: 75
