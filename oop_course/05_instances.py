# Tutorial: https://jamesabela.github.io/jsfun/oop_course/05_instances.html
# Vocabulary: https://jamesabela.github.io/jsfun/oop_course/vocabulary.html
# Exam examples: https://jamesabela.github.io/jsfun/oop_course/exam_examples.html
# Breadcrumb: Level 5 of 12 - OOP

# Level 5 of 12 - OOP
# Create two instances from the same class.

class Character:
    def __init__(self, name):
        self.name = name

arthur = Character("Arthur")
merlin = ___("Merlin")

print(arthur.name)
print(___.name)

#Input
# ""

#output
# Arthur, Merlin

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/06_getters_setters.py
