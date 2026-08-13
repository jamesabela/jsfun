# n=int(input());print(" "*(n-1)+"A");[print(" "*(n-i)+"A"+" "*(2*i-3)+"A") for i in range(2,n)];print("A"*(2*n-1))

n = int(input())
print(" " * (n - 1) + "A")

for i in range(2, n):
    print(" " * (n - i) + "A" + " " * (2 * i - 3) + "A")

print("A" * (2 * n - 1))