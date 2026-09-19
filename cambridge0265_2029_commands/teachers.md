# Cambridge 0265 Python Commands - 2029 - Teacher Guide

This guide gives the teaching purpose and a drop-in solution for every level.

The course is deliberately limited to the Cambridge 0265 Python subset used for this 2029 command course. It is not intended to teach every Python feature.

## Level 1: Variables, Input and Output

**Teaching goal:** Start with the commands that appear in almost every Python program: variables, keyboard input, output, data types and type conversion.

**Student task:** Ask for a student name and age. Convert the age to an integer. Start points at 10, then add 5 using +=. Print the name, the age next year and the points.

### Solution

```python
name = input("Name: ")
age = int(input("Age: "))

points = 10
points += 5

print("Hello " + name)
print("Next age:", age + 1)
print("Points:", points)
```

## Level 2: Arithmetic Operators

**Teaching goal:** Cambridge expects students to use the common arithmetic operators, including integer division, remainder and powers.

**Student task:** Input a number of seconds. Print the whole number of minutes using // and the seconds left using %. Then print the square of the original value using **.

### Solution

```python
seconds = int(input("Seconds: "))
minutes = seconds // 60
left = seconds % 60
square = seconds ** 2
print("Minutes:", minutes)
print("Seconds left:", left)
print("Square:", square)
```

## Level 3: Comparisons and Boolean Logic

**Teaching goal:** Comparisons produce Boolean results. Logical operators let you combine conditions into rules.

**Student task:** Input an age. Print whether it is between 13 and 17 inclusive, whether it is not 16, and whether it is younger than 13 or older than 17.

### Solution

```python
age = int(input("Age: "))
teen = age >= 13 and age <= 17
not_sixteen = age != 16
outside = age < 13 or age > 17
print("Teen:", teen)
print("Not sixteen:", not_sixteen)
print("Outside:", outside)
```

## Level 4: if, elif and else

**Teaching goal:** Use selection when a program needs to choose between different actions.

**Student task:** Input a temperature. Print Hot for 30 or more, Warm for 20 to 29, and Cool for anything lower.

### Solution

```python
temperature = int(input("Temperature: "))
if temperature >= 30:
    print("Hot")
elif temperature >= 20:
    print("Warm")
else:
    print("Cool")
```

## Level 5: match and case

**Teaching goal:** Pattern selection is useful when one value is compared with several exact choices.

**Student task:** Input a traffic light colour. Print STOP for red, WAIT for amber or yellow, GO for green, and UNKNOWN for anything else.

### Solution

```python
colour = input("Colour: ").lower()
match colour:
    case "red":
        print("STOP")
    case "amber" | "yellow":
        print("WAIT")
    case "green":
        print("GO")
    case _:
        print("UNKNOWN")
```

## Level 6: while Loops and break

**Teaching goal:** A while loop repeats while a condition is true. A while True loop can be stopped deliberately with break.

**Student task:** Keep asking for a positive number. Stop when the user enters 0. Add all positive numbers to a total and print the total when the loop ends.

### Solution

```python
total = 0
while True:
    number = int(input("Number: "))
    if number == 0:
        break
    total += number
print("Total:", total)
```

## Level 7: for Loops and range()

**Teaching goal:** Students should recognise all three common forms of range(), as well as looping directly through a list.

**Student task:** Use range(start, stop, step) to print 10, 8, 6, 4, 2. Then use a second for loop to print each name in the supplied list.

### Solution

```python
names = ["Aisha", "Ben", "Chen"]
for number in range(10, 0, -2):
    print(number)
for name in names:
    print(name)
```

## Level 8: String Methods, Indexing and Slicing

**Teaching goal:** String questions use real Python operations. Students need both methods and index or slice notation.

**Student task:** Input a phrase. Print its length, first character, last character, first three characters, uppercase version, title case version, and the number of times the letter a appears.

### Solution

```python
phrase = input("Phrase: ")
print("Length:", len(phrase))
print("First:", phrase[0])
print("Last:", phrase[-1])
print("First three:", phrase[0:3])
print(phrase.upper())
print(phrase.title())
print("Count a:", phrase.lower().count("a"))
```

## Level 9: List Analysis

**Teaching goal:** Lists store several values under one variable name. Students should analyse them using built-in functions and membership tests.

**Student task:** Use the supplied list to print the first score, total, highest, lowest, length, how many 18s there are, and whether 15 is present.

### Solution

```python
scores = [12, 18, 18, 15]
print("First:", scores[0])
print("Total:", sum(scores))
print("Highest:", max(scores))
print("Lowest:", min(scores))
print("Length:", len(scores))
print("Number of 18s:", scores.count(18))
print("Has 15:", 15 in scores)
```

## Level 10: Editing and Sorting Lists

**Teaching goal:** Students need to add, insert, remove and sort items in a list.

**Student task:** Start with [5, 2, 9]. Append 4, insert 7 at index 1, remove the item at index 2 with pop(), then sort descending. Print the removed value and final list.

### Solution

```python
numbers = [5, 2, 9]
numbers.append(4)
numbers.insert(1, 7)
removed = numbers.pop(2)
numbers.sort(reverse=True)
print("Removed:", removed)
print("Final:", numbers)
```

## Level 11: 2D Lists and Nested Loops

**Teaching goal:** A 2D list is a list containing lists. Students should understand row and column indexing and how nested loops visit every value.

**Student task:** Use nested loops to total every number in the 2D list. Also print the value at row 1, column 2.

### Solution

```python
grid = [[2, 4, 6], [1, 3, 5]]
total = 0
for row in grid:
    for value in row:
        total += value
print("Cell:", grid[1][2])
print("Total:", total)
```

## Level 12: Functions, Parameters and return

**Teaching goal:** Functions package reusable logic. Parameters receive values and return sends a result back to the caller.

**Student task:** Complete the function rectangle_area(width, height) so that it returns the area. Input width and height, call the function and print the result.

### Solution

```python
def rectangle_area(width, height):
    return width * height
width = int(input("Width: "))
height = int(input("Height: "))
area = rectangle_area(width, height)
print("Area:", area)
```

## Level 13: Global Variables

**Teaching goal:** The global keyword allows a function to change a variable created outside the function. It should be used deliberately rather than everywhere.

**Student task:** Complete add_bonus() so that each call adds 3 to the global score. Call it twice and print the final score.

### Solution

```python
score = 4
def add_bonus():
    global score
    score += 3
add_bonus()
add_bonus()
print("Score:", score)
```

## Level 14: Random, Statistics and Rounding

**Teaching goal:** The syllabus names random and statistics. Students should know the specified functions and how to round results.

**Student task:** Calculate and print the mean of the supplied scores rounded to 1 decimal place. Then generate a random die roll from 1 to 6 and a random even number from 2 to 10 using randrange().

### Solution

```python
import random
import statistics
scores = [11, 14, 16, 20]
mean_score = round(statistics.mean(scores), 1)
die = random.randint(1, 6)
even = random.randrange(2, 12, 2)
print("Mean:", mean_score)
print("Die:", die)
print("Even:", even)
```

## Level 15: Reading Text Files

**Teaching goal:** File reading lets a program use stored data. This level shows both explicit open and close and the safer with open pattern.

**Student task:** Read scores.txt. First use open(), read() and close() to check whether Ben appears. Then reopen the file with with open(), read one line with readline() and the remaining lines with readlines().

### Solution

```python
file = open("scores.txt", "r")
whole_text = file.read()
file.close()

with open("scores.txt", "r") as file:
    first = file.readline()
    remaining = file.readlines()

print("Contains Ben:", "Ben" in whole_text)
print("First:", first.strip())
print("Remaining:", len(remaining))
```

## Level 16: Writing and Appending Files

**Teaching goal:** Write mode creates or replaces file contents. Append mode adds new content to the end of a file.

**Student task:** Input a name and score. Write name,score to result.txt using write mode. Then append PASS on a new line. Reopen the file and print its contents.

### Solution

```python
name = input("Name: ")
score = int(input("Score: "))

with open("result.txt", "w") as file:
    file.write(name + "," + str(score) + "\n")

with open("result.txt", "a") as file:
    file.write("PASS\n")

with open("result.txt", "r") as file:
    result = file.read()

print(result)
```

## Level 17: Final Structured Challenge

**Teaching goal:** The final level combines several commands in one structured programming task. The aim is to select the right Python tools rather than memorise isolated syntax.

**Student task:** Input three scores. Store them in a list. Write a function classify(score) returning High for 80+, Medium for 50-79 and Low below 50. Print the rounded mean, highest, lowest and classification of the highest score.

### Solution

```python
import statistics

def classify(score):
    if score >= 80:
        return "High"
    elif score >= 50:
        return "Medium"
    else:
        return "Low"

scores = []
for i in range(3):
    scores.append(int(input("Score: ")))

mean_score = round(statistics.mean(scores))
highest = max(scores)
lowest = min(scores)

print("Mean:", mean_score)
print("Highest:", highest)
print("Lowest:", lowest)
print("Band:", classify(highest))
```
