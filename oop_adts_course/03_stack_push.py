# https://jamesabela.github.io/jsfun/oop_adts_course/03_stack_push.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 3 of 12 - OOP ADTs
# Complete the overflow check.

class Stack:
    def __init__(self, capacity):
        self.__items = []
        self.__capacity = capacity

    def push(self, item):
        if len(self.__items) == ___:
            print("Stack overflow")
        else:
            self.__items.append(item)
            print("Pushed", item)

bag = Stack(2)
bag.push("potion")
bag.push("map")
bag.push("sword")

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/04_stack_pop_peek.py

#Input
# ""

#output
# Pushed potion, Pushed map, Stack overflow
