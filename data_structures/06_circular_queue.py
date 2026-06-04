# Tutorial: https://jamesabela.github.io/jsfun/data_structures/06_circular_queue.html
# Vocabulary: https://jamesabela.github.io/jsfun/data_structures/vocabulary.html
# Breadcrumb: Level 6 of 10 - Data Structures

queue = ["", "B", "C", "D"]
front = 1
rear = 3
size = 4

# Use modulo to wrap the rear pointer back to 0.
rear = (rear + 1) ___ size
queue[rear] = "E"

print("Rear pointer:", rear)
print("Queue:", queue)

#Input
# ""

#output
# Rear pointer: 0, Queue: ['E', 'B', 'C', 'D']

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/data_structures/07_linked_list_traverse.py
