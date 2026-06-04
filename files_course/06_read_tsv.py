# Level 6 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/06_read_tsv.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

# Task: read historical_events.tsv and print the first 5 event names.
# TSV means tab-separated values. Use split("\t").

count = 0

with open("historical_events.tsv", "r") as event_file:
    header = event_file.readline()
    for line in event_file:
        parts = line.strip().split(",")
        event_name = parts[0]
        print(event_name)
        count = count + 1
        if count == 5:
            break

#Input
# ""

#output
# Queen Victoria's Funeral, Wright Brothers, Emily Davison, Battle Of The Somme, Abdication Of Tsar Nicholas

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/07_search_tsv.py
