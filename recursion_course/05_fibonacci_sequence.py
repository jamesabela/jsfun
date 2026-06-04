# Level 5 of 12 - Python Recursion Course
# Tutorial: https://jamesabela.github.io/jsfun/recursion_course/05_fibonacci_sequence.html

# Complete the recursive Fibonacci function.
# fib(0) is 0 and fib(1) is 1.

def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1

    # TODO: return fib(n - 1) + fib(n - 2)
    return -1

number = int(input("Which Fibonacci position? "))
print(fib(number))

#Input
# 6
# 7
# 1

#output
# 8
# 13
# 1

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/06_gcd_euclid.py
