names = ["Aisha", "Ben", "Chen"]
index = int(input("Index: "))
removed = names.pop(index)
print("Removed:", removed)
for name in names:
    print(name)
