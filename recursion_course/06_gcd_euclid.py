# Level 6 of 12 - Python Recursion Course
# Tutorial: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/06_gcd_euclid.html
# Vocabulary: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/vocabulary.html
# Exam examples: https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/exam_examples.html

# Complete Euclid's recursive greatest common divisor algorithm.

def gcd(a, b):
    if b == 0:
        return a

    # TODO: return gcd(b, a % b)
    return 0

first = int(input("First number: "))
second = int(input("Second number: "))
print(gcd(first, second))

#Input
# 48, 18
# 20, 12
# 17, 12

#output
# 6
# 4
# 1

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/07_recursive_cinema.py
