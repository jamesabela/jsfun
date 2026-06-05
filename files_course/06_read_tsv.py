# Level 6 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/06_read_tsv.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

# Task: read historical_events.tsv and print the first 5 events in the format: Event (Year)
# TSV means tab-separated values. Use split("\t").

count = 0

with open("historical_events.tsv", "r") as event_file:
    header = event_file.readline()
    for line in event_file:
        parts = line.strip().split(",")
        event_name = parts[0]
        year = parts[2]
        print(event_name + " (" + year + ")")
        count = count + 1
        if count == 5:
            break

#Input
# ""

#output
# Queen Victoria's Funeral (1901), Wright Brothers, 1903, Emily Davison, 1913, Battle Of The Somme (1916), Abdication Of Tsar Nicholas (1917)

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/07_search_tsv.py
