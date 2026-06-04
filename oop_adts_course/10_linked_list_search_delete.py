# https://jamesabela.github.io/jsfun/oop_adts_course/10_linked_list_search_delete.html
# https://jamesabela.github.io/jsfun/oop_adts_course/vocabulary.html
# https://jamesabela.github.io/jsfun/oop_adts_course/exam_examples.html

# Level 10 of 12 - OOP ADTs
# Complete the search method.

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
            if current.data == ___:
                return True
            current = current.next
        return False

items = LinkedList()
items.insert_front("map")
items.insert_front("key")
items.insert_front("coin")
print(items.search("key"))
print(items.search("sword"))

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/oop_adts_course/11_adt_from_adt.py

#Input
# ""

#output
# True, False
