# Files Basics Course - Final Project
# Tutorial: https://jamesabela.github.io/jsfun/files_basics_course/07_final_project_typing_champion.html

# Final project: Typing Champion
# This project is not input/output assessed.
# Your teacher will check your code and test it by running it.

import random
import time

# You may use this list to make the project easier.
phrases = [
    "python files save data",
    "practice makes typing faster",
    "a high score should stay saved",
    "read one line from a file",
    "write one line to a file"
]

print("Typing Champion")
print("Try to type the line exactly.")

# TODO 1: Read the player's name from player_name.txt.
# If you want an easier version, you may ask for the name using input instead.
player_name = "Player"

# TODO 2: Choose a random phrase from the list.
phrase = phrases[0]

print("Player:", player_name)
print("Type this line:")
print(phrase)

input("Press Enter when you are ready...")

# TODO 3: Start the timer.
start_time = 0

# TODO 4: Ask the user to type the whole line.
typed_line = input("Type here: ")

# TODO 5: Stop the timer.
end_time = 0

# TODO 6: Calculate the time taken and the WPM.
# A simple GCSE-friendly formula is:
# words per minute = number of words / time in minutes
words = len(phrase.split())
time_taken = 1
wpm = 0

print("Words:", words)
print("WPM:", wpm)

# TODO 7: Check if the typed line is exactly the same as the phrase.
# Output a suitable message.

# TODO 8: Write the latest WPM to latest_wpm.txt.

# TODO 9: Read the old best score from highscore.txt.
# If the latest WPM is higher, write the new high score to highscore.txt.

print("Project complete - now test your program carefully.")

#End Python Files Basics
