# Teacher Guide - Python Lists Course

This guide gives the purpose and solution code for each level.

## Level 1 - Backpack Builder

Teaches basic list creation using square brackets and comma-separated string values.

Goal: students create a list with three strings and print the whole list.

```python
backpack = ["water", "map", "torch"]
print(backpack)
```

## Level 2 - Treasure Total

Teaches common list statistics using `sum`, `min`, `max`, `len`, and division for the mean.

Goal: students calculate the total, smallest value, largest value, list length, and mean average.

```python
treasure = [4, 8, 15, 16, 23, 42]

print("Total:", sum(treasure))
print("Minimum:", min(treasure))
print("Maximum:", max(treasure))
print("Length:", len(treasure))
print("Mean:", sum(treasure) / len(treasure))
```

## Level 3 - City Tour Tickets

Teaches indexing and slicing. It also introduces unpacking a list slice with `*` and using `sep` in `print`.

Goal: students print the first four cities as a neat comma-separated list.

```python
cities = ["Kuala Lumpur", "London", "Paris", "New York", "Bangkok", "Tokyo"]
print(*cities[0:4], sep=", ")
```

## Level 4 - Character Roster

Teaches `append` and `sort` with user input.

Goal: students add the inputted character, sort the list, and print it.

```python
characters = ["Mario", "Sonic", "Zelda"]

new_character = input("Add a character: ")

characters.append(new_character)
characters.sort()

print(characters)
```

## Level 5 - Inventory Cleaner

Teaches removing an item from a list using user input, sorting, and printing a list cleanly.

Goal: students remove the selected item and display the remaining items.

```python
inventory = ["sword", "apple", "shield", "potion"]

remove_item = input("Which item should be removed? ")

inventory.remove(remove_item)
inventory.sort()

print(*inventory, sep=", ")
```

## Level 6 - KL Bus Ticket

Teaches related lists, where the same index is used to connect different pieces of data.

Goal: students update the capacity and money for both an outgoing and a return bus.

```python
bus_time = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
bus_capacity = [40, 40, 40, 40, 40, 40, 40, 64]
bus_money = [0, 0, 0, 0, 0, 0, 0, 0]
charge = 15

out_choice = int(input("Choose outgoing bus 0, 2, 4 or 6: "))
return_choice = int(input("Choose return bus 1, 3, 5 or 7: "))

print("Outgoing:", bus_time[out_choice])
print("Return:", bus_time[return_choice])

bus_capacity[out_choice] = bus_capacity[out_choice] - 1
bus_capacity[return_choice] = bus_capacity[return_choice] - 1

bus_money[out_choice] += charge
bus_money[return_choice] += charge

print("Capacity:", bus_capacity)
print("Money:", bus_money)
```

## Level 7 - The Roasting Machine

Teaches `random.choice` with a list and string output involving user input.

Goal: students randomly select one roast and include the user's name.

```python
import random

roasts = [
    "your code has more bugs than a jungle",
    "your indentation is doing parkour",
    "your variables need a holiday"
]

name = input("Who should be roasted? ")

roast = random.choice(roasts)

print(name, roast)
```

## Level 8 - Lazy Report Writer

Teaches combining a list, `random.choice`, and a loop.

Goal: students print one random comment for each student.

```python
import random

comments = [
    "is making good progress.",
    "should check work carefully.",
    "has shown a positive attitude.",
    "needs to practise the key vocabulary."
]

number_of_students = int(input("How many students? "))

for i in range(number_of_students):
    comment = random.choice(comments)
    print("Student", i + 1, comment)
```
