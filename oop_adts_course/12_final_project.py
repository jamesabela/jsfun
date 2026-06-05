# https://jamesabela.github.io/jsfun/oop_adts_course/12_final_project.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 12 of 12 - OOP ADTs
# Final project: RPG control desk
# There are no direct tests for this level.

class Stack:
    def __init__(self):
        self.__items = []

    def push(self, item):
        self.__items.append(item)

    def pop(self):
        if len(self.__items) == 0:
            return None
        return self.__items.pop()

class Queue:
    def __init__(self):
        self.__items = []

    def enqueue(self, item):
        self.__items.append(item)

    def dequeue(self):
        if len(self.__items) == 0:
            return None
        return self.__items.pop(0)

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

    def show(self):
        current = self.__head
        while current is not None:
            print(current.data)
            current = current.next

undo_actions = Stack()
enemy_turns = Queue()
quest_log = LinkedList()

undo_actions.push("Moved north")
undo_actions.push("Used potion")

enemy_turns.enqueue("Goblin")
enemy_turns.enqueue("Dragon")

quest_log.insert_front("Find the key")
quest_log.insert_front("Open the gate")

print("Next enemy:", enemy_turns.dequeue())
print("Undo:", undo_actions.pop())
print("Quests:")
quest_log.show()

#End OOP Abstract Data Types
