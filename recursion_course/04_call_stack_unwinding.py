# Level 4 of 12 - Python Recursion Course
# Tutorial: https://jamesabela.github.io/jsfun/recursion_course/04_call_stack_unwinding.html

# Tutorial level: read the guide and run this trace.
# There is a small output check, but the main learning is the stack explanation.

def factorial_trace(n, depth=0):
    print("  " * depth + "Call factorial(" + str(n) + ")")

    if n == 1:
        print("  " * depth + "Base case reached")
        return 1

    result = n * factorial_trace(n - 1, depth + 1)
    print("  " * depth + "Return " + str(result))
    return result

answer = factorial_trace(3)
print("Final answer", answer)
print("Stack unwinding complete")

#Input
# ""

#output
# Call factorial(3), Base case reached, Final answer 6, Stack unwinding complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/05_fibonacci_sequence.py
