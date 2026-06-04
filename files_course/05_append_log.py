# Level 5 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/05_append_log.html
# Task: create a reading log using append mode.
# Ask for a name and append it to reading_log.txt.
# Then read the file back and print it.

name = input("Who read the poem? ")

# Open reading_log.txt in append mode and save this format:
# Reader: name

with open("reading_log.txt", "r") as log_file:
    log_text = log_file.read()

print("Reading log")
print(log_text)

#Input
# Aisha
# Ben

#output
# Reading log, Reader: Aisha
# Reading log, Reader: Ben

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/06_read_tsv.py
