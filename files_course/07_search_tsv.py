# Level 7 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/07_search_tsv.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

# Task: ask for a year, then print every event from that year.
# Each line has: Event, Month, Year, Description

search_year = input("Enter a year: ")
found = False

with open("historical_events.tsv", "r") as event_file:
    header = event_file.readline()
    for line in event_file:
        parts = line.strip().split("\t")
        event = parts[0]
        month = parts[1]
        year = parts[2]
        description = parts[3]
        if False:
            print(month, year, "-", event)
            found = True

if found == False:
    print("No events found")

#Input
# 1929
# 1940

#output
# October 1929, Wall Street Crash
# May 1940, Dunkirk, September 1940, London Blitz

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/08_save_timeline.py
