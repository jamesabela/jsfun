total = 0
count = 0
for index in range(3):
    value = int(input("Value: "))
    total = total + value
    if value >= 5:
        count = count + 1
print(total)
print(count)
