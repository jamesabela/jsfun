# Level 8 of 12 - Python Recursion Course
# Tutorial: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/08_recursive_binary_search.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/vocabulary.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/exam_examples.html

# Complete a recursive binary search.
# The list is already sorted.

def binary_search(data, first, last, to_find):
    if first > last:
        return -1

    middle = (first + last) // 2

    if data[middle] == to_find:
        return middle

    if to_find < data[middle]:
        # TODO: search the left half
        return -1
    else:
        # TODO: search the right half
        return -1

numbers = [1, 3, 5, 9, 12, 15, 18]
target = int(input("Number to find: "))
print(binary_search(numbers, 0, len(numbers) - 1, target))

#Input
# 9
# 7
# 1

#output
# 3
# -1
# 0

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/09_towers_of_hanoi.py
