# Tutorial: https://jamesabela.github.io/jsfun/Y8/lessons/u4_01_while_vs_for.html

print("==== WHILE Loop DEMO ====")
count = 1
while count <= 10:
    print("Count is:", count)
    count = count + 1

print("==== FOR Loop DEMO ====")
for count in range(1, 10):
    print("Count is:", count)

numbers = [6, 5, 3, 8, 4, 2, 5, 4, 11]
total = 0
for value in numbers:
    total = total + value
print("The sum is", total)

#Input
# ""

#output
# The sum is 48
