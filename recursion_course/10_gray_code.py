# Level 10 of 12 - Python Recursion Course
# Tutorial: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/10_gray_code.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/vocabulary.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/exam_examples.html

# Complete the recursive Gray code generator.

def gray(n):
    if n == 1:
        return ["0", "1"]

    smaller = gray(n - 1)

    first_half = []
    second_half = []

    # TODO: add "0" to the front of each code in smaller
    # TODO: add "1" to the front of each code in reversed(smaller)

    return first_half + second_half

bits = int(input("Bits: "))
print(gray(bits))

#Input
# 2
# 3

#output
# 00, 01, 11, 10
# 000, 001, 011, 010, 110, 111, 101, 100

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/11_turtle_tree.py
