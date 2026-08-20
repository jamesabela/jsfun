# Teacher Guide: Sorts and Searches with Big O

## Notes

This course is designed for A-level 9618-style algorithm work. The key teaching emphasis is not only that students can code the algorithms, but that they can explain why the worst-case Big O result follows from the algorithm's steps.

### Cambridge 9618 Exam "Middle Step" Guidance
Exam markers look for a clear **middle step** connecting the algorithm's mechanism to its Big O notation:
- **Linear Search $O(n)$**: Checks elements one by one. In the worst case, the target is at the very end or absent, requiring $n$ comparisons.
- **Binary Search $O(\log n)$**: Repeatedly compares with the middle value and discards half the array. Halving an array of $n$ elements down to 1 element takes at most $\log_2(n)$ comparisons.
- **Bubble Sort & Insertion Sort $O(n^2)$**: Require nested passes comparing/shifting elements, taking up to $n \times n$ comparisons/swaps in the worst case.

## Solutions

## Level 1: Why Big O Matters

```python
print("constant = O(1)")
print("linear = O(n)")
print("quadratic = O(n^2)")
```

## Level 2: Linear Search

```python
numbers = [4, 8, 15, 16, 23, 42]
target = int(input("Target: "))
found = False

for i in range(len(numbers)):
    if numbers[i] == target:
        found = True
        print("Found at index", i)

if found == False:
    print("Not found")
```

## Level 3: Turtle Linear Search

```python
Tutorial only - students can modify target and values.
```

## Level 4: Binary Search: Check the Middle

```python
numbers = [2, 5, 7, 9, 12, 15, 19]
low = 0
high = len(numbers) - 1
middle = (low + high) // 2
print("Middle index", middle)
print("Middle value", numbers[middle])
```

## Level 5: Binary Search Code

```python
numbers = [2, 5, 7, 9, 12, 15, 19, 22, 31]
target = int(input("Target: "))
low = 0
high = len(numbers) - 1
found = False

while low <= high and found == False:
    middle = (low + high) // 2
    if numbers[middle] == target:
        found = True
        print("Found at index", middle)
    elif target < numbers[middle]:
        high = middle - 1
    else:
        low = middle + 1

if found == False:
    print("Not found")
```

## Level 6: Why 9618 Uses Worst Case

```python
print("linear worst case = n")
print("binary worst case = log n")
```

**Teacher Tip for Level 6:**
Ensure students understand *why* binary search is `log n`:
- Emphasize that dividing a list in half repeatedly is the mathematical inverse of doubling ($2^k = n \implies k = \log_2 n$).
- Contrast $n = 1,000,000$ (linear: $1,000,000$ steps) vs (binary: ~20 steps) to highlight the power of $O(\log n)$.
- Remind students that Binary Search **requires sorted data** to achieve this performance.

## Level 7: Bubble Sort: Compare Neighbours

```python
numbers = [5, 2, 8]
i = 0

if numbers[i] > numbers[i + 1]:
    temp = numbers[i]
    numbers[i] = numbers[i + 1]
    numbers[i + 1] = temp

print(numbers)
```

## Level 8: Bubble Sort Full Algorithm

```python
numbers = [9, 4, 7, 1]

for pass_num in range(len(numbers)):
    for i in range(len(numbers) - 1):
        if numbers[i] > numbers[i + 1]:
            temp = numbers[i]
            numbers[i] = numbers[i + 1]
            numbers[i + 1] = temp

print(numbers)
```

## Level 9: Turtle Bubble Sort Bars

```python
Tutorial only - students can modify values and observe.
```

## Level 10: Insertion Sort

```python
numbers = [6, 3, 8, 2]

for i in range(1, len(numbers)):
    key = numbers[i]
    j = i - 1
    while j >= 0 and numbers[j] > key:
        numbers[j + 1] = numbers[j]
        j = j - 1
    numbers[j + 1] = key

print(numbers)
```

## Level 11: Compare Algorithms

```python
print("linear search works on unsorted data")
print("binary search needs sorted data")
print("bubble sort worst case is O(n^2)")
print("insertion sort worst case is O(n^2)")
```

## Level 12: Final Project: Algorithm Arcade

```python
Open-ended project - no single solution.
```

