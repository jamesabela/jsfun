# https://jamesabela.github.io/jsfun/oop_adts_course/02_stack_class.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 2 of 12 - OOP ADTs
# Complete the Stack constructor.

class Stack:
    def __init__(self, capacity):
        self.__items = []
        self.__capacity = capacity
        self.__top = ___

    def size(self):
        return len(self.__items)

books = Stack(3)
print("Stack size:", books.size())

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/03_stack_push.py

#Input
# ""

#output
# Stack size: 0
