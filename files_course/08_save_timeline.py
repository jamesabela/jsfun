# Level 8 of 10 - Files Course
# Tutorial: https://jamesabela.github.io/jsfun/files_course/08_save_timeline.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

# Task: save all events from one chosen month to month_timeline.txt.
# Then read the saved file and print it.

search_month = input("Enter a month: ")

with open("historical_events.tsv", "r") as event_file:
    header = event_file.readline()
    for line in event_file:
        parts = line.strip().split("\t")
        event = parts[0]
        month = parts[1]
        year = parts[2]
        if month == search_month:
            # Write this record to month_timeline.txt in write mode.
            # Format: Year - Event
            pass

with open("month_timeline.txt", "r") as timeline_file:
    print(timeline_file.read())

#Input
# October

#output
# 1929 - Wall Street Crash, 1942 - Battle Of El Alamein Begins

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/09_append_tsv.py
