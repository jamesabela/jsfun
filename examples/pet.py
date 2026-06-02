pet_name = input("What is your pet called? ")

hunger = 5
happiness = 5
energy = 5

while True:
    print()
    print(pet_name, "stats:")
    print("Hunger:", hunger)
    print("Happiness:", happiness)
    print("Energy:", energy)

    print()
    print("What do you want to do?")
    print("1. Feed")
    print("2. Play")
    print("3. Sleep")
    print("4. Quit")

    choice = input("Choose 1, 2, 3 or 4: ")

    if choice == "1":
        hunger = hunger - 2
        energy = energy - 1
        print("You fed", pet_name)

    elif choice == "2":
        happiness = happiness + 2
        energy = energy - 2
        hunger = hunger + 1
        print("You played with", pet_name)

    elif choice == "3":
        energy = energy + 3
        hunger = hunger + 1
        print(pet_name, "had a nap")

    elif choice == "4":
        print("Goodbye!")
        break

    else:
        print("That was not a valid choice.")

    if hunger < 0:
        hunger = 0
    if happiness < 0:
        happiness = 0
    if energy < 0:
        energy = 0

    if hunger > 10:
        hunger = 10
    if happiness > 10:
        happiness = 10
    if energy > 10:
        energy = 10

    if hunger == 10:
        print(pet_name, "is very hungry!")

    if happiness == 0:
        print(pet_name, "is very sad!")

    if energy == 0:
        print(pet_name, "is exhausted!")

# Make this more fun https://jamesabela.github.io/jsfun/examples/pet.html