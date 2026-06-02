maze = [
    "█████████████████████████████████████████",
    "S █         █       █               █   █",
    "█ █ ███████ █ ████  ███████ ███ █ █   █ █",
    "█   █   █ █   █ █   █           █ █ █ █ █",
    "█████ █ █ ███ █ █ ███  █ ██████ █ █ █ █ █",
    "█     █         █ █       █     █     █ █",
    "█ ███████ ███████ ███████ █████ █ █████ █",
    "█ █       █       █     █     █ █ █ █   █",
    "█ ███████ █ ███████ ███ █ ███ ███ █ █ ███",
    "█ █     █ █ █       █ █     █       █   █",
    "█ █ ███ ███ █ ███ ███ █ ███ ███████████ █",
    "█   █   █   █   █ █   █ █       █     █ █",
    "█ ███ █ █ ███████ █ ███ ████ ████ ███ █ █",
    "█ █   █ █     █   █     █         █ █   █",
    "█ █ █ ███████ █ ███ ███ █ ███████ █ █ █ █",
    "█ █ █ █     █ █ █ █ █         █ █     █ █",
    "███ █ █ █ ███ █ █ █ ██████  █ █ █ █████ █",
    "█   █ █ █   █   █     █       █ █ █     █",
    "█ █████ ███ █████ ███ █ ███████ █ ██  █ █",
    "█         █             █             █ E",
    "█████████████████████████████████████████"
]

def show_maze():
    for row in maze:
        print(row)
    print()

def replace_char(row, col, char):
    maze[row] = maze[row][:col] + char + maze[row][col + 1:]

def solve(row, col):
    # Stop if outside the maze
    if row < 0 or row >= len(maze):
        return False

    if col < 0 or col >= len(maze[0]):
        return False

    # Stop if this is a wall
    if maze[row][col] == "█":
        return False

    # Stop if already visited
    if maze[row][col] == ".":
        return False

    # Success if this is the exit
    if maze[row][col] == "E":
        print("Found the exit!")
        return True

    # Mark this square as visited
    if maze[row][col] != "S":
        replace_char(row, col, ".")

    show_maze()

    # Try each direction
    if solve(row - 1, col):   # up
        return True

    if solve(row + 1, col):   # down
        return True

    if solve(row, col - 1):   # left
        return True

    if solve(row, col + 1):   # right
        return True

    return False

show_maze()

# Start at S
solve(1, 0)