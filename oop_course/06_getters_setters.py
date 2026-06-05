# Tutorial: https://jamesabela.github.io/jsfun/oop_course/06_getters_setters.html
# Breadcrumb: Level 6 of 12 - OOP

# Level 6 of 12 - OOP
# Complete the getter and setter.

class Character:
    def __init__(self):
        self.__health = 50

    def get_health(self):
        return ___

    def set_health(self, new_health):
        self.__health = ___

hero = Character()
hero.set_health(80)
print("Health:", hero.get_health())

#Input
# ""

#output
# Health: 80

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/07_inheritance.py
