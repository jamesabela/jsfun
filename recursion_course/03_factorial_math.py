# Level 3 of 12 - Python Recursion Course
# Tutorial: https://jamesabela.github.io/jsfun/recursion_course/recursion_course/03_factorial_math.html

# Complete the recursive factorial function.

def factorial(n):
    # Base case
    if n == 0 or n == 1:
        return 1

    # TODO: return n multiplied by factorial(n - 1)
    return 0

number = int(input("Enter a number: "))
print(factorial(number))

#Input
# 5
# 0
# 3

#output
# 120
# 1
# 6

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/04_call_stack_unwinding.py
