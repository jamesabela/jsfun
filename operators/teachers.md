# Operators Course: Teacher Guide & Answers

This guide contains the correct code solutions and pedagogical notes for teachers running the Operators Course.

---

## 1. start.py (Snack Shop Secret Code)
* **Goal:** Calculate total by adding snack and drink prices.
* **Solution Code:**
```python
snack_price = int(input("Snack price: "))
drink_price = int(input("Drink price: "))

total = snack_price + drink_price
print(total)
```
* **Teacher Note:** Teaches addition (`+`) with dynamic numeric inputs.

---

## 2. 02_robot_battery.py (Robot Battery Rescue)
* **Goal:** Calculate battery remaining after travel.
* **Solution Code:**
```python
start_battery = int(input("Starting battery: "))
battery_used = int(input("Battery used: "))

battery_left = start_battery - battery_used
print(battery_left)
```
* **Teacher Note:** Teaches subtraction (`-`) with integers.

---

## 3. 03_space_fuel.py (Space Fuel Calculator)
* **Goal:** Calculate total fuel needed for space jumps.
* **Solution Code:**
```python
jumps = int(input("Number of jumps: "))
fuel_per_jump = int(input("Fuel per jump: "))

total_fuel = jumps * fuel_per_jump
print(total_fuel)
```
* **Teacher Note:** Teaches multiplication (`*`) with integers.

---

## 4. 04_pizza_party.py (Pizza Slice Share)
* **Goal:** Divide pizza slices equally.
* **Solution Code:**
```python
slices = int(input("Number of slices: "))
players = int(input("Number of players: "))

each_slice = slices / players
print(each_slice)
```
* **Teacher Note:** Teaches float division (`/`). Explain to students that normal division always yields a floating-point (decimal) result, e.g. `10 / 4 = 2.5`.

---

## 5. 05_pirate_treasure.py (Pirate Treasure Split)
* **Goal:** Calculate equal share of whole coins.
* **Solution Code:**
```python
coins = int(input("Number of coins: "))
pirates = int(input("Number of pirates: "))

coins_each = coins // pirates
print(coins_each)
```
* **Teacher Note:** Introduces floor division (`//`). Explain that floor division rounds down to the nearest integer, which is useful when items (like coins) cannot be split into fractions.

---

## 6. 06_leftover_loot.py (Leftover Loot)
* **Goal:** Find remaining coins after equal distribution.
* **Solution Code:**
```python
coins = int(input("Number of coins: "))
pirates = int(input("Number of pirates: "))

leftover = coins % pirates
print(leftover)
```
* **Teacher Note:** Introduces the modulo operator (`%`). Explain that modulo calculates the remainder of division. For instance, `23 % 5 = 3`.

---

## 7. 07_power_up.py (Arcade Power-Up)
* **Goal:** Raise score to the power of the power-up.
* **Solution Code:**
```python
score = int(input("Starting score: "))
power_up = int(input("Power-up level: "))

final_code = score ** power_up
print(final_code)
```
* **Teacher Note:** Introduces the exponentiation operator (`**`). Discuss difference between `score * 2` (multiplication) and `score ** 2` (score squared).
