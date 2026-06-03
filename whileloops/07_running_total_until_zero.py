# Tutorial: https://jamesabela.github.io/jsfun/whileloops/07_running_total_until_zero.html

# Level 7 - Total Until Zero
# Keep adding numbers until the user enters 0.

total = 0
number = int(input("Number: "))

while number != 0:
    total = total + number
    number = int(input("Number: "))

print("Total:", total)

#Input
# 0
# 5, 0
# 3, 4, 5, 0

#output
# Total: 0
# Total: 5
# Total: 12

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/08_menu_loop.py
