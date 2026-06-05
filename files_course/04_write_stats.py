# Level 4 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/04_write_stats.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

# Task: count the lines in rudyard.txt, then write the answer to stats.txt.
# Use write mode: "w"

line_count = 0

with open("rudyard.txt", "r") as poem_file:
    for line in poem_file:
        line_count = line_count + 1

# Open stats.txt in write mode and write this exact text:
# Lines: 36
# Include the newline character at the end.

with open("stats.txt", "r") as stats_file:
    saved_text = stats_file.read()

print(saved_text)

#Input
# ""

#output
# Lines: 36

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/05_append_log.py
