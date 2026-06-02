import random

word_list = ["which", "their", "would", "there", "could", "other", "about", "great"]

answer = random.choice(word_list)

# print("The answer is:", answer)  
# Uncomment line above to test

for turn in range(6):
    guess = input("Enter a 5 letter word: ")
    guess = guess.lower()

    while len(guess) != 5:
        guess = input("Please enter exactly 5 letters: ")
        guess = guess.lower()

    result = ""

    for position in range(5):
        letter = guess[position]

        if letter == answer[position]:
            result = result + "🟩"
        elif letter in answer:
            result = result + "🟨"
        else:
            result = result + "⬛"

    print(guess)
    print(result)

    if guess == answer:
        print("Well done!")
        break

if guess != answer:
    print("The word was", answer)