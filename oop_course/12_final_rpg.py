# Tutorial: https://jamesabela.github.io/jsfun/oop_course/12_final_rpg.html
# Breadcrumb: Level 12 of 12 - OOP

# Level 12 of 12 - OOP
# Creative project: RPG party builder.
# There are no direct tests for this level.

class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Character:
    def __init__(self, name, weapon):
        self.name = name
        self.__health = 100
        self.weapon = weapon

    def get_health(self):
        return self.__health

    def set_health(self, health):
        self.__health = health

    def print_me(self):
        print(self.name, "is ready for adventure")
        print("Weapon:", self.weapon.name)
        print("Health:", self.get_health())

class Knight(Character):
    def __init__(self, name, weapon):
        Character.__init__(self, name, weapon)
        self.armour = 30

    def print_me(self):
        print(self.name, "the knight raises a shield")
        print("Weapon:", self.weapon.name)
        print("Armour:", self.armour)

class Wizard(Character):
    def __init__(self, name, weapon):
        Character.__init__(self, name, weapon)
        self.magic = 50

    def print_me(self):
        print(self.name, "the wizard prepares a spell")
        print("Weapon:", self.weapon.name)
        print("Magic:", self.magic)

sword = Weapon("sword", 25)
staff = Weapon("staff", 15)

party = [Knight("Arthur", sword), Wizard("Merlin", staff)]

for hero in party:
    hero.print_me()
    print()

print("RPG party builder started")

# Challenge ideas:
# 1. Add an Archer class.
# 2. Add a Potion class and give one to a character.
# 3. Add an attack method that uses weapon damage.
# 4. Add a simple battle between two objects.
# 5. Add a list of monsters and let the player choose an opponent.

#End Python Object Oriented Programming
