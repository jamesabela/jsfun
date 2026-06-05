# Spy Missions: Python Codebreakers - Teacher Guide

This guide gives the intended concept, expected outcome and drop-in solution for each level.

## Mission 01: The Steel Door

- Source: Bronze Stage 1 Part 1
- Concept: lists and slicing
- Goal: Read a line of space-separated integers. Output the sum of every third number: positions 0, 3, 6 and so on.

### Solution

```python
numbers = [int(x) for x in input().split()]
total = sum(numbers[0::3])
print(total)
```

## Mission 02: The Factor Lock

- Source: Bronze Stage 1 Part 2
- Concept: factors and loops
- Goal: Read one integer. Output its highest proper factor.

### Solution

```python
n = int(input())
for factor in range(n // 2, 0, -1):
    if n % factor == 0:
        print(factor)
        break
```

## Mission 03: The Identity Console

- Source: Bronze Stage 1 Part 3
- Concept: arithmetic sequences
- Goal: Read a space-separated sequence. If it is arithmetic, output it in the form an + m. Otherwise output null.

### Solution

```python
def nice(x):
    if x == int(x):
        return str(int(x))
    return str(x)

values = [float(x) for x in input().split()]
difference = values[1] - values[0]
works = True
for i in range(1, len(values)):
    if values[i] - values[i - 1] != difference:
        works = False

if works == False:
    print('null')
else:
    m = values[0] - difference
    if m >= 0:
        print(nice(difference) + 'n + ' + nice(m))
    else:
        print(nice(difference) + 'n - ' + nice(abs(m)))
```

## Mission 04: Mainframe Countdown

- Source: Bronze Stage 2 Part 1
- Concept: sequence formulae
- Goal: Read an arithmetic sequence. If valid, output the sum of the next 100 terms after the given sequence. Otherwise output null.

### Solution

```python
def nice(x):
    if x == int(x):
        return str(int(x))
    return str(x)

values = [float(x) for x in input().split()]
d = values[1] - values[0]
works = True
for i in range(1, len(values)):
    if values[i] - values[i - 1] != d:
        works = False

if not works:
    print('null')
else:
    total = 0
    current = values[-1]
    for i in range(100):
        current = current + d
        total = total + current
    print(nice(total))
```

## Mission 05: Encrypted Symbols

- Source: Bronze Stage 2 Part 2
- Concept: strings and counting
- Goal: Input format: text|symbols. Count each symbol listed after the pipe and print the counts on one line.

### Solution

```python
data = input()
text, symbols = data.split('|')
answers = []
for symbol in symbols.split():
    answers.append(str(text.count(symbol)))
print(' '.join(answers))
```

## Mission 06: The LCM Cipher

- Source: Bronze Stage 2 Part 3
- Concept: gcd and lcm
- Goal: Read two integers on one line. Output their lowest common multiple.

### Solution

```python
import math

a, b = [int(x) for x in input().split()]
answer = abs(a * b) // math.gcd(a, b)
print(answer)
```

## Mission 07: Escape Route Cleanup

- Source: Bronze Stage 3 Part 1
- Concept: lists and duplicates
- Goal: Read space-separated route tokens. Print them again with duplicates removed, keeping the first appearance.

### Solution

```python
items = input().split()
clean = []
for item in items:
    if item not in clean:
        clean.append(item)
print(' '.join(clean))
```

## Mission 08: Factorial File

- Source: Bronze Stage 3 Part 2
- Concept: for loops and multiplication
- Goal: Read one integer and output its factorial.

### Solution

```python
n = int(input())
answer = 1
for i in range(1, n + 1):
    answer = answer * i
print(answer)
```

## Mission 09: Reverse Factorial

- Source: Bronze Stage 3 Part 3
- Concept: while loops
- Goal: Read a factorial value. Output the original number n. If it is not a factorial, output not found.

### Solution

```python
target = int(input())
n = 1
value = 1
while value < target:
    n = n + 1
    value = value * n

if value == target:
    print(n)
else:
    print('not found')
```

## Mission 10: Longest Word Warning

- Source: Bronze Stage 3 Part 4
- Concept: string splitting
- Goal: Read a sentence. Output the longest word. Punctuation counts as part of a word.

### Solution

```python
sentence = input()
words = sentence.split()
longest = words[0]
for word in words:
    if len(word) > len(longest):
        longest = word
print(longest)
```

## Mission 11: Find The Mole

- Source: Silver Stage 1 Part 1
- Concept: sets and median
- Goal: Input format: left list|right list. Lists are space-separated integers. Output the median of the sorted unique values.

### Solution

```python
data = input()
left, right = data.split('|')
nums = [int(x) for x in left.split()] + [int(x) for x in right.split()]
nums = sorted(set(nums))
mid = len(nums) // 2
if len(nums) % 2 == 1:
    print(nums[mid])
else:
    median = (nums[mid - 1] + nums[mid]) / 2
    if median == int(median):
        print(int(median))
    else:
        print(median)
```

## Mission 12: Whale Number Door

- Source: Silver Stage 1 Part 2
- Concept: digit algorithms
- Goal: A whale number has a digit product divisible by its digit sum. The first whale number is 1. Read n and output the nth whale number.

### Solution

```python
n = int(input())
count = 0
number = 1
while True:
    digits = [int(d) for d in str(number)]
    digit_sum = sum(digits)
    digit_product = 1
    for d in digits:
        digit_product = digit_product * d

    if digit_sum != 0 and digit_product % digit_sum == 0:
        count = count + 1
        if count == n:
            print(number)
            break

    number = number + 1
```

## Mission 13: Increasing Trail

- Source: Silver Stage 1 Part 3
- Concept: subarrays
- Goal: Read a list of space-separated integers. Output the longest contiguous increasing subarray.

### Solution

```python
numbers = [int(x) for x in input().split()]
best = [numbers[0]]
current = [numbers[0]]
for number in numbers[1:]:
    if number > current[-1]:
        current.append(number)
    else:
        current = [number]
    if len(current) > len(best):
        best = current.copy()
print(' '.join(str(x) for x in best))
```

## Mission 14: Bomb Password Words

- Source: Silver Stage 2 Part 1
- Concept: functions and place value
- Goal: Read a non-negative integer up to trillions. Output it in lowercase words without and.

### Solution

```python
ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
scales = ['', 'thousand', 'million', 'billion', 'trillion']

def under_1000(n):
    words = []
    if n >= 100:
        words.append(ones[n // 100])
        words.append('hundred')
        n = n % 100
    if n >= 20:
        words.append(tens[n // 10])
        n = n % 10
    if n > 0:
        words.append(ones[n])
    return words

n = int(input())
if n == 0:
    print('zero')
else:
    groups = []
    scale = 0
    while n > 0:
        part = n % 1000
        if part > 0:
            words = under_1000(part)
            if scales[scale] != '':
                words.append(scales[scale])
            groups.append(words)
        n = n // 1000
        scale = scale + 1

    answer = []
    for group in reversed(groups):
        answer.extend(group)
    print(' '.join(answer))
```

## Mission 15: Largest Running Sum

- Source: Silver Stage 2 Part 2
- Concept: Kadane algorithm
- Goal: Read space-separated integers. Output the maximum sum of any contiguous subarray.

### Solution

```python
numbers = [int(x) for x in input().split()]
best = numbers[0]
current = numbers[0]
for number in numbers[1:]:
    current = max(number, current + number)
    best = max(best, current)
print(best)
```

## Mission 16: Palindrome Maker ID

- Source: Silver Stage 2 Part 3
- Concept: nested loops and strings
- Goal: Read a string and output its longest palindromic substring.

### Solution

```python
text = input()
best = ''
for centre in range(len(text)):
    for left, right in [(centre, centre), (centre, centre + 1)]:
        while left >= 0 and right < len(text) and text[left] == text[right]:
            left = left - 1
            right = right + 1
        word = text[left + 1:right]
        if len(word) > len(best):
            best = word
print(best)
```

## Mission 17: Numopolis Artefact

- Source: Gold Part 1
- Concept: dynamic programming
- Goal: Input format: steps|target. Count ordered ways to make the target using the steps. Output the answer modulo 250.

### Solution

```python
data = input()
steps_text, target_text = data.split('|')
steps = [int(x) for x in steps_text.split()]
target = int(target_text)
ways = [0] * (target + 1)
ways[0] = 1
for total in range(1, target + 1):
    for step in steps:
        if total >= step:
            ways[total] = (ways[total] + ways[total - step]) % 250
print(ways[target])
```

## Mission 18: Ledger Caesar Trail

- Source: Gold Part 2 adapted
- Concept: Caesar cipher
- Goal: Input format: encoded words|shifts. Decode each word using the matching shift.

### Solution

```python
data = input()
message, shifts_text = data.split('|')
words = message.split()
shifts = [int(x) for x in shifts_text.split()]
plain_words = []
for word, shift in zip(words, shifts):
    plain = ''
    for char in word:
        plain = plain + chr((ord(char) - ord('a') - shift) % 26 + ord('a'))
    plain_words.append(plain)
print(' '.join(plain_words))
```

## Mission 19: Traitor Damage Scan

- Source: Gold Part 4
- Concept: sliding window
- Goal: Input format: positive integers|limit. Count distinct contiguous subarrays with a sum less than or equal to the limit.

### Solution

```python
data = input()
array_text, limit_text = data.split('|')
numbers = [int(x) for x in array_text.split()]
limit = int(limit_text)
left = 0
total = 0
count = 0
for right in range(len(numbers)):
    total = total + numbers[right]
    while total > limit:
        total = total - numbers[left]
        left = left + 1
    count = count + (right - left + 1)
print(count)
```

## Mission 20: The Hidden Passage

- Source: Gold Part 5
- Concept: recurrence and modulo
- Goal: Input format: F0 F1 F2 n mod. Use Fn = 2F(n-1) + 3F(n-2) + F(n-3). Output Fn modulo mod.

### Solution

```python
f0, f1, f2, n, mod = [int(x) for x in input().split()]
if n == 0:
    print(f0 % mod)
elif n == 1:
    print(f1 % mod)
elif n == 2:
    print(f2 % mod)
else:
    a = f0 % mod
    b = f1 % mod
    c = f2 % mod
    for i in range(3, n + 1):
        a, b, c = b, c, (2 * c + 3 * b + a) % mod
    print(c)
```
