# Tutorial: https://jamesabela.github.io/jsfun/oop_course/08_polymorphism.html
# Breadcrumb: Level 8 of 12 - OOP

# Level 8 of 12 - OOP
# Same method name, different output.

class Character:
    def __init__(self, name):
        self.name = name

    def print_me(self):
        print(self.name, "is an adventurer")

class Knight(Character):
    def ___(self):
        print(self.name, "wears armour")

class Wizard(Character):
    def ___(self):
        print(self.name, "casts spells")

party = [Knight("Arthur"), Wizard("Merlin")]
for hero in party:
    hero.print_me()

#Input
# ""

#output
# Arthur wears armour, Merlin casts spells

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/09_abstraction.py
