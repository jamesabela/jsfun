# Files Basics Course - Level 5
# Tutorial: https://jamesabela.github.io/jsfun/files_basics_course/05_typing_tutor_write.html

# Simple Typing Tutor
# The user types the whole line.
# The program stores the latest WPM in latest_wpm.txt.

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

# TODO: open latest_wpm.txt in write mode and write str(wpm)

print("Latest WPM:", wpm)

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_basics_course/06_typing_tutor_read.py

#Input
# python files keep data safe
# wrong line

#output
# Latest WPM:
# Latest WPM: 0
