values = []
for index in range(4):
    values.append(int(input("Value: ")))
for index in range(len(values) - 1):
    if values[index] > values[index + 1]:
        temporary = values[index]
        values[index] = values[index + 1]
        values[index + 1] = temporary
for value in values:
    print(value)
