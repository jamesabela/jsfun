# Teacher Guide: Data Structures with Python Lists

This guide gives notes and solution code for the list-based ADT course. The course intentionally avoids OOP and classes.

## Level 1: Why Data Structures Matter

**Goal:** Run the starter code, then complete the missing labels so it prints the correct ADT names and rules.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `01_adt_intro.html` can be used before students edit `01_adt_intro.py`.

```python
print("Stack = LIFO")
print("Queue = FIFO")
print("Linked list = nodes and pointers")
```

## Level 2: Stack Push and Pop

**Goal:** Complete the program so that it pushes three items, pops one item and prints the final stack.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `02_stack_push.html` can be used before students edit `02_stack_push.py`.

```python
stack = []
stack.append("sword")
stack.append("shield")
stack.append("potion")
removed = stack.pop()
print("Removed:", removed)
print("Stack:", stack)
```

## Level 3: Stack Overflow and Underflow

**Goal:** Complete the two functions. push must refuse to add to a full stack. pop_item must refuse to remove from an empty stack.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `03_stack_limits.html` can be used before students edit `03_stack_limits.py`.

```python
MAX_SIZE = 3
stack = []

def push(item):
    if len(stack) == MAX_SIZE:
        print("Overflow")
    else:
        stack.append(item)
        print("Pushed", item)

def pop_item():
    if len(stack) == 0:
        print("Underflow")
    else:
        print("Popped", stack.pop())

push("A")
push("B")
push("C")
push("D")
pop_item()
pop_item()
pop_item()
pop_item()
```

## Level 4: Queue Enqueue and Dequeue

**Goal:** Complete the program so three people join the queue, then the first person is served.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `04_queue_basic.html` can be used before students edit `04_queue_basic.py`.

```python
queue = []
queue.append("Aisha")
queue.append("Ben")
queue.append("Chen")
served = queue.pop(0)
print("Served:", served)
print("Queue:", queue)
```

## Level 5: Queue Pointers

**Goal:** Complete the missing pointer updates so the queue moves correctly without using pop(0).

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `05_queue_pointers.html` can be used before students edit `05_queue_pointers.py`.

```python
queue = ["red", "blue", "green", "", ""]
front = 0
rear = 2

front = front + 1
rear = rear + 1
queue[rear] = "yellow"

print("Front item:", queue[front])
print("Rear item:", queue[rear])
print("Queue data:", queue)
```

## Level 6: Circular Queue Wraparound

**Goal:** Complete the expression that wraps the rear pointer around using modulo.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `06_circular_queue.html` can be used before students edit `06_circular_queue.py`.

```python
queue = ["", "B", "C", "D"]
front = 1
rear = 3
size = 4

rear = (rear + 1) % size
queue[rear] = "E"

print("Rear pointer:", rear)
print("Queue:", queue)
```

## Level 7: Linked List Traversal

**Goal:** Complete the while loop so it follows the next pointers until it reaches -1.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `07_linked_list_traverse.html` can be used before students edit `07_linked_list_traverse.py`.

```python
data = ["ant", "bee", "cat", "dog"]
next_node = [2, -1, 3, 1]
start = 0

pointer = start
while pointer != -1:
    print(data[pointer])
    pointer = next_node[pointer]
```

## Level 8: Linked List Insert at the Front

**Goal:** Complete the insertion so eel becomes the new first item.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `08_linked_list_insert.html` can be used before students edit `08_linked_list_insert.py`.

```python
data = ["ant", "bee", "cat", "dog", ""]
next_node = [2, -1, 3, 1, -1]
start = 0
free = 4

data[free] = "eel"
next_node[free] = start
start = free

pointer = start
while pointer != -1:
    print(data[pointer])
    pointer = next_node[pointer]
```

## Level 9: Searching a Linked List

**Goal:** Complete the search so it finds dog by following the pointers.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `09_linked_list_search.html` can be used before students edit `09_linked_list_search.py`.

```python
data = ["ant", "bee", "cat", "dog"]
next_node = [2, -1, 3, 1]
start = 0
target = "dog"
found = False

pointer = start
while pointer != -1 and found == False:
    if data[pointer] == target:
        found = True
    else:
        pointer = next_node[pointer]

print("Found:", found)
print("Pointer:", pointer)
```

## Level 10: Final Project: Arcade Control Desk

**Goal:** Build the project in stages. Start with the given list variables, then add a menu that allows push/pop, enqueue/dequeue and linked list traversal. This project is checked by output keywords rather than strict behaviour, so you can be creative.

**Teacher note:** Focus students on the ADT operation and the pointer/state change, not on memorising code. The animation in `10_final_project.html` can be used before students edit `10_final_project.py`.

```python
undo_stack = []
player_queue = []
quest_data = ["Find key", "Open gate", "Defeat boss"]
quest_next = [1, 2, -1]
quest_start = 0

print("Arcade Control Desk")
print("Stack ready")
print("Queue ready")
print("Linked list ready")

undo_stack.append("added player Max")
player_queue.append("Max")
player_queue.append("Aisha")
print("Next player:", player_queue.pop(0))
print("Undo action:", undo_stack.pop())

pointer = quest_start
while pointer != -1:
    print("Quest:", quest_data[pointer])
    pointer = quest_next[pointer]
```
