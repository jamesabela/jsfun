# https://jamesabela.github.io/jsfun/oop_adts_course/09_linked_list_insert_traverse.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 9 of 12 - OOP ADTs
# Complete insert_front and traverse.

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
        self.__head = ___

    def traverse(self):
        current = self.__head
        while current is not None:
            print(current.data)
            current = current.___

quests = LinkedList()
quests.insert_front("Dragon")
quests.insert_front("Goblin")
quests.traverse()

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/10_linked_list_search_delete.py

#Input
# ""

#output
# Goblin, Dragon
