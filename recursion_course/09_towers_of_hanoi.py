# Level 9 of 12 - Python Recursion Course
# Tutorial: https://jamesabela.github.io/jsfun/recursion_course/09_towers_of_hanoi.html


# Complete the recursive Towers of Hanoi procedure.

def hanoi(disks, start, helper, end):
    if disks == 1:
        print("Move disk from", start, "to", end)
    else:
        # TODO: move disks - 1 from start to helper
        # TODO: move one disk from start to end
        # TODO: move disks - 1 from helper to end
        pass

hanoi(3, "A", "B", "C")
print("Hanoi complete")

#Input
# ""

#output
# Move disk from A to C, Move disk from A to B, Move disk from C to B, Hanoi complete

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/recursion_course/10_gray_code.py
