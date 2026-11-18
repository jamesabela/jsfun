accepted = False

while accepted == False:
    anynum = int(input("Please enter a number above 50:  "))

    if anynum < 50:
        print(anynum, "is NOT above 50!")
    else:
        print(anynum, "is above 50!")
        accepted = True

while anynum > 0:
    print("Number is: ", anynum)
    anynum = anynum - 1

print("Value is now: ", anynum)
print("Reached Zero!")
print("End of Loop")
