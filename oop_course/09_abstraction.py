# Tutorial: https://jamesabela.github.io/jsfun/oop_course/09_abstraction.html
# Vocabulary: https://jamesabela.github.io/jsfun/oop_course/vocabulary.html
# Exam examples: https://jamesabela.github.io/jsfun/oop_course/exam_examples.html
# Breadcrumb: Level 9 of 12 - OOP

# Level 9 of 12 - OOP
# Tutorial level: design your abstraction.
# Add or change attributes that matter for an RPG character.

class Character:
    def __init__(self):
        self.name = "Scout"
        self.health = 100
        self.attack = 10
        # Add one more useful RPG attribute here.

    def print_me(self):
        print("Name:", self.name)
        print("Health:", self.health)
        print("Attack:", self.attack)
        print("Abstraction complete")

hero = Character()
hero.print_me()

#Input
# ""

#output
# Abstraction complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/10_aggregation.py
