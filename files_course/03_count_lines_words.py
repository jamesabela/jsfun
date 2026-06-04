# Level 3 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/03_count_lines_words.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

# Task: count the number of lines and count how many times the word If appears.
# Keep the printed labels the same so the checker can find them.

line_count = 0
if_count = 0

with open("rudyard.txt", "r") as poem_file:
    for line in poem_file:
        # Add 1 to line_count for every line in the file.
        pass
        # Count how many times If appears in this line.
        # Remember: line.count("If") returns a number.

print("Lines:", line_count)
print("If count:", if_count)

#Input
# ""

#output
# Lines: 33, If count: 14

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/04_write_stats.py
