# Answer file for F-String Comic Academy
player = input("Player: ")
wins = int(input("Wins: "))
games = int(input("Games played: "))
win_rate = wins / games
print(f"{player} win rate: {win_rate:.1%}")
