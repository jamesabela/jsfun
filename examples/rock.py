import random

choices = ["r", "p", "s"]

player = input("Choose r for rock, p for paper or s for scissors: ").lower()
computer = random.choice(choices)

if player == "r":
    player_word = "rock"
elif player == "p":
    player_word = "paper"
else:
    player_word = "scissors"

if computer == "r":
    computer_word = "rock"
elif computer == "p":
    computer_word = "paper"
else:
    computer_word = "scissors"

print("You chose:", player_word)
print("Computer chose:", computer_word)

if player == computer:
    print("It is a draw!")

elif player == "r" and computer == "s":
    print("You win! Rock beats scissors.")

elif player == "p" and computer == "r":
    print("You win! Paper beats rock.")

elif player == "s" and computer == "p":
    print("You win! Scissors beats paper.")

else:
    print("Computer wins!")