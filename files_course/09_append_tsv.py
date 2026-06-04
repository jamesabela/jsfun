# Level 9 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/09_append_tsv.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

# Task: collect a new event and append it to my_events.tsv.
# Then print the file so the new record can be seen.

event = input("Event: ")
month = input("Month: ")
year = input("Year: ")
description = input("Description: ")

# Write the header first using write mode.
with open("my_events.tsv", "w") as out_file:
    out_file.write("Event\tMonth\tYear\tDescription\n")

# Now append the new row using append mode.
# Separate each part with \t and end with \n.

with open("my_events.tsv", "r") as in_file:
    print(in_file.read())

#Input
# Moon Landing, July, 1969, Humans first walked on the Moon

#output
# Event, Month, Year, Description, Moon Landing, July, 1969, Humans first walked on the Moon

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/10_monster_codex.py
