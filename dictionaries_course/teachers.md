# Teacher Guide - Python Dictionaries

## Teacher notes

This course breaks a long dictionary demonstration into manageable steps. It starts with key-value pairs, moves through safe access, looping, updating and deleting, then finishes with nested dictionaries and a word-frequency task.

The glossary is available from every HTML guide using the Vocabulary page link, which opens in a new tab. The final project is intentionally open-ended and does not use direct automated tests.

## Solutions

## Level 1: Make a dictionary

Goal: Complete the dictionary so it stores the capital of Japan. Then print the whole dictionary.

```python
capitals = {"USA":"Washington D.C.", "France":"Paris"}
capitals["Japan"] = "Tokyo"
print(capitals)
```
## Level 2: Keys and values

Goal: Complete the dictionary where each category stores a list of examples. Then print the fruit list.

```python
things = {
    "Fruit": ["Mango", "Banana"],
    "Color": ["Blue", "Red"]
}

print(things["Fruit"])
```
## Level 3: Access values safely

Goal: Ask the user for a country. Use get() so the program prints a useful message if the country is missing.

```python
capitals = {"USA":"Washington D.C.", "France":"Paris", "India":"New Delhi"}

country = input("Country: ")
capital = capitals.get(country, "Unknown country")
print(capital)
```
## Level 4: Loop through a dictionary

Goal: Complete the loop so it prints each country and its capital.

```python
capitals = {"USA":"Washington D.C.", "France":"Paris", "India":"New Delhi"}

for country in capitals:
    print(country, "->", capitals[country])
```
## Level 5: Add and update entries

Goal: Update India to Virat and Australia to Paine. Then print the dictionary.

```python
captains = {"England":"Root", "Australia":"Smith", "India":"Dhoni", "Srilanka":"Jayasurya"}

captains["India"] = "Virat"
captains["Australia"] = "Paine"

print(captains)
```
## Level 6: Delete and pop values

Goal: Remove Srilanka with del. Then use pop() to remove Australia and print the value that was removed.

```python
captains = {"England":"Root", "Australia":"Paine", "India":"Virat", "Srilanka":"Jayasurya"}

del captains["Srilanka"]
removed = captains.pop("Australia")

print(removed)
print(captains)
```
## Level 7: Keys, values, items and in

Goal: Complete the program so it prints the keys, values and whether India is a key.

```python
d1 = {'name': 'Steve', 'age': 21, 'marks': 60, 'course': 'Computer Engg'}
captains = {"England":"Root", "Australia":"Paine", "India":"Virat"}

print(d1.keys())
print(d1.values())
print("India" in captains)
```
## Level 8: Nested dictionaries

Goal: Print Asha's marks from the nested dictionary.

```python
students = {
    101: {'name': 'Steve', 'age': 25, 'marks': 60},
    102: {'name': 'Anil', 'age': 23, 'marks': 75},
    103: {'name': 'Asha', 'age': 20, 'marks': 70}
}

print(students[103]['marks'])
```
## Level 9: Word frequency with Romeo and Juliet

Goal: Complete the missing lines so each word is counted. This level uses #load to load the text file into Python Code Lab.

```python
import string

word_counts = {}

with open("romeo_juliet_sample.txt", "r") as file:
    text = file.read().lower()

for mark in string.punctuation:
    text = text.replace(mark, " ")

words = text.split()

for word in words:
    if word not in word_counts:
        word_counts[word] = 1
    else:
        word_counts[word] = word_counts[word] + 1

print("Different words:", len(word_counts))
print("romeo:", word_counts.get("romeo", 0))
print("juliet:", word_counts.get("juliet", 0))
```
## Level 10: Final project: interactive dictionary app

Goal: Build a useful dictionary project. Start from the example and add at least five entries, a menu, safe lookup with get(), and one feature such as adding, updating, deleting or counting.

```python
# Open-ended project. Many correct solutions are possible.
```

