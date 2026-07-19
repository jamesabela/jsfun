# Teacher Guide - F-String Comic Academy

## Course position

This is a beginner course for students who already know variables, `print()` and basic `input()`. It can also work as a short introduction to numeric formatting.

## Teaching approach

The course begins with the smallest useful f-string and adds one idea at a time. Ask students to predict the output before they run each program. Encourage them to explain what the `f`, braces and format codes do.

F-strings are useful when text contains values. They should not replace every ordinary string. The final mission deliberately includes a fixed narrator line that is clearer as a plain string.

## Suggested lesson structure

1. Demonstrate Levels 1 and 2 using Display Mode.
2. Students complete Levels 3-5 independently.
3. Pause to explain `:.2f` and `:.1%` before Levels 6-8.
4. Use Level 9 as a debugging discussion.
5. Finish with Level 10 and ask students to customise the story after passing the tests.

## Assessment questions

- What does the `f` before the quote tell Python?
- What is the purpose of the braces?
- Why is `:.2f` useful for money?
- What does `:.1%` do to a decimal value?
- When should you use a plain string instead of an f-string?

## Level 1: Hero Name Badge

**Goal:** Use an f-string to place one variable inside a message.

**Teacher focus:** An f-string starts with the letter f. Python replaces anything inside braces with its current value.

**Likely misconception:** Without the f, Python prints the braces and variable name as ordinary text.

**Answer file:** `solutions/01_hero_name.py`

```python
hero_name = "Nova"
print(f"Hero name: {hero_name}")
```

## Level 2: Power Announcement

**Goal:** Place several variables inside one f-string.

**Teacher focus:** Each pair of braces can contain a different variable. Python builds one complete sentence from the text and values.

**Likely misconception:** Do not place quotation marks around a variable inside the braces.

**Answer file:** `solutions/02_power_announcement.py`

```python
hero = "Nova"
city = "Byte City"
power = "lightning"
print(f"{hero} protects {city} using {power}!")
```

## Level 3: Gamer Status

**Goal:** Combine input values with an f-string.

**Teacher focus:** input() returns text. Store each answer in a variable and then place the variables inside braces.

**Likely misconception:** Writing {input(...)} directly can make the program hard to read. Clear variable names are better here.

**Answer file:** `solutions/03_gamer_status.py`

```python
name = input("Player name: ")
game = input("Favourite game: ")
print(f"{name} plays {game}.")
```

## Level 4: Score Alert

**Goal:** Display an integer inside a message.

**Teacher focus:** The score is converted to an integer for calculations. An f-string displays it automatically, so str(score) is not needed.

**Likely misconception:** Do not join text and an integer with +. That causes a TypeError unless the number is converted first.

**Answer file:** `solutions/04_score_alert.py`

```python
player = input("Player: ")
score = int(input("Score: "))
print(f"{player} scored {score} points!")
```

## Level 5: Bonus Coins

**Goal:** Use a simple calculation inside an f-string.

**Teacher focus:** Braces can contain a short Python expression. Python calculates coins + bonus before placing the answer in the message.

**Likely misconception:** Keep expressions short. Longer calculations are usually clearer when stored in a separate variable.

**Answer file:** `solutions/05_bonus_coins.py`

```python
coins = int(input("Coins collected: "))
bonus = int(input("Bonus coins: "))
print(f"You now have {coins + bonus} coins.")
```

## Level 6: Comic Shop Bill

**Goal:** Format a money value to two decimal places.

**Teacher focus:** The format code :.2f means display a floating-point number with exactly two digits after the decimal point.

**Likely misconception:** The colon goes inside the braces: {total:.2f}.

**Answer file:** `solutions/06_comic_shop_bill.py`

```python
quantity = int(input("Number of comic books: "))
price = float(input("Price of one comic book: "))
total = quantity * price
print(f"{quantity} comic books cost ${total:.2f}.")
```

## Level 7: Comic Issue Title

**Goal:** Call a simple string method inside an f-string.

**Teacher focus:** The expression name.upper() creates an uppercase version of the name. The original variable is not changed.

**Likely misconception:** Remember the brackets in upper(). Without them, Python refers to the method instead of running it.

**Answer file:** `solutions/07_issue_title.py`

```python
hero = input("Hero name: ")
issue = int(input("Issue number: "))
print(f"{hero.upper()} - ISSUE {issue}")
```

## Level 8: Win Rate Display

**Goal:** Format a decimal as a percentage.

**Teacher focus:** The format code :.1% multiplies the value by 100, shows one decimal place and adds the percent sign.

**Likely misconception:** Do not multiply by 100 as well as using %. The percentage format already does that.

**Answer file:** `solutions/08_win_rate.py`

```python
player = input("Player: ")
wins = int(input("Wins: "))
games = int(input("Games played: "))
win_rate = wins / games
print(f"{player} win rate: {win_rate:.1%}")
```

## Level 9: Fix the Broken Message

**Goal:** Find and fix a common f-string error.

**Teacher focus:** This program has valid Python syntax, but the output is wrong. Add the missing f before the opening quote.

**Likely misconception:** A program can run without crashing and still be incorrect. Always check the actual output.

**Answer file:** `solutions/09_fix_the_message.py`

```python
name = input("Player name: ")
level = int(input("Level reached: "))
print(f"{name} has reached level {level}!")
```

## Level 10: Comic Generator

**Goal:** Build a short text comic using inputs, variables and several f-strings.

**Teacher focus:** A good final program keeps each line readable. Use one f-string for each line of narration or dialogue.

**Likely misconception:** Use plain strings for fixed text and f-strings only on lines that include values. Do not add f everywhere without a reason.

**Answer file:** `solutions/10_comic_generator.py`

```python
hero = input("Hero: ")
sidekick = input("Sidekick: ")
place = input("Place: ")
villain = input("Villain: ")
gadgets = int(input("Number of gadgets: "))

print(f"Narrator: At {place} {hero} met {sidekick}.")
print(f"{hero}: We must stop {villain}!")
print(f"{sidekick}: I have {gadgets} gadgets ready.")
print("Narrator: The adventure begins!")
```
