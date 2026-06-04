# Level 2 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/02_filename_variable.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

# Task: store the filename in a variable, then use the variable in open().
# The output should show the title and first poem line.

filename = "CHANGE_ME.txt"

with open(filename, "r") as poem_file:
    title = poem_file.readline()
    first_poem_line = poem_file.readline()

print("Title:", title, end="")
print("First line:", first_poem_line, end="")

#Input
# ""

#output
# Title:, rudyard kipling, First line:, keep your head

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/03_count_lines_words.py
