ratings = [5, 3, 5, 1, 3, 5, 2, 4]
frequency = []
for rating in range(1, 6):
    frequency.append([rating, ratings.count(rating)])
for row in frequency:
    print(row[0], row[1])
