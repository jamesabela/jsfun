(function (root) {
  'use strict';

  function getErrorDisplayMode(search) {
    const query = typeof search === 'string'
      ? search
      : (typeof window !== 'undefined' && window.location ? window.location.search : '');
    const params = new URLSearchParams(query);

    const errorsParam = (params.get('errors') || '').trim().toLowerCase();
    if (['raw', 'standard', 'python', 'classic', 'off', '0', 'false'].includes(errorsParam)) {
      return 'standard';
    }
    if (['friendly', 'simple', 'kids', 'on', '1', 'true'].includes(errorsParam)) {
      return 'friendly';
    }

    const friendlyParam = (
      params.get('friendlyErrors') ??
      params.get('friendlyerrors') ??
      params.get('friendly') ??
      ''
    ).trim().toLowerCase();

    if (['0', 'false', 'off', 'no'].includes(friendlyParam)) {
      return 'standard';
    }

    return 'friendly';
  }

  const PYTHON_ERROR_ANALYZER_CODE = `
import builtins as _jsfun_builtins
import difflib as _jsfun_difflib
import io as _jsfun_io
import keyword as _jsfun_keyword
import re as _jsfun_re
import tokenize as _jsfun_tokenize
import traceback as _jsfun_traceback

_JSFUN_CURLY_QUOTES = {
    '\\u201c': '"',
    '\\u201d': '"',
    '\\u2018': "'",
    '\\u2019': "'",
}

_JSFUN_BLOCK_STARTERS = (
    'if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally', 'with'
)

_JSFUN_COMMON_BUILTINS = {
    'print', 'input', 'int', 'str', 'float', 'bool', 'len', 'range', 'list',
    'dict', 'set', 'tuple', 'sum', 'min', 'max', 'abs', 'round', 'sorted',
    'type', 'open', 'True', 'False', 'None'
}


def _jsfun_strip_inline_comment(line):
    in_single = False
    in_double = False
    escaped = False
    for idx, ch in enumerate(line):
        if escaped:
            escaped = False
            continue
        if ch == '\\\\':
            escaped = True
            continue
        if ch == "'" and not in_double:
            in_single = not in_single
        elif ch == '"' and not in_single:
            in_double = not in_double
        elif ch == '#' and not in_single and not in_double:
            return line[:idx].rstrip()
    return line.rstrip()


def _jsfun_find_unclosed_opener(source_code, max_line=None):
    lines = source_code.splitlines()
    if max_line is not None and max_line > 0:
        snippet = '\\n'.join(lines[:max_line])
    else:
        snippet = source_code

    stack = []
    matching = {'(': ')', '[': ']', '{': '}'}
    closing = {')': '(', ']': '[', '}': '{'}

    try:
        tokens = _jsfun_tokenize.generate_tokens(_jsfun_io.StringIO(snippet).readline)
        for tok in tokens:
            if tok.type == _jsfun_tokenize.OP:
                if tok.string in matching:
                    stack.append((tok.string, tok.start[0], tok.start[1] + 1))
                elif tok.string in closing:
                    if stack and stack[-1][0] == closing[tok.string]:
                        stack.pop()
                    else:
                        return {
                            'kind': 'unmatched_closer',
                            'char': tok.string,
                            'expected': closing[tok.string],
                            'line': tok.start[0],
                            'column': tok.start[1] + 1,
                        }
    except _jsfun_tokenize.TokenError as te:
        msg = str(te.args[0]) if te.args else ''
        pos = te.args[1] if len(te.args) > 1 and isinstance(te.args[1], tuple) else (None, None)
        if 'string' in msg.lower():
            return {
                'kind': 'unclosed_string',
                'line': pos[0],
                'column': (pos[1] + 1) if pos[1] is not None else None,
            }
        if stack:
            opener, line_no, col_no = stack[-1]
            return {
                'kind': 'unclosed_bracket',
                'char': opener,
                'expected': matching[opener],
                'line': line_no,
                'column': col_no,
            }
    except IndentationError:
        pass

    if stack:
        opener, line_no, col_no = stack[-1]
        return {
            'kind': 'unclosed_bracket',
            'char': opener,
            'expected': matching[opener],
            'line': line_no,
            'column': col_no,
        }
    return None


def _jsfun_format_clean_traceback(exc):
    tb_lines = []
    if isinstance(exc, SyntaxError):
        line_no = exc.lineno
        if line_no:
            tb_lines.append(f'  Line {line_no}')
        if exc.text:
            text = exc.text.rstrip('\\r\\n')
            tb_lines.append('    ' + text)
            if exc.offset and exc.offset > 0:
                end_col = getattr(exc, 'end_offset', None) or (exc.offset + 1)
                width = max(1, end_col - exc.offset) if end_col > exc.offset else 1
                tb_lines.append('    ' + ' ' * (exc.offset - 1) + '^' * width)
        msg = exc.msg if getattr(exc, 'msg', None) else str(exc)
        tb_lines.append(f'{type(exc).__name__}: {msg}')
        return '\\n'.join(tb_lines)

    frames = _jsfun_traceback.extract_tb(exc.__traceback__)
    user_frames = [f for f in frames if f.filename == '<user_code>']
    if user_frames:
        tb_lines.append('Traceback (your code):')
        for f in user_frames:
            where = '' if f.name == '<module>' else f', in {f.name}'
            tb_lines.append(f'  Line {f.lineno}{where}')
            if f.line:
                tb_lines.append(f'    {f.line}')
    tb_lines.append(f'{type(exc).__name__}: {exc}')
    return '\\n'.join(tb_lines)


def _jsfun_get_line(lines, line_no):
    if line_no is not None and 1 <= line_no <= len(lines):
        return lines[line_no - 1]
    return ''


def _jsfun_analyze_syntax_error(exc, source_code, lines):
    err_type = type(exc).__name__
    msg = (getattr(exc, 'msg', '') or str(exc)).strip()
    msg_lower = msg.lower()
    reported_line = exc.lineno if exc.lineno else None
    line_no = reported_line
    col_no = exc.offset if getattr(exc, 'offset', None) else None
    end_col = getattr(exc, 'end_offset', None)

    target_line = _jsfun_get_line(lines, line_no)
    prev_line = _jsfun_get_line(lines, line_no - 1) if line_no and line_no > 1 else ''
    stripped = _jsfun_strip_inline_comment(target_line).strip()
    prev_stripped = _jsfun_strip_inline_comment(prev_line).strip()

    # 1. IndentationError / TabError
    if isinstance(exc, TabError) or err_type == 'TabError':
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Mixed tabs and spaces',
            'explanation': 'Python gets confused when a program mixes Tab characters and spacebar spaces at the start of lines.',
            'hint': 'Delete the spaces at the start of the line and indent using spaces consistently (4 spaces per level).',
        }

    if isinstance(exc, IndentationError) or err_type == 'IndentationError':
        if 'expected an indented block' in msg_lower:
            return {
                'line': line_no,
                'column': col_no,
                'endColumn': end_col,
                'title': 'Missing indent (spaces at the start)',
                'explanation': 'After a line ending with a colon \`:\`, the next line needs to be pushed in (indented) so Python knows it belongs inside.',
                'hint': 'Press \`Tab\` (or type 4 spaces) at the start of this line.',
            }
        if 'unexpected indent' in msg_lower:
            return {
                'line': line_no,
                'column': col_no,
                'endColumn': end_col,
                'title': 'Extra spaces at the start of the line',
                'explanation': 'This line is pushed in further than Python expected.',
                'hint': 'Remove the extra spaces at the start of this line so it lines up with the code above it.',
            }
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Indentation does not line up',
            'explanation': 'The spaces at the start of this line do not match the lines above it.',
            'hint': 'Check that lines in the same block start with the exact same number of spaces (usually 4 spaces).',
        }

    # 2. Curly / smart quotes pasted from Word or Google Docs
    for check_no, check_text in ((line_no, target_line), (line_no - 1 if line_no else None, prev_line)):
        if check_text and any(q in check_text for q in _JSFUN_CURLY_QUOTES):
            return {
                'line': check_no,
                'column': None,
                'endColumn': None,
                'title': 'Curly quotes instead of straight quotes',
                'explanation': 'This line uses curly quotes (\`“ ”\` or \`‘ ’\`), which often happens when copying from Word or Google Docs.',
                'hint': 'Replace the curly quotes with straight Python quotes: \`"\` or \`\\'\`.',
            }

    # 3. Unclosed quotes / string literal
    if 'unterminated string literal' in msg_lower or 'eol while scanning string literal' in msg_lower or 'eof while scanning triple-quoted string' in msg_lower:
        quote_char = '"' if target_line.count('"') % 2 == 1 else "'"
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Unclosed quote mark',
            'explanation': f'You started some text with \`{quote_char}\` on this line, but forgot to close it at the end.',
            'hint': f'Add a matching \`{quote_char}\` at the end of your text, like \`print("Hello")\`.',
        }

    # 4. Missing parentheses in Python 2 style print
    if 'missing parentheses in call to' in msg_lower:
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Missing brackets around \`print\`',
            'explanation': 'In Python 3, \`print\` always needs round brackets \`()\` around what you want to show.',
            'hint': 'Put brackets around the value, like \`print("Hello")\` instead of \`print "Hello"\`.',
        }

    # 5. Unclosed or unmatched brackets (including look-back to an earlier line!)
    if 'was never closed' in msg_lower or 'unmatched' in msg_lower or 'unexpected eof' in msg_lower or 'incomplete input' in msg_lower:
        bracket_issue = _jsfun_find_unclosed_opener(source_code, line_no)
        if bracket_issue and bracket_issue['kind'] == 'unclosed_bracket':
            ch = bracket_issue['char']
            exp = bracket_issue['expected']
            b_line = bracket_issue['line']
            return {
                'line': b_line,
                'column': bracket_issue['column'],
                'endColumn': bracket_issue['column'] + 1,
                'title': f'Unclosed bracket \`{ch}\`',
                'explanation': f'You opened \`{ch}\` on line {b_line}, so Python is waiting for a matching \`{exp}\`.',
                'hint': f'Add the missing \`{exp}\` to close your \`{ch}\`.',
            }
        if bracket_issue and bracket_issue['kind'] == 'unmatched_closer':
            ch = bracket_issue['char']
            exp = bracket_issue['expected']
            b_line = bracket_issue['line']
            return {
                'line': b_line,
                'column': bracket_issue['column'],
                'endColumn': bracket_issue['column'] + 1,
                'title': f'Extra closing bracket \`{ch}\`',
                'explanation': f'There is an extra \`{ch}\` here that does not have a matching \`{exp}\`.',
                'hint': f'Remove the extra \`{ch}\`, or add the missing \`{exp}\` earlier on the line.',
            }

    # Even for generic "invalid syntax", check if a previous line left an unclosed bracket!
    if line_no and line_no > 1:
        prev_issue = _jsfun_find_unclosed_opener(source_code, line_no - 1)
        if prev_issue and prev_issue['kind'] == 'unclosed_bracket':
            ch = prev_issue['char']
            exp = prev_issue['expected']
            b_line = prev_issue['line']
            return {
                'line': b_line,
                'column': prev_issue['column'],
                'endColumn': prev_issue['column'] + 1,
                'title': f'Unclosed bracket \`{ch}\` on line {b_line}',
                'explanation': f'Python stopped on line {line_no}, but the real problem started on line {b_line}: you opened \`{ch}\` and forgot to close it with \`{exp}\`.',
                'hint': f'Go back to line {b_line} and add the missing \`{exp}\`.',
            }

    # 6. \`else if\` instead of \`elif\`
    if _jsfun_re.match(r'^else\\s+if\\b', stripped):
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Use \`elif\` instead of \`else if\`',
            'explanation': 'Python shortens "else if" into one word: \`elif\`.',
            'hint': 'Change \`else if\` to \`elif\`, for example \`elif score > 5:\`.',
        }

    # 7. Capitalised Python keywords (If, While, For, Def, Else, Elif, Import, Return)
    cap_kw = _jsfun_re.match(r'^(If|Elif|Else|For|While|Def|Class|Import|From|Return|Try|Except|With)\\b', stripped)
    if cap_kw:
        bad_kw = cap_kw.group(1)
        good_kw = bad_kw.lower()
        return {
            'line': line_no,
            'column': 1 + (len(target_line) - len(target_line.lstrip())),
            'endColumn': 1 + (len(target_line) - len(target_line.lstrip())) + len(bad_kw),
            'title': f'Capital letter in \`{bad_kw}\`',
            'explanation': f'Python keywords must be all lowercase. Python does not recognise \`{bad_kw}\` with a capital letter.',
            'hint': f'Change \`{bad_kw}\` to \`{good_kw}\`.',
        }

    # 8. Single \`=\` instead of \`==\` inside \`if\` / \`elif\` / \`while\`
    if _jsfun_re.match(r'^(if|elif|while)\\b', stripped):
        if _jsfun_re.search(r'(?<![=!<>])=(?!=)', stripped) and ':=' not in stripped:
            return {
                'line': line_no,
                'column': col_no,
                'endColumn': end_col,
                'title': 'Use \`==\` to compare values',
                'explanation': 'You used a single \`=\` inside a condition. One \`=\` stores a value in a variable, while two \`==\` checks if two things are equal.',
                'hint': 'Change \`=\` to \`==\`, like \`if answer == "yes":\`.',
            }

    # 9. Python keyword used as variable name (\`for = 5\`, \`class = "7A"\`)
    kw_assign = _jsfun_re.match(r'^([A-Za-z_]\\w*)\\s*=(?!=)', stripped)
    if kw_assign and _jsfun_keyword.iskeyword(kw_assign.group(1)):
        kw = kw_assign.group(1)
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': f'\`{kw}\` is a reserved Python word',
            'explanation': f'Python already uses \`{kw}\` as a special command, so it cannot be used as a variable name.',
            'hint': f'Choose a different variable name, such as \`my_{kw}\`.',
        }

    # 10. Missing colon \`:\` at the end of control / definition statements
    starter_match = _jsfun_re.match(r'^(' + '|'.join(_JSFUN_BLOCK_STARTERS) + r')\\b', stripped)
    if ("expected ':'" in msg_lower) or (starter_match and not stripped.endswith(':')):
        kw = starter_match.group(1) if starter_match else 'this'
        return {
            'line': line_no,
            'column': len(target_line.rstrip()) + 1 if target_line.rstrip() else col_no,
            'endColumn': None,
            'title': 'Missing colon \`:\`',
            'explanation': f'Lines starting with \`{kw}\` must end with a colon \`:\` to start the indented block.',
            'hint': f'Add \`:\` at the very end of line {line_no}, like \`if score == 10:\`.',
        }

    # 11. Space inside a variable name (e.g. \`my score = 10\`)
    space_var = _jsfun_re.match(r'^([A-Za-z_]\\w*)\\s+([A-Za-z_]\\w*)\\s*=(?!=)', stripped)
    if space_var and space_var.group(1) not in _jsfun_keyword.kwlist:
        w1, w2 = space_var.group(1), space_var.group(2)
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Variable names cannot have spaces',
            'explanation': f'Python saw a space between \`{w1}\` and \`{w2}\` before \`=\`, which is not allowed in a variable name.',
            'hint': f'Join the words with an underscore instead: \`{w1}_{w2} = ...\`.',
        }

    # 12. Variable name starting with a number (e.g. \`1st_place = "Ada"\`)
    if 'invalid decimal literal' in msg_lower or _jsfun_re.match(r'^\\d+[A-Za-z_]\\w*\\s*=', stripped):
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Variable names cannot start with a number',
            'explanation': 'In Python, names must start with a letter or an underscore \`_\`, not a digit.',
            'hint': 'Move the number to the end or spell it out, like \`player_1\` or \`first_place\`.',
        }

    # 13. Backwards assignment (\`5 = x\` or \`"hi" = name\`)
    if 'cannot assign to literal' in msg_lower or 'cannot assign to expression' in msg_lower:
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Put the variable name on the left of \`=\`',
            'explanation': 'When storing a value with \`=\`, the variable name always goes on the left and the value goes on the right.',
            'hint': 'Swap the two sides, like \`score = 5\` instead of \`5 = score\`.',
        }

    # 14. Missing comma
    if 'perhaps you forgot a comma' in msg_lower:
        return {
            'line': line_no,
            'column': col_no,
            'endColumn': end_col,
            'title': 'Missing comma \`,\`',
            'explanation': 'Two items are next to each other without a comma \`,\` separating them.',
            'hint': 'Add a comma \`,\` between items in your list or inside \`print(...)\`.',
        }

    # 15. General SyntaxError fallback
    return {
        'line': line_no,
        'column': col_no,
        'endColumn': end_col,
        'title': 'Python did not understand this line',
        'explanation': 'There is a small typing or punctuation mistake (a syntax error) on or just before this line.',
        'hint': 'Check for missing quotes \`"\`, brackets \`()\`, colons \`:\`, or extra symbols on this line and the line right above it.',
    }


def _jsfun_analyze_error(exc, source_code, user_ns=None):
    lines = source_code.splitlines()
    err_type = type(exc).__name__
    raw_msg = str(exc)
    clean_tb = _jsfun_format_clean_traceback(exc)

    if isinstance(exc, SyntaxError):
        info = _jsfun_analyze_syntax_error(exc, source_code, lines)
        line_no = info.get('line')
        return {
            'errorType': err_type,
            'rawMessage': getattr(exc, 'msg', raw_msg) or raw_msg,
            'cleanTraceback': clean_tb,
            'line': line_no,
            'column': info.get('column'),
            'endColumn': info.get('endColumn'),
            'codeLine': _jsfun_get_line(lines, line_no),
            'title': info['title'],
            'explanation': info['explanation'],
            'hint': info['hint'],
        }

    # Extract last <user_code> frame for runtime errors
    frames = _jsfun_traceback.extract_tb(exc.__traceback__)
    user_frames = [f for f in frames if f.filename == '<user_code>']
    line_no = user_frames[-1].lineno if user_frames else None
    code_line = _jsfun_get_line(lines, line_no)

    title = f'{err_type}'
    explanation = 'Something went wrong while running this line of code.'
    hint = 'Read the line highlighted above and check the values your variables hold.'

    if err_type == 'TimeoutInterrupt' or 'timed out' in raw_msg.lower():
        title = 'Program stopped — took too long'
        explanation = 'Your program ran for too long and was stopped automatically. This usually means a loop never ends (an infinite loop).'
        hint = 'Check your \`while\` loop condition and make sure the variable inside it changes so the loop can finish!'

    elif isinstance(exc, NameError):
        m = _jsfun_re.search(r"name '([^']+)' is not defined", raw_msg)
        missing = m.group(1) if m else None
        if isinstance(exc, UnboundLocalError):
            u = _jsfun_re.search(r"local variable '([^']+)'", raw_msg)
            var_name = u.group(1) if u else (missing or 'that variable')
            title = f'Variable \`{var_name}\` used too early'
            explanation = f'Inside your function, you used \`{var_name}\` before giving it a value.'
            hint = f'Give \`{var_name}\` a starting value before using it inside the function.'
        elif missing:
            lower_missing = missing.lower()
            if lower_missing in ('true', 'false', 'none') and missing != lower_missing.capitalize():
                fixed = lower_missing.capitalize()
                title = f'Capital letter needed for \`{fixed}\`'
                explanation = f'In Python, \`{fixed}\` starts with a capital letter (not \`{missing}\`).'
                hint = f'Change \`{missing}\` to \`{fixed}\`.'
            elif lower_missing in _JSFUN_COMMON_BUILTINS and missing != lower_missing:
                title = f'Capital letter in \`{missing}\`'
                explanation = f'Python commands are lowercase. Python does not recognise \`{missing}\` with a capital letter.'
                hint = f'Change \`{missing}\` to \`{lower_missing}\`.'
            else:
                candidates = set(_JSFUN_COMMON_BUILTINS) | set(dir(_jsfun_builtins)) | set(_jsfun_keyword.kwlist)
                if isinstance(user_ns, dict):
                    candidates.update(k for k in user_ns.keys() if not k.startswith('_'))
                matches = _jsfun_difflib.get_close_matches(missing, list(candidates), n=2, cutoff=0.6)
                title = f'Python does not recognise \`{missing}\`'
                if matches:
                    sug = ' or '.join(f'\`{x}\`' for x in matches)
                    explanation = f'Python could not find anything named \`{missing}\`. Did you mean {sug}?'
                    hint = f'Check your spelling — capital letters matter! If \`{missing}\` is meant to be text, put quotes around it like \`"{missing}"\`.'
                else:
                    explanation = f'You used \`{missing}\`, but Python has not seen it before.'
                    hint = f'Check the spelling (capital letters matter), create it first with \`{missing} = ...\`, or put quotes around it (\`"{missing}"\`) if you meant text.'
        else:
            title = 'Unknown name'
            explanation = 'You used a variable or command name that Python does not recognise.'
            hint = 'Check the spelling and make sure you created the variable before using it.'

    elif isinstance(exc, ZeroDivisionError):
        title = 'Cannot divide by zero'
        explanation = 'Your code tried to divide a number by \`0\`, which is not possible in maths.'
        hint = 'Check the number or variable after \`/\` or \`%\` to make sure it is not \`0\`.'

    elif isinstance(exc, TypeError):
        low = raw_msg.lower()
        if 'can only concatenate str' in low or 'must be str, not' in low or ("unsupported operand type(s) for +:" in low and "'str'" in low):
            title = 'Cannot mix text and numbers with \`+\`'
            explanation = 'You tried to join text (a string) and a number using \`+\`.'
            hint = 'Convert the number with \`str(...)\` like \`"Score: " + str(score)\`, or use a comma inside \`print("Score:", score)\`.'
        elif 'not supported between instances of' in low and "'str'" in low:
            title = 'Cannot compare text with a number'
            explanation = 'You tried to compare text and a number (for example with \`<\` or \`>\`). Remember \`input()\` always gives text!'
            hint = 'Turn the input into a number first using \`int(input(...))\` or \`float(input(...))\`.'
        elif 'object is not iterable' in low and "'int'" in low:
            title = 'Cannot loop over a single number'
            explanation = 'A \`for\` loop needs a sequence like \`range(...)\` or a list, not a single number.'
            hint = 'Wrap the number in \`range(...)\`, like \`for i in range(10):\`.'
        elif 'object is not callable' in low:
            title = 'Not a function'
            explanation = 'Python tried to run something using \`()\`, but it is not a function.'
            hint = 'Check if you accidentally named a variable the same as a command (like \`print = 5\`), or if you forgot \`*\` for multiplication like \`2 * (x + 1)\`.'
        elif 'positional argument' in low:
            title = 'Wrong number of inputs to a function'
            explanation = 'This function received too many or too few values inside its brackets \`()\`.'
            hint = 'Check how many values the function expects inside \`(...)\`.'
        else:
            title = 'Wrong type of data'
            explanation = 'You tried to combine or use two different kinds of data (like text and a number) in a way Python does not allow.'
            hint = 'Check whether your variables are text (\`str\`), whole numbers (\`int\`), or lists.'

    elif isinstance(exc, ValueError):
        low = raw_msg.lower()
        if 'invalid literal for int()' in low or 'could not convert string to float' in low:
            title = 'That text is not a number'
            explanation = 'Python tried to turn text into a number using \`int()\` or \`float()\`, but the text was not a valid number.'
            hint = 'Make sure the input only contains digits (like \`42\`, not \`"forty-two"\` or blank text).'
        elif 'not enough values to unpack' in low or 'too many values to unpack' in low:
            title = 'Mismatch in values'
            explanation = 'The number of variables on the left side of \`=\` did not match the number of values on the right side.'
            hint = 'Check that both sides have the exact same number of items.'
        else:
            title = 'Unexpected value'
            explanation = 'A function got a value of the right type, but the value itself did not make sense here.'
            hint = 'Check the value you passed in on the highlighted line.'

    elif isinstance(exc, IndexError):
        title = 'List position out of range'
        explanation = 'You asked for an item in a list (or text) at a position that does not exist.'
        hint = 'Remember Python starts counting at \`0\`! A list with 3 items has positions \`0\`, \`1\`, and \`2\`.'

    elif isinstance(exc, KeyError):
        title = f'Key {raw_msg} not found'
        explanation = f'Your dictionary does not have a key called {raw_msg}.'
        hint = 'Check the spelling of the key, or use \`.get(...)\` to safely look it up.'

    elif isinstance(exc, AttributeError):
        m = _jsfun_re.search(r"'([^']+)' object has no attribute '([^']+)'", raw_msg)
        if m:
            obj_type, attr = m.group(1), m.group(2)
            title = f'Unknown command \`.{attr}\` for \`{obj_type}\`'
            explanation = f'A \`{obj_type}\` does not have a command called \`.{attr}\`.'
            hint = 'Check the spelling of the command after the dot (for example, lists use \`.append()\` and text uses \`.lower()\`).'
        else:
            title = 'Unknown command after dot'
            explanation = 'Python could not find the command or property you used after \`.\`.'
            hint = 'Double-check the spelling after the dot.'

    elif isinstance(exc, ModuleNotFoundError):
        m = _jsfun_re.search(r"No module named '([^']+)'", raw_msg)
        mod = m.group(1) if m else 'that module'
        title = f'Module \`{mod}\` is not available'
        explanation = f'Python Code Lab could not find a module named \`{mod}\`.'
        hint = 'Check the spelling, or use browser-supported modules like \`random\`, \`math\`, \`turtle\`, \`time\`, \`string\`, \`datetime\`, and \`statistics\`.'

    elif isinstance(exc, RecursionError):
        title = 'Function called itself too many times'
        explanation = 'A function kept calling itself over and over without stopping.'
        hint = 'Make sure your recursive function has a stopping condition (base case) that is always reached.'

    elif isinstance(exc, FileNotFoundError):
        title = 'File not found'
        explanation = 'Python tried to open a file that could not be found.'
        hint = 'Check that the filename is spelled exactly right (including \`.txt\` or \`.csv\`).'

    return {
        'errorType': err_type,
        'rawMessage': raw_msg,
        'cleanTraceback': clean_tb,
        'line': line_no,
        'column': None,
        'endColumn': None,
        'codeLine': code_line,
        'title': title,
        'explanation': explanation,
        'hint': hint,
    }


_jsfun_builtins._jsfun_analyze_error = _jsfun_analyze_error
`;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatInlineCode(text) {
    const escaped = escapeHtml(text);
    return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function extractUserLineNumber(errStr) {
    const userCodeMatches = [...errStr.matchAll(/File\s+"<user_code>",\s+line\s+(\d+)/gi)];
    if (userCodeMatches.length > 0) {
      return parseInt(userCodeMatches[userCodeMatches.length - 1][1], 10);
    }
    const lineMatches = [...errStr.matchAll(/(?:^|\n)\s*Line\s+(\d+)/gi)];
    if (lineMatches.length > 0) {
      return parseInt(lineMatches[lineMatches.length - 1][1], 10);
    }
    return null;
  }

  function stripPyodideTraceback(errStr) {
    const raw = String(errStr || '').trim();
    const idx = raw.indexOf('File "<user_code>"');
    if (idx !== -1) {
      return 'Traceback (your code):\n  ' + raw.slice(idx).replace(/File "<user_code>",\s*/g, '');
    }
    return raw;
  }

  function analyzeFallbackError(err, sourceCode) {
    const errStr = String(err || 'Unknown error');
    const line = extractUserLineNumber(errStr);
    const lines = typeof sourceCode === 'string' ? sourceCode.split('\n') : [];
    const codeLine = line && line >= 1 && line <= lines.length ? lines[line - 1] : '';
    const cleanTraceback = stripPyodideTraceback(errStr);

    let errorType = 'Error';
    const typeMatch = errStr.match(/\b([A-Za-z]+(?:Error|Exception|Interrupt))\b(?=:)/g);
    if (typeMatch && typeMatch.length > 0) {
      errorType = typeMatch[typeMatch.length - 1];
    }

    let title = 'Something went wrong';
    let explanation = 'Python hit a problem while running your code.';
    let hint = 'Check the highlighted line and open "Show Python error" for more details.';

    if (/SyntaxError/.test(errStr)) {
      title = 'Python did not understand this line';
      explanation = 'There is a small typing or punctuation mistake on or just before this line.';
      hint = 'Check for missing quotes `"`, brackets `()`, or colons `:` at the end of `if`, `for`, `while`, or `def` lines.';
    } else if (/IndentationError|TabError/.test(errStr)) {
      title = 'Indentation does not line up';
      explanation = 'Python is strict about the spaces at the start of each line.';
      hint = 'Make sure lines inside `if`, loops, or functions are indented with 4 spaces.';
    } else if (/NameError/.test(errStr)) {
      const m = errStr.match(/name\s+'([^']+)'\s+is\s+not\s+defined/i);
      const name = m ? m[1] : null;
      title = name ? `Python does not recognise \`${name}\`` : 'Unknown name';
      explanation = name
        ? `You used \`${name}\`, but Python has not seen it before.`
        : 'You used a variable or command name that Python does not recognise.';
      hint = 'Check your spelling (capital letters matter!) or create the variable with `=` before using it.';
    } else if (/ZeroDivisionError/.test(errStr)) {
      title = 'Cannot divide by zero';
      explanation = 'Your code tried to divide a number by `0`, which is not possible in maths.';
      hint = 'Check the number or variable after `/` or `%`.';
    } else if (/TypeError/.test(errStr)) {
      title = 'Wrong type of data';
      explanation = 'You tried to combine or compare two different kinds of data (like text and a number).';
      hint = 'Use `str(...)` to turn a number into text, or `int(...)` to turn text into a whole number.';
    } else if (/ValueError/.test(errStr)) {
      title = 'Unexpected value';
      explanation = 'Python could not use that value (for example, turning non-number text into an `int`).';
      hint = 'Check the value or input used on the highlighted line.';
    } else if (/IndexError/.test(errStr)) {
      title = 'List position out of range';
      explanation = 'You asked for an item in a list at a position that does not exist.';
      hint = 'Remember Python starts counting at `0`.';
    } else if (/KeyError/.test(errStr)) {
      title = 'Dictionary key not found';
      explanation = 'That key is not in your dictionary.';
      hint = 'Check the spelling of the key, or use `.get(...)`.';
    } else if (/TimeoutInterrupt|TimeoutException|timed out/i.test(errStr)) {
      title = 'Program stopped — took too long';
      explanation = 'Your program ran for too long and was stopped automatically. You may have an infinite loop.';
      hint = 'Check your `while` loop condition so it can eventually stop.';
    }

    return {
      errorType,
      rawMessage: errStr,
      cleanTraceback,
      line,
      column: null,
      endColumn: null,
      codeLine,
      title,
      explanation,
      hint,
    };
  }

  function buildCodeSnippet(codeLine, line, column, endColumn) {
    if (!codeLine) return null;
    const pre = document.createElement('pre');
    pre.className = 'friendly-error-snippet';

    const prefix = line ? `${line} | ` : '';
    let text = prefix + codeLine;

    if (column && column > 0) {
      const caretOffset = Math.max(0, column - 1);
      const width = endColumn && endColumn > column ? Math.min(endColumn - column, 20) : 1;
      text += '\n' + ' '.repeat(prefix.length + caretOffset) + '^'.repeat(width);
    }

    pre.textContent = text;
    return pre;
  }

  function renderFriendlyCard(info, options) {
    const card = document.createElement('div');
    card.className = 'friendly-error-card';
    card.setAttribute('role', 'alert');

    const header = document.createElement('div');
    header.className = 'friendly-error-header';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'friendly-error-title';
    titleWrap.innerHTML = `<span class="friendly-error-icon" aria-hidden="true">🛠️</span><span>${formatInlineCode(info.title)}</span>`;
    header.appendChild(titleWrap);

    if (info.line) {
      const lineBtn = document.createElement('button');
      lineBtn.type = 'button';
      lineBtn.className = 'friendly-error-line-btn';
      lineBtn.textContent = `Line ${info.line}`;
      lineBtn.title = `Jump to line ${info.line}`;
      lineBtn.addEventListener('click', () => {
        if (options && typeof options.onJumpToLine === 'function') {
          options.onJumpToLine(info.line, info.column || 1);
        }
      });
      header.appendChild(lineBtn);
    }

    card.appendChild(header);

    const explanation = document.createElement('p');
    explanation.className = 'friendly-error-explanation';
    explanation.innerHTML = formatInlineCode(info.explanation);
    card.appendChild(explanation);

    const snippet = buildCodeSnippet(info.codeLine, info.line, info.column, info.endColumn);
    if (snippet) {
      card.appendChild(snippet);
    }

    if (info.hint) {
      const hintBox = document.createElement('div');
      hintBox.className = 'friendly-error-hint';
      hintBox.innerHTML = `<strong>How to fix:</strong> ${formatInlineCode(info.hint)}`;
      card.appendChild(hintBox);
    }

    return card;
  }

  function renderErrorElement(errorInfo, options) {
    const opts = options || {};
    const mode = opts.mode || getErrorDisplayMode();
    const container = document.createElement('div');
    container.className = `error-output-wrapper error-mode-${mode}`;

    if (mode === 'standard') {
      const rawPre = document.createElement('pre');
      rawPre.className = 'standard-error-pre';
      rawPre.textContent = errorInfo.cleanTraceback || errorInfo.rawMessage || 'Unknown error';
      container.appendChild(rawPre);

      const hintDetails = document.createElement('details');
      hintDetails.className = 'friendly-error-details';
      const summary = document.createElement('summary');
      summary.textContent = 'Show friendly hint';
      hintDetails.appendChild(summary);
      hintDetails.appendChild(renderFriendlyCard(errorInfo, opts));
      container.appendChild(hintDetails);
      return container;
    }

    // Default: Friendly-first mode
    const card = renderFriendlyCard(errorInfo, opts);

    if (errorInfo.cleanTraceback || errorInfo.rawMessage) {
      const details = document.createElement('details');
      details.className = 'friendly-error-details';

      const summary = document.createElement('summary');
      summary.textContent = `Show Python error (${errorInfo.errorType || 'Details'})`;
      details.appendChild(summary);

      const rawPre = document.createElement('pre');
      rawPre.className = 'friendly-error-raw-pre';
      rawPre.textContent = errorInfo.cleanTraceback || errorInfo.rawMessage;
      details.appendChild(rawPre);

      card.appendChild(details);
    }

    container.appendChild(card);
    return container;
  }

  const api = {
    PYTHON_ERROR_ANALYZER_CODE,
    getErrorDisplayMode,
    extractUserLineNumber,
    stripPyodideTraceback,
    analyzeFallbackError,
    formatInlineCode,
    renderErrorElement,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PythonCopyErrors = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
