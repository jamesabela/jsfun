# Answer file for F-String Comic Academy
quantity = int(input("Number of comic books: "))
price = float(input("Price of one comic book: "))
total = quantity * price
print(f"{quantity} comic books cost ${total:.2f}.")
