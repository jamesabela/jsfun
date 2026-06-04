# Tutorial: https://jamesabela.github.io/jsfun/oop_course/07_inheritance.html
# Vocabulary: https://jamesabela.github.io/jsfun/oop_course/vocabulary.html
# Exam examples: https://jamesabela.github.io/jsfun/oop_course/exam_examples.html
# Breadcrumb: Level 7 of 12 - OOP

# Level 7 of 12 - OOP
# Complete the inheritance.

class Character:
    def __init__(self):
        self.name = "Unknown"
        self.health = 100

    def print_basics(self):
        print("Name:", self.name)
        print("Health:", self.health)

class Wizard(___):
    def __init__(self):
        Character.__init__(self)
        self.magic = 30

merlin = Wizard()
merlin.name = "Merlin"
merlin.print_basics()
print("Magic:", merlin.magic)

#Input
# ""

#output
# Name: Merlin, Health: 100, Magic: 30

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/08_polymorphism.py
