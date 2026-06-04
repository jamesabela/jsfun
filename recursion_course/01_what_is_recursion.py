# Level 1 of 12 - Python Recursion Course
# Tutorial: https://jamesabela.github.io/jsfun/recursion_course/01_what_is_recursion.html

# Complete the recursive countdown.

def countdown(n):
    # Base case: stop when n is 0
    if n == 0:
        print("Blast off!")
    else:
        print(n)
        # TODO: call countdown again with n - 1
        pass

start = int(input("Start number: "))
countdown(start)

#Input
# 3
# 1

#output
# 3, 2, 1, Blast off!
# 1, Blast off!

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/02_base_case_turtle_circle.py
