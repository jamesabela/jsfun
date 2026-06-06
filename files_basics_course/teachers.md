# Teacher Guide - Files Basics Course

## Purpose

This is a short iGCSE-friendly course on simple text files. It is designed for students who only need to understand how to write one line and read one line, such as storing a name, a high score or a latest typing result.

Avoid extending this course into CSV, multi-line records or exception handling. Those are better saved for a later course.

## Level 1 - Write a player name

Goal: Students use `open()`, write mode, `write()` and `close()` to store a name.

Correct solution:

```python
name = input("Enter your name: ")

file = open("player_name.txt", "w")
file.write(name)
file.close()

print("Saved name:", name)
```

## Level 2 - Read a player name

Goal: Students read one line from a text file.

Correct solution:

```python
setup = open("player_name.txt", "w")
setup.write("Aisha")
setup.close()

file = open("player_name.txt", "r")
name = file.readline()
file.close()

print("Welcome back,", name)
```

## Level 3 - Write a high score

Goal: Students save a score as one line of text.

Correct solution:

```python
score = input("Enter your score: ")

file = open("highscore.txt", "w")
file.write(score)
file.close()

print("High score saved:", score)
```

## Level 4 - Read and compare a high score

Goal: Students read a line, convert it to an integer and compare it with another score.

Correct solution:

```python
setup = open("highscore.txt", "w")
setup.write("75")
setup.close()

file = open("highscore.txt", "r")
saved_score = int(file.readline())
file.close()

today_score = int(input("Enter today's score: "))

if today_score > saved_score:
    print("New high score!")
else:
    print("High score still:", saved_score)
```

## Level 5 - Typing tutor saves latest WPM

Goal: Students write a calculated number to a file by converting it to a string first.

Correct solution:

```python
import time

sentence = "python files keep data safe"
words = sentence.split()

print("Type this line:")
print(sentence)

start = time.time()
typed = input("Type the line: ")
end = time.time()

seconds = end - start
minutes = seconds / 60

if typed == sentence:
    wpm = round(len(words) / minutes)
else:
    wpm = 0

file = open("latest_wpm.txt", "w")
file.write(str(wpm))
file.close()

print("Latest WPM:", wpm)
```

## Level 6 - Typing tutor reads latest WPM

Goal: Students read the saved WPM from a text file.

Correct solution:

```python
setup = open("latest_wpm.txt", "w")
setup.write("35")
setup.close()

file = open("latest_wpm.txt", "r")
latest_wpm = file.readline()
file.close()

print("Last typing speed:", latest_wpm, "wpm")
```

## Final Project: Typing Champion

This final project is deliberately not input/output assessed. It is designed to imitate the style of a longer scenario question where students must combine several skills in one program.

### What it assesses

- Using a list of strings
- Choosing or selecting one item from a list
- Using `time.time()` to measure elapsed time
- Reading one line from a text file
- Writing one line to a text file
- Converting between strings, integers and floats where needed
- Using selection to decide whether to update the high score
- Adding comments and suitable output messages

### Suggested teacher checklist

| Skill | Evidence |
|---|---|
| Uses a list of phrases | Program stores several possible typing lines in a list |
| Reads saved data | Program reads from `player_name.txt` or `highscore.txt` |
| Writes saved data | Program writes the latest WPM to `latest_wpm.txt` |
| Calculates WPM | Program uses words and time taken to calculate a speed |
| Compares scores | Program checks whether the latest score beats the old high score |
| Uses clear messages | User understands what to do and what their result was |
| Includes comments | Important parts of the program are explained |

### Suggested solution

```python
import random
import time

phrases = [
    "python files save data",
    "practice makes typing faster",
    "a high score should stay saved",
    "read one line from a file",
    "write one line to a file"
]

name_file = open("player_name.txt", "r")
player_name = name_file.readline()
name_file.close()

phrase = random.choice(phrases)

print("Typing Champion")
print("Player:", player_name)
print("Type this line:")
print(phrase)

input("Press Enter when you are ready...")

start_time = time.time()
typed_line = input("Type here: ")
end_time = time.time()

time_taken = end_time - start_time
minutes = time_taken / 60
words = len(phrase.split())
wpm = round(words / minutes)

print("Time taken:", round(time_taken, 2), "seconds")
print("Words per minute:", wpm)

if typed_line == phrase:
    print("Perfect typing!")
else:
    print("There were some differences from the original line.")

latest_file = open("latest_wpm.txt", "w")
latest_file.write(str(wpm))
latest_file.close()

score_file = open("highscore.txt", "r")
old_highscore = int(score_file.readline())
score_file.close()

if wpm > old_highscore:
    print("New high score!")
    score_file = open("highscore.txt", "w")
    score_file.write(str(wpm))
    score_file.close()
else:
    print("High score remains:", old_highscore)
```
