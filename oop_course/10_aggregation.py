# Tutorial: https://jamesabela.github.io/jsfun/oop_course/10_aggregation.html
# Breadcrumb: Level 10 of 12 - OOP

# Level 10 of 12 - OOP
# Complete the aggregation example.

class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Character:
    def __init__(self, name, weapon):
        self.name = name
        self.weapon = ___

    def attack(self):
        print(self.name, "attacks with", self.weapon.name)
        print("Damage:", self.weapon.damage)

sword = Weapon("sword", 25)
hero = Character("Arthur", sword)
hero.attack()

#Input
# ""

#output
# Arthur attacks with sword, Damage: 25

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/11_objects_in_lists.py
