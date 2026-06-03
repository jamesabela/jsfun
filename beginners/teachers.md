# Beginners Course: Teacher Guide & Answers

This guide contains the correct code solutions and pedagogical notes for teachers running the Beginners Course.

---

## 1. speechless.py (Speechless)
* **Goal:** Print the quote from Aladdin: "All I know is I won't go speechless"
* **Solution Code:**
```python
print("I won't be silenced")
print("You can't keep me quiet")
print("Won't tremble when you try it")
print("All I know is I won't go speechless")
```
* **Teacher Note:** Teaches basic string output using the `print()` statement. Show students how text strings are wrapped in double quotes. Note the correct capital letter in `print()` for the final line.

---

## 2. computerscience.py (Computer Science)
* **Goal:** Print the string: "I, love, Computer Science"
* **Solution Code:**
```python
print("I, love, Computer Science")
```
* **Teacher Note:** Demonstrates that punctuation (like commas) can be printed within a single string argument.

---

## 3. jokes.py (Jokes)
* **Goal:** Output a joke and punchline on separate lines.
* **Solution Code:**
```python
print("Why did the chicken cross the road?")
print("To get to the other side!")
```
* **Teacher Note:** Teaches writing multiple sequential print statements. In Python, each call to `print()` automatically appends a newline at the end.

---

## 4. variables.py (Variables)
* **Goal:** Print the spy catchphrase "Bond James Bond" using variables.
* **Solution Code:**
```python
firstName = "James"
lastName = "Bond"

print(lastName, firstName, lastName)
```
* **Teacher Note:** Introduces variables. Show how variables store text values and how they can be referenced inside the `print()` function, separated by commas which add spaces.

---

## 5. maths.py (Maths)
* **Goal:** Print the calculation that results in 15.
* **Solution Code:**
```python
num1 = 20
num2 = 5

total1 = num1 + 15
total2 = num2 * 2
total3 = num1 - num2

print(total3)
```
* **Teacher Note:** Teaches math operators (`+`, `*`, `-`) and using variables to store results of computations. Here, `total3` calculates `20 - 5 = 15`.

---

## 6. friends.py (Friends)
* **Goal:** Print all 4 names ("Ross Monica Phoebe Joey") even after name3 is reassigned.
* **Solution Code:**
```python
name1 = "Ross" 
name2 = "Monica" 
name3 = "Joey" 
name4 = name3 # Save Joey before overwriting
name3 = "Phoebe" 

print(name1, name2, name3, name4)
```
* **Teacher Note:** Introduces variable reassignment. Explain to students that variables can only store one value at a time; when `name3` is set to `"Phoebe"`, `"Joey"` is overwritten. We must copy `"Joey"` to `name4` before reassigning.

---

## 7. assignment.py (Variable Assignment)
* **Goal:** Assign name and favorite food to separate variables and output them.
* **Solution Code:**
```python
my_name = "Ross"
my_fave_food = "Sandwich"

print(my_name)
print(my_fave_food)
```
* **Teacher Note:** A creative assignment testing variable naming, string assignment, and variable output.

---

## 8. hello.py (Hello)
* **Goal:** Get user's name as input and greet them.
* **Solution Code:**
```python
name = input("Hi! What's your name? ")
print("Hi", name)
```
* **Teacher Note:** Introduces user input. Show how `input()` pauses execution, accepts typing, and stores the string value in the variable `name`.

---

## 9. taylor.py (Taylor Swift Born)
* **Goal:** Perform age calculations comparing birth year with Taylor Swift's birth year.
* **Solution Code:**
```python
TaylorSwiftBorn = 1989
MyAge = int(input('When were you born? '))
AgeDifference = MyAge - TaylorSwiftBorn
print("Taylor Swift is", AgeDifference, "years older than you")
```
* **Teacher Note:** Teaches type casting. Explain that user input is always read as a string. We must use `int()` to convert the string to an integer before doing math operations.

---

## 10. celebchat.py (Celeb Chat)
* **Goal:** Create a simple chatbot conversation.
* **Solution Code:**
```python
print("Hi! I'm Taylor Swift!")
name = input("What's your name? ")
print("Nice to meet you,", name)
food = input("What's your favourite food? ")
print("I love", food, "too!")
```
* **Teacher Note:** A final project combining string printing, input collection, variable assignment, and variable outputs.
