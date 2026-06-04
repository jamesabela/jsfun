# Tutorial: https://jamesabela.github.io/jsfun/data_structures/03_stack_limits.html
# Vocabulary: https://jamesabela.github.io/jsfun/data_structures/vocabulary.html
# Breadcrumb: Level 3 of 10 - Data Structures

MAX_SIZE = 3
stack = []

def push(item):
    # Add an if statement for overflow.
    stack.append(item)
    print("Pushed", item)

def pop_item():
    # Add an if statement for underflow.
    print("Popped", stack.pop())

push("A")
push("B")
push("C")
push("D")
pop_item()
pop_item()
pop_item()
pop_item()

#Input
# ""

#output
# Pushed A, Pushed B, Pushed C, Overflow, Popped C, Popped B, Popped A, Underflow

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/data_structures/04_queue_basic.py
