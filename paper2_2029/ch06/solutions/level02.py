FEE = 5
EQUIPMENT = 12
students = int(input("Students: "))
total = students * FEE + EQUIPMENT
if students >= 10:
    total = total - 10
print("Total:", total)
