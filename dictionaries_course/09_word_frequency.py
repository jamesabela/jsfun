#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/dictionaries_course/romeo_juliet_sample.txt
# https://jamesabela.github.io/jsfun/dictionaries_course/09_word_frequency.html
# Level 9 of 10 - Dictionaries

import string

word_counts = {}

with open("romeo_juliet_sample.txt", "r") as file:
    text = file.read().lower()

for mark in string.punctuation:
    text = text.replace(mark, " ")

words = text.split()

for word in words:
    if word not in word_counts:
        word_counts[word] = ___
    else:
        word_counts[word] = word_counts[word] + ___

print("Different words:", len(word_counts))
print("romeo:", word_counts.get("romeo", 0))
print("juliet:", word_counts.get("juliet", 0))

#Input
# ""

#output
# Different words, romeo, juliet

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/dictionaries_course/10_final_project.py
