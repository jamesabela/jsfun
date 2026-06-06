# Files Basics Course - Level 2
# Tutorial: https://jamesabela.github.io/jsfun/files_basics_course/02_read_name.html

# This line creates a simple file for the test.
setup = open("player_name.txt", "w")
setup.write("Aisha")
setup.close()

# Task:
# Open player_name.txt in read mode.
# Read one line from the file.
# Print Welcome back, followed by the name.

# TODO: replace the next line by reading from the file
name = "unknown"

print("Welcome back,", name)

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_basics_course/03_write_highscore.py

#Input
# ""

#output
# Welcome back, Aisha
