# Teacher Guide - OOP Abstract Data Types

This guide gives goals and drop-in solutions for each level. Binary trees are intentionally excluded.


## Level 1: ADT as a class interface

Goal: ABSTRACT DATA TYPE. Students should complete the missing code and understand the ADT operation being modelled.

```python
print("An ADT stores data and operations")
print("A class can hide the implementation")
print("Users call the public methods")
```


## Level 2: Create a Stack class

Goal: STACK ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Stack:
    def __init__(self, capacity):
        self.__items = []
        self.__capacity = capacity
        self.__top = -1

    def size(self):
        return len(self.__items)

books = Stack(3)
print("Stack size:", books.size())
```


## Level 3: Push and overflow

Goal: STACK ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Stack:
    def __init__(self, capacity):
        self.__items = []
        self.__capacity = capacity

    def push(self, item):
        if len(self.__items) == self.__capacity:
            print("Stack overflow")
        else:
            self.__items.append(item)
            print("Pushed", item)

bag = Stack(2)
bag.push("potion")
bag.push("map")
bag.push("sword")
```


## Level 4: Pop, peek and underflow

Goal: STACK ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Stack:
    def __init__(self):
        self.__items = []

    def push(self, item):
        self.__items.append(item)

    def pop(self):
        if len(self.__items) == 0:
            print("Stack underflow")
            return None
        return self.__items.pop()

spells = Stack()
spells.push("fire")
spells.push("ice")
print(spells.pop())
print(spells.pop())
print(spells.pop())
```


## Level 5: Create a Queue class

Goal: QUEUE ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Queue:
    def __init__(self):
        self.__items = []

    def enqueue(self, item):
        self.__items.append(item)

    def dequeue(self):
        if len(self.__items) == 0:
            return None
        return self.__items.pop(0)

line = Queue()
line.enqueue("Ali")
line.enqueue("Ben")
print(line.dequeue())
print(line.dequeue())
```


## Level 6: Circular queue with pointers

Goal: QUEUE ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
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
        self.__rear = (self.__rear + 1) % self.__capacity
        self.__items[self.__rear] = item
        self.__count += 1

    def show(self):
        print(self.__items)

q = CircularQueue(3)
q.enqueue("A")
q.enqueue("B")
q.enqueue("C")
q.show()
```


## Level 7: Queue application: print jobs

Goal: QUEUE APPLICATION. Students should complete the missing code and understand the ADT operation being modelled.

```python
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

while not jobs.is_empty():
    print("Printing", jobs.dequeue())
```


## Level 8: Node class for a linked list

Goal: LINKED LIST ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

first = Node("Start")
print(first.data)
print(first.next)
```


## Level 9: Insert and traverse a linked list

Goal: LINKED LIST ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.__head = None

    def insert_front(self, data):
        new_node = Node(data)
        new_node.next = self.__head
        self.__head = new_node

    def traverse(self):
        current = self.__head
        while current is not None:
            print(current.data)
            current = current.next

quests = LinkedList()
quests.insert_front("Dragon")
quests.insert_front("Goblin")
quests.traverse()
```


## Level 10: Search and delete in a linked list

Goal: LINKED LIST ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.__head = None

    def insert_front(self, data):
        new_node = Node(data)
        new_node.next = self.__head
        self.__head = new_node

    def search(self, target):
        current = self.__head
        while current is not None:
            if current.data == target:
                return True
            current = current.next
        return False

items = LinkedList()
items.insert_front("map")
items.insert_front("key")
items.insert_front("coin")
print(items.search("key"))
print(items.search("sword"))
```


## Level 11: A queue made from two stacks

Goal: ADT FROM ADT. Students should complete the missing code and understand the ADT operation being modelled.

```python
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
        return self.output_stack.pop()

q = QueueUsingStacks()
q.enqueue("A")
q.enqueue("B")
print(q.dequeue())
print(q.dequeue())
```


## Level 12: Final project: RPG control desk

Goal: CREATIVE PROJECT. Students should complete the missing code and understand the ADT operation being modelled.

```python
# Example solution varies. Students should extend the RPG control desk with their own operations.
```
