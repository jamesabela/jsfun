# Tutorial: https://jamesabela.github.io/jsfun/oop_course/11_objects_in_lists.html
# Vocabulary: https://jamesabela.github.io/jsfun/oop_course/vocabulary.html
# Exam examples: https://jamesabela.github.io/jsfun/oop_course/exam_examples.html
# Breadcrumb: Level 11 of 12 - OOP

# Level 11 of 12 - OOP
# Complete the list of objects.

class Monster:
    def __init__(self, name, attack):
        self.name = name
        self.attack = attack

    def print_me(self):
        print(self.name, "attack", self.attack)

monster_data = [["Goblin", 12], ["Dragon", 99], ["Slime", 4]]
monster_collection = []

for data in monster_data:
    monster_collection.append(___(data[0], data[1]))

for monster in monster_collection:
    monster.___()

#Input
# ""

#output
# Goblin attack 12, Dragon attack 99, Slime attack 4

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_course/12_final_rpg.py
