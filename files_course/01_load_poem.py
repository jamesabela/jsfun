# Level 1 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/01_load_poem.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

# Task: open rudyard.txt and print the first line.
# Tip: use with open("rudyard.txt", "r") as file:

with open("CHANGE_ME.txt", "r") as poem_file:
    first_line = poem_file.readline()

print(first_line)

#Input
# ""

#output
# 'if' by rudyard kipling

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/02_filename_variable.py
