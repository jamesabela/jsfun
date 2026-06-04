# Teacher Guide - Python OOP Course
## Notes
- This course uses an RPG metaphor because classes, objects, inheritance and aggregation are easier to understand with characters, weapons and parties.
- Some pages are tutorial-style and some are test-based.
- The final project has no direct automated test.
- OOP ADTs and binary trees are deliberately excluded.

## Level 1: Why objects help in bigger programs
Goal: Object Oriented Programming concept through Python code.

```python
print("A blueprint is called a class")
print("A specific character is an object")
print("A function inside a class is a method")
```

## Level 2: Create a Character class
Goal: Class And Object concept through Python code.

```python
class Character:
    pass

hero = Character()
print("Character object created")
```

## Level 3: Constructor, self and attributes
Goal: Constructor And Attributes concept through Python code.

```python
class Character:
    def __init__(self):
        self.name = "Arthur"
        self.health = 100

hero = Character()
print(hero.name)
print(hero.health)
```

## Level 4: Methods make objects do things
Goal: Methods concept through Python code.

```python
class Character:
    def __init__(self):
        self.name = "Merlin"
        self.magic = 50

    def print_basics(self):
        print("Name:", self.name)
        print("Magic:", self.magic)

hero = Character()
hero.print_basics()
```

## Level 5: Many instances from one class
Goal: Instance And Object concept through Python code.

```python
class Character:
    def __init__(self, name):
        self.name = name

arthur = Character("Arthur")
merlin = Character("Merlin")

print(arthur.name)
print(merlin.name)
```

## Level 6: Private attributes, getters and setters
Goal: Getters And Setters concept through Python code.

```python
class Character:
    def __init__(self):
        self.__health = 50

    def get_health(self):
        return self.__health

    def set_health(self, new_health):
        self.__health = new_health

hero = Character()
hero.set_health(80)
print("Health:", hero.get_health())
```

## Level 7: Inheritance creates specialised characters
Goal: Inheritance concept through Python code.

```python
class Character:
    def __init__(self):
        self.name = "Unknown"
        self.health = 100

    def print_basics(self):
        print("Name:", self.name)
        print("Health:", self.health)

class Wizard(Character):
    def __init__(self):
        Character.__init__(self)
        self.magic = 30

merlin = Wizard()
merlin.name = "Merlin"
merlin.print_basics()
print("Magic:", merlin.magic)
```

## Level 8: Polymorphism: same method, different behaviour
Goal: Polymorphism concept through Python code.

```python
class Character:
    def __init__(self, name):
        self.name = name

    def print_me(self):
        print(self.name, "is an adventurer")

class Knight(Character):
    def print_me(self):
        print(self.name, "wears armour")

class Wizard(Character):
    def print_me(self):
        print(self.name, "casts spells")

party = [Knight("Arthur"), Wizard("Merlin")]
for hero in party:
    hero.print_me()
```

## Level 9: Abstraction: choose the important details
Goal: Abstraction concept through Python code.

```python
class Character:
    def __init__(self):
        self.name = "Scout"
        self.health = 100
        self.attack = 10
        self.defence = 5

    def print_me(self):
        print("Name:", self.name)
        print("Health:", self.health)
        print("Attack:", self.attack)
        print("Defence:", self.defence)
        print("Abstraction complete")

hero = Character()
hero.print_me()
```

## Level 10: Aggregation and containment
Goal: Aggregation concept through Python code.

```python
class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Character:
    def __init__(self, name, weapon):
        self.name = name
        self.weapon = weapon

    def attack(self):
        print(self.name, "attacks with", self.weapon.name)
        print("Damage:", self.weapon.damage)

sword = Weapon("sword", 25)
hero = Character("Arthur", sword)
hero.attack()
```

## Level 11: Create many objects using a list
Goal: Lists Of Objects concept through Python code.

```python
class Monster:
    def __init__(self, name, attack):
        self.name = name
        self.attack = attack

    def print_me(self):
        print(self.name, "attack", self.attack)

monster_data = [["Goblin", 12], ["Dragon", 99], ["Slime", 4]]
monster_collection = []

for data in monster_data:
    monster_collection.append(Monster(data[0], data[1]))

for monster in monster_collection:
    monster.print_me()
```

## Level 12: Final project: RPG party builder
Goal: Creative Project concept through Python code.

```python
# This project is open-ended. See starter code and challenge ideas.
```
