def input_score():
    score = int(input("Score 0-20: "))
    while score < 0 or score > 20:
        score = int(input("Score 0-20: "))
    return score

print("Accepted:", input_score())
