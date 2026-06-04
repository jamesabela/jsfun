# https://jamesabela.github.io/jsfun/oop_adts_course/11_adt_from_adt.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 11 of 12 - OOP ADTs
# Complete the queue made from two stacks.

class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def is_empty(self):
        return len(self.items) == 0

class QueueUsingStacks:
    def __init__(self):
        self.input_stack = Stack()
        self.output_stack = Stack()

    def enqueue(self, item):
        self.input_stack.push(item)

    def dequeue(self):
        if self.output_stack.is_empty():
            while not self.input_stack.is_empty():
                self.output_stack.push(self.input_stack.pop())
        return self.output_stack.___()

q = QueueUsingStacks()
q.enqueue("A")
q.enqueue("B")
print(q.dequeue())
print(q.dequeue())

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/12_final_project.py

#Input
# ""

#output
# A, B
