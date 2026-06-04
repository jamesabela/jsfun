# https://jamesabela.github.io/jsfun/oop_adts_course/04_stack_pop_peek.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 4 of 12 - OOP ADTs
# Complete the pop method.

class Stack:
    def __init__(self):
        self.__items = []

    def push(self, item):
        self.__items.append(item)

    def pop(self):
        if len(self.__items) == 0:
            print("Stack underflow")
            return None
        return self.__items.___()

spells = Stack()
spells.push("fire")
spells.push("ice")
print(spells.pop())
print(spells.pop())
print(spells.pop())

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/05_queue_class.py

#Input
# ""

#output
# ice, fire, Stack underflow
