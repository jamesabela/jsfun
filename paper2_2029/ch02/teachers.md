# Teacher guide - Chapter 2

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - Numeric input

Input two integers and display their sum. Avoid concatenating the input strings.



```python
first = int(input("First: "))
second = int(input("Second: "))
print(first + second)
```

Tests:
- Inputs `['2', '3']`; exact output lines `['5']`.
- Inputs `['12', '8']`; exact output lines `['20']`.
- Inputs `['-4', '4']`; exact output lines `['0']`.

## Level 2 - Minutes and seconds

Input non-negative whole seconds. Display Minutes: and Seconds: on separate lines using floor division and remainder.



```python
seconds = int(input("Seconds: "))
print("Minutes:", seconds // 60)
print("Seconds:", seconds % 60)
```

Tests:
- Inputs `['59']`; exact output lines `['Minutes: 0', 'Seconds: 59']`.
- Inputs `['60']`; exact output lines `['Minutes: 1', 'Seconds: 0']`.
- Inputs `['137']`; exact output lines `['Minutes: 2', 'Seconds: 17']`.

## Level 3 - Inclusive comparison

Input an integer and print the Boolean result of checking whether it is from 10 to 20 inclusive.



```python
value = int(input("Value: "))
print(value >= 10 and value <= 20)
```

Tests:
- Inputs `['9']`; exact output lines `['False']`.
- Inputs `['10']`; exact output lines `['True']`.
- Inputs `['20']`; exact output lines `['True']`.
- Inputs `['21']`; exact output lines `['False']`.

## Level 4 - Price conversion

Input an integer quantity then a decimal price. Display their product. Assume valid numeric input.



```python
quantity = int(input("Quantity: "))
price = float(input("Price: "))
print(quantity * price)
```

Tests:
- Inputs `['3', '2.5']`; exact output lines `['7.5']`.
- Inputs `['0', '4.0']`; exact output lines `['0.0']`.
- Inputs `['2', '6.25']`; exact output lines `['12.5']`.

## Level 5 - Total and count

Input three integer scores. Display Count: 3, their Total: and Mean: on separate lines. Use a running total.



```python
count = 0
total = 0
first = int(input("Score 1: "))
total = total + first
count = count + 1
second = int(input("Score 2: "))
total = total + second
count = count + 1
third = int(input("Score 3: "))
total = total + third
count = count + 1
print("Count:", count)
print("Total:", total)
print("Mean:", total / count)
```

Tests:
- Inputs `['3', '6', '9']`; exact output lines `['Count: 3', 'Total: 18', 'Mean: 6.0']`.
- Inputs `['0', '0', '0']`; exact output lines `['Count: 3', 'Total: 0', 'Mean: 0.0']`.

