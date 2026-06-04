# https://jamesabela.github.io/jsfun/oop_adts_course/07_queue_application.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 7 of 12 - OOP ADTs
# Complete the while loop condition.

class Queue:
    def __init__(self):
        self.__items = []

    def enqueue(self, item):
        self.__items.append(item)

    def dequeue(self):
        return self.__items.pop(0)

    def is_empty(self):
        return len(self.__items) == 0

jobs = Queue()
jobs.enqueue("worksheet.pdf")
jobs.enqueue("poster.png")
jobs.enqueue("report.docx")

while not jobs.___():
    print("Printing", jobs.dequeue())

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/08_node_class.py

#Input
# ""

#output
# Printing worksheet.pdf, Printing poster.png, Printing report.docx
