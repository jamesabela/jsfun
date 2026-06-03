# Tutorial: https://jamesabela.github.io/jsfun/whileloops/14_final_pet_game.html

# Level 14 - Final Pet Game
# Puzzle: fix the play action so the game can end.

energy = 3

while energy > 0:
    print("Energy:", energy)
    action = input("Type play or rest: ")

    if action == "play":
        print("The pet runs around")
        energy = energy + 1
    elif action == "rest":
        print("The pet rests")
        energy = energy + 1

    if energy > 5:
        energy = 5

print("Game over")

#Input
# play, play, play
# rest, play, play, play, play, play
# play, rest, play, play, play

#output
# Game over
# Game over
# Game over

#End Python While Loops
