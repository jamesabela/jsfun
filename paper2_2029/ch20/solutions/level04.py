frequency = [[1, 1], [2, 1], [3, 2], [4, 1], [5, 3]]
swapped = True
while swapped:
    swapped = False
    for index in range(len(frequency) - 1):
        if frequency[index][1] < frequency[index + 1][1]:
            temporary = frequency[index]
            frequency[index] = frequency[index + 1]
            frequency[index + 1] = temporary
            swapped = True
for row in frequency:
    print("Rating", row[0], "Count", row[1])
