values = [12, 4, 7, 4, 19]
target = int(input("Target: "))
position = -1
for index in range(len(values)):
    if values[index] == target:
        position = index
        break
print("Position:", position)
