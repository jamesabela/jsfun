# https://jamesabela.github.io/jsfun/oop_adts_course/06_circular_queue.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 6 of 12 - OOP ADTs
# Complete the circular queue pointer update.

class CircularQueue:
    def __init__(self, capacity):
        self.__items = [None] * capacity
        self.__capacity = capacity
        self.__front = 0
        self.__rear = -1
        self.__count = 0

    def enqueue(self, item):
        if self.__count == self.__capacity:
            print("Queue full")
            return
        self.__rear = (self.__rear + 1) % ___
        self.__items[self.__rear] = item
        self.__count += 1

    def show(self):
        print(self.__items)

q = CircularQueue(3)
q.enqueue("A")
q.enqueue("B")
q.enqueue("C")
q.show()

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/07_queue_application.py

#Input
# ""

#output
# A, B, C
