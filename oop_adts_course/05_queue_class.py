# https://jamesabela.github.io/jsfun/oop_adts_course/05_queue_class.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 5 of 12 - OOP ADTs
# Complete enqueue and dequeue.

class Queue:
    def __init__(self):
        self.__items = []

    def enqueue(self, item):
        self.__items.___(item)

    def dequeue(self):
        if len(self.__items) == 0:
            return None
        return self.__items.pop(___)

line = Queue()
line.enqueue("Ali")
line.enqueue("Ben")
print(line.dequeue())
print(line.dequeue())

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/06_circular_queue.py

#Input
# ""

#output
# Ali, Ben
