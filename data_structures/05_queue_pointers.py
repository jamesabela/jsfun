# Tutorial: https://jamesabela.github.io/jsfun/data_structures/05_queue_pointers.html
# Vocabulary: https://jamesabela.github.io/jsfun/data_structures/vocabulary.html
# Breadcrumb: Level 5 of 10 - Data Structures

queue = ["red", "blue", "green", "", ""]
front = 0
rear = 2

# Dequeue one item by moving the front pointer forward.
front = front + ___

# Enqueue yellow by moving the rear pointer forward and storing yellow there.
rear = rear + ___
queue[rear] = "___"

print("Front item:", queue[front])
print("Rear item:", queue[rear])
print("Queue data:", queue)

#Input
# ""

#output
# Front item: blue, Rear item: yellow, ['red', 'blue', 'green', 'yellow', '']

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/data_structures/06_circular_queue.py
