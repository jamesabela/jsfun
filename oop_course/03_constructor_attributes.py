# Tutorial: https://jamesabela.github.io/jsfun/oop_course/03_constructor_attributes.html
# Vocabulary: https://jamesabela.github.io/jsfun/oop_course/vocabulary.html
# Exam examples: https://jamesabela.github.io/jsfun/oop_course/exam_examples.html
# Breadcrumb: Level 3 of 12 - OOP

# Level 3 of 12 - OOP
# Complete the constructor.

class Character:
    def __init__(self):
        self.name = "Arthur"
        self.___ = 100

hero = Character()
print(hero.name)
print(hero.health)

#Input
# ""

#output
# Arthur, 100

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/04_methods.py
