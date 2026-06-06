# Files Basics Course - Level 6
# Tutorial: https://jamesabela.github.io/jsfun/files_basics_course/06_typing_tutor_read.html

# This line creates a simple file for the test.
setup = open("latest_wpm.txt", "w")
setup.write("35")
setup.close()

# Task:
# Read one line from latest_wpm.txt.
# Print Last typing speed: followed by the WPM and wpm.

# TODO: read latest_wpm.txt and store the line in latest_wpm
latest_wpm = "0"

print("Last typing speed:", latest_wpm, "wpm")

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_basics_course/07_final_project_typing_champion.py

#Input
# ""

#output
# Last typing speed: 35 wpm
