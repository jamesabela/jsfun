# Teachers Guide - Files Course

This guide gives the learning goal and a possible solution for each level. Students do not need to match these solutions exactly.

## Level 1 of 10 - Load a Text File

**Goal:** Use #load and open a text file.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

with open("rudyard.txt", "r") as poem_file:
    first_line = poem_file.readline()

print(first_line)
```

## Level 2 of 10 - Filename Variables

**Goal:** Store the file name in a variable.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

filename = "rudyard.txt"

with open(filename, "r") as poem_file:
    title = poem_file.readline()
    first_poem_line = poem_file.readline()

print("Title:", title, end="")
print("First line:", first_poem_line, end="")
```

## Level 3 of 10 - Count Lines and Words

**Goal:** Count lines and count a word in a text file.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

line_count = 0
if_count = 0

with open("rudyard.txt", "r") as poem_file:
    for line in poem_file:
        line_count = line_count + 1
        if_count = if_count + line.count("If")

print("Lines:", line_count)
print("If count:", if_count)
```

## Level 4 of 10 - Write a New File

**Goal:** Create a results file with write mode.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/rudyard.txt

line_count = 0

with open("rudyard.txt", "r") as poem_file:
    for line in poem_file:
        line_count = line_count + 1

with open("stats.txt", "w") as stats_file:
    stats_file.write("Lines: " + str(line_count) + "\n")

with open("stats.txt", "r") as stats_file:
    saved_text = stats_file.read()

print(saved_text)
```

## Level 5 of 10 - Append to a File

**Goal:** Add new lines without deleting old data.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
name = input("Who read the poem? ")

with open("reading_log.txt", "a") as log_file:
    log_file.write("Reader: " + name + "\n")

with open("reading_log.txt", "r") as log_file:
    log_text = log_file.read()

print("Reading log")
print(log_text)
```

## Level 6 of 10 - Read TSV Data

**Goal:** Split tab-separated values into columns.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

count = 0

with open("historical_events.tsv", "r") as event_file:
    header = event_file.readline()
    for line in event_file:
        parts = line.strip().split("\t")
        event_name = parts[0]
        print(event_name)
        count = count + 1
        if count == 5:
            break
```

## Level 7 of 10 - Search File Data

**Goal:** Find records in a TSV file.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

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
        if year == search_year:
            print(month, year, "-", event)
            found = True

if found == False:
    print("No events found")
```

## Level 8 of 10 - Save Filtered Data

**Goal:** Write selected records to a new file.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

search_month = input("Enter a month: ")

with open("month_timeline.txt", "w") as out_file:
    with open("historical_events.tsv", "r") as event_file:
        header = event_file.readline()
        for line in event_file:
            parts = line.strip().split("\t")
            event = parts[0]
            month = parts[1]
            year = parts[2]
            if month == search_month:
                out_file.write(year + " - " + event + "\n")

with open("month_timeline.txt", "r") as timeline_file:
    print(timeline_file.read())
```

## Level 9 of 10 - Append Structured Data

**Goal:** Add a new row to a TSV file.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_course/historical_events.tsv

event = input("Event: ")
month = input("Month: ")
year = input("Year: ")
description = input("Description: ")

with open("my_events.tsv", "w") as out_file:
    out_file.write("Event\tMonth\tYear\tDescription\n")

with open("my_events.tsv", "a") as out_file:
    out_file.write(event + "\t" + month + "\t" + year + "\t" + description + "\n")

with open("my_events.tsv", "r") as in_file:
    print(in_file.read())
```

## Level 10 of 10 - Creative Project

**Goal:** Build a Monster Codex from an external file.

**Teacher note:** This level develops file-handling fluency while keeping the task small enough for Python Code Lab.

```python
#load https://raw.githubusercontent.com/jamesabela/Python-RPG-Tutorial/2efb37c62e8a34f9267d8f408b29d59298b4b2ca/Monsters.txt

import random

with open("Monsters.txt", "r") as monster_file:
    monsters = monster_file.readlines()

print("Monster Codex")
print("1. Random encounter")
print("2. Search")
choice = input("Choose: ")

if choice == "1":
    monster = random.choice(monsters).strip()
    print("You encountered:", monster)
    with open("battle_log.txt", "a") as log:
        log.write("Encountered: " + monster + "\n")
elif choice == "2":
    search = input("Monster name or keyword: ").lower()
    for monster in monsters:
        if search in monster.lower():
            print(monster, end="")
else:
    print("Explore the monster file and add your own features.")
```

