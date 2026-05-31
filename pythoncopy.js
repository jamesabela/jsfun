    let currentURL = '';
    let executionCancelled = false;
    let hasUnsavedChanges = false;
    let inputResolver = null;
    let pyodideReadyPromise = null;
    let pyodideInstance = null;
    let currentAppMode = 'edit';

    let displayTraceLog = [];
    let displayInputHistory = [];
    let displayTraceStatus = 'ready'; // ready, tracing, waiting_input, finished, error
    let displayPendingPrompt = '';
    let displayFinalOutput = '';
    let displayCurrentStep = 0;
    let displayTimeout = null;
    let btnPlayStatus = 'idle';
    let isTracing = false;
    let isAwaitingDisplayInput = false;
    let copyButtonTimeout = null;

    // --- Turtle Graphics JS State & Bridge ---
    let turtleCommands = [];
    let turtleX = 0;
    let turtleY = 0;
    let turtleHeading = 0;
    let turtleVisible = true;
    let turtleBgColor = '#ffffff';

    window.addTurtleLine = function (x1, y1, x2, y2, color, width) {
      turtleCommands.push({ type: 'line', x1, y1, x2, y2, color, width });
      drawEverything();
    };

    window.addTurtleFill = function (pathJson, color) {
      try {
        const path = JSON.parse(pathJson);
        turtleCommands.push({ type: 'fill', path, color });
        drawEverything();
      } catch (e) {
        console.error('Error parsing fill path:', e);
      }
    };

    window.addTurtleWrite = function (text, x, y, color, align, font) {
      turtleCommands.push({ type: 'write', text, x, y, color, align, font });
      drawEverything();
    };

    window.addTurtleDot = function (x, y, radius, color) {
      turtleCommands.push({ type: 'dot', x, y, radius, color });
      drawEverything();
    };

    window.updateTurtleState = function (x, y, heading, visible) {
      turtleX = x;
      turtleY = y;
      turtleHeading = heading;
      turtleVisible = visible;
      drawEverything();
    };

    window.clearTurtleCanvas = function () {
      turtleCommands = [];
      drawEverything();
    };

    window.setTurtleBgColor = function (color) {
      turtleBgColor = color;
      drawEverything();
    };

    window.setupTurtleCanvas = function (width, height) {
      const canvas = document.getElementById('turtleCanvas');
      if (canvas) {
        canvas.width = width || 400;
        canvas.height = height || 400;
        drawEverything();
      }
    };

    let turtleShape = 'classic'; // classic, turtle, circle, square, triangle

    window.setTurtleShape = function (shapeName) {
      turtleShape = shapeName || 'classic';
      drawEverything();
    };

    window.getTurtleShape = function () {
      return turtleShape;
    };

    window.resetTurtleCanvas = function () {
      turtleCommands = [];
      turtleX = 0;
      turtleY = 0;
      turtleHeading = 0;
      turtleVisible = true;
      turtleBgColor = '#ffffff';
      turtleShape = 'classic';
      drawEverything();
    };

    window.getTurtleSnapshot = function () {
      return JSON.stringify({
        commands: turtleCommands,
        x: turtleX,
        y: turtleY,
        heading: turtleHeading,
        visible: turtleVisible,
        bgColor: turtleBgColor,
        shape: turtleShape
      });
    };

    window.downloadCanvasImage = function () {
      const canvas = document.getElementById('turtleCanvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'turtle_drawing.png';
      link.href = canvas.toDataURL();
      link.click();
    };

    function drawEverything() {
      const canvas = document.getElementById('turtleCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Clear and fill background
      ctx.fillStyle = turtleBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Coordinate translators
      function tx(x) { return cx + x; }
      function ty(y) { return cy - y; } // mathematical Y goes up, canvas Y goes down

      // Draw all commands
      for (const cmd of turtleCommands) {
        if (cmd.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(tx(cmd.x1), ty(cmd.y1));
          ctx.lineTo(tx(cmd.x2), ty(cmd.y2));
          ctx.strokeStyle = cmd.color;
          ctx.lineWidth = cmd.width;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (cmd.type === 'fill') {
          ctx.beginPath();
          const path = cmd.path;
          if (path.length > 0) {
            ctx.moveTo(tx(path[0][0]), ty(path[0][1]));
            for (let i = 1; i < path.length; i++) {
              ctx.lineTo(tx(path[i][0]), ty(path[i][1]));
            }
            ctx.closePath();
            ctx.fillStyle = cmd.color;
            ctx.fill();
          }
        } else if (cmd.type === 'write') {
          ctx.fillStyle = cmd.color;
          ctx.font = cmd.font;
          ctx.textAlign = cmd.align === 'left' ? 'left' : (cmd.align === 'right' ? 'right' : 'center');
          ctx.fillText(cmd.text, tx(cmd.x), ty(cmd.y));
        } else if (cmd.type === 'dot') {
          ctx.beginPath();
          ctx.arc(tx(cmd.x), ty(cmd.y), cmd.radius, 0, 2 * Math.PI);
          ctx.fillStyle = cmd.color;
          ctx.fill();
        }
      }

      // Draw turtle cursor
      if (turtleVisible) {
        if (turtleShape === 'turtle') {
          ctx.save();
          ctx.translate(tx(turtleX), ty(turtleY));
          ctx.rotate(-turtleHeading * Math.PI / 180);

          // Draw legs
          ctx.fillStyle = '#34d399';
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 1;

          // Front-left leg
          ctx.beginPath();
          ctx.ellipse(5, -5, 3, 1.5, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill(); ctx.stroke();

          // Front-right leg
          ctx.beginPath();
          ctx.ellipse(5, 5, 3, 1.5, -Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill(); ctx.stroke();

          // Back-left leg
          ctx.beginPath();
          ctx.ellipse(-4, -4, 2.5, 1.2, -Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill(); ctx.stroke();

          // Back-right leg
          ctx.beginPath();
          ctx.ellipse(-4, 4, 2.5, 1.2, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill(); ctx.stroke();

          // Tail
          ctx.beginPath();
          ctx.moveTo(-7, 0);
          ctx.lineTo(-10, 0);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Shell/body
          ctx.beginPath();
          ctx.ellipse(0, 0, 7, 5, 0, 0, 2 * Math.PI);
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 1;
          ctx.fill(); ctx.stroke();

          // Head
          ctx.beginPath();
          ctx.arc(9, 0, 2.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#34d399';
          ctx.fill(); ctx.stroke();

          ctx.restore();
        } else if (turtleShape === 'circle') {
          ctx.save();
          ctx.translate(tx(turtleX), ty(turtleY));
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        } else if (turtleShape === 'square') {
          ctx.save();
          ctx.translate(tx(turtleX), ty(turtleY));
          ctx.rotate(-turtleHeading * Math.PI / 180);
          ctx.beginPath();
          ctx.rect(-5, -5, 10, 10);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        } else if (turtleShape === 'triangle') {
          ctx.save();
          ctx.translate(tx(turtleX), ty(turtleY));
          ctx.rotate(-turtleHeading * Math.PI / 180);
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(-6, -6);
          ctx.lineTo(-6, 6);
          ctx.closePath();
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        } else { // classic or arrow
          ctx.save();
          ctx.translate(tx(turtleX), ty(turtleY));
          ctx.rotate(-turtleHeading * Math.PI / 180);
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(-6, -6);
          ctx.lineTo(-3, 0);
          ctx.lineTo(-6, 6);
          ctx.closePath();
          ctx.fillStyle = '#ec4899'; // nice modern pink/magenta color
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    const turtleShimPythonCode = `
import js
import json
import math

class Turtle:
    def __init__(self):
        self._x = 0.0
        self._y = 0.0
        self._heading = 0.0
        self._is_down = True
        self._pencolor = "black"
        self._fillcolor = "black"
        self._width = 1.0
        self._visible = True
        self._is_filling = False
        self._fill_path = []
        self._update_js_state()

    def _update_js_state(self):
        js.updateTurtleState(self._x, self._y, self._heading, self._visible)

    def forward(self, distance):
        rad = math.radians(self._heading)
        new_x = self._x + distance * math.cos(rad)
        new_y = self._y + distance * math.sin(rad)
        if self._is_down:
            js.addTurtleLine(self._x, self._y, new_x, new_y, self._pencolor, self._width)
        self._x = new_x
        self._y = new_y
        if self._is_filling:
            self._fill_path.append((self._x, self._y))
        self._update_js_state()
    fd = forward

    def backward(self, distance):
        self.forward(-distance)
    bk = backward
    back = backward

    def right(self, angle):
        self._heading = (self._heading - angle) % 360
        self._update_js_state()
    rt = right

    def left(self, angle):
        self._heading = (self._heading + angle) % 360
        self._update_js_state()
    lt = left

    def penup(self):
        self._is_down = False
    pu = penup
    up = penup

    def pendown(self):
        self._is_down = True
    pd = pendown
    down = pendown

    def isdown(self):
        return self._is_down

    def goto(self, x, y=None):
        if y is None:
            if isinstance(x, (tuple, list)):
                target_x, target_y = x[0], x[1]
            else:
                target_x, target_y = x.xcor(), x.ycor()
        else:
            target_x, target_y = x, y
            
        if self._is_down:
            js.addTurtleLine(self._x, self._y, target_x, target_y, self._pencolor, self._width)
        self._x = target_x
        self._y = target_y
        if self._is_filling:
            self._fill_path.append((self._x, self._y))
        self._update_js_state()
    setpos = goto
    setposition = goto

    def setheading(self, to_angle):
        self._heading = to_angle % 360
        self._update_js_state()
    seth = setheading

    def home(self):
        self.goto(0.0, 0.0)
        self.setheading(0.0)

    def xcor(self):
        return self._x

    def ycor(self):
        return self._y

    def pos(self):
        return (self._x, self._y)
    position = pos

    def heading(self):
        return self._heading

    def pencolor(self, color=None):
        if color is None:
            return self._pencolor
        self._pencolor = color

    def fillcolor(self, color=None):
        if color is None:
            return self._fillcolor
        self._fillcolor = color

    def color(self, color1=None, color2=None):
        if color1 is None:
            return (self._pencolor, self._fillcolor)
        if color2 is None:
            self._pencolor = color1
            self._fillcolor = color1
        else:
            self._pencolor = color1
            self._fillcolor = color2

    def pensize(self, width=None):
        if width is None:
            return self._width
        self._width = float(width)
    width = pensize

    def hideturtle(self):
        self._visible = False
        self._update_js_state()
    ht = hideturtle

    def showturtle(self):
        self._visible = True
        self._update_js_state()
    st = showturtle

    def isvisible(self):
        return self._visible

    def begin_fill(self):
        self._is_filling = True
        self._fill_path = [(self._x, self._y)]

    def end_fill(self):
        if self._is_filling:
            self._is_filling = False
            if len(self._fill_path) > 2:
                js.addTurtleFill(json.dumps(self._fill_path), self._fillcolor)
            self._update_js_state()

    def circle(self, radius, extent=None, steps=None):
        if extent is None:
            extent = 360.0
        if steps is None:
            steps = int(min(abs(radius) * 2 + 10, 120))
            steps = max(steps, 24)
            
        start_heading_rad = math.radians(self._heading)
        dir_factor = 1.0 if radius >= 0 else -1.0
        center_angle_rad = start_heading_rad + dir_factor * (math.pi / 2.0)
        
        abs_r = abs(radius)
        cx = self._x - abs_r * math.cos(center_angle_rad)
        cy = self._y - abs_r * math.sin(center_angle_rad)
        
        start_angle = center_angle_rad + math.pi
        total_rot = math.radians(extent)
        
        for i in range(1, steps + 1):
            t = float(i) / steps
            current_rot = dir_factor * total_rot * t
            angle = start_angle + current_rot
            
            next_x = cx + abs_r * math.cos(angle)
            next_y = cy + abs_r * math.sin(angle)
            self.goto(next_x, next_y)
            
        self.setheading(self._heading + dir_factor * extent)

    def write(self, arg, move=False, align="left", font=("Arial", 8, "normal")):
        font_str = f"{font[2]} {font[1]}pt {font[0]}" if len(font) >= 3 else f"{font[1]}pt {font[0]}"
        js.addTurtleWrite(str(arg), self._x, self._y, self._pencolor, align, font_str)

    def dot(self, size=None, *color):
        if size is not None and not isinstance(size, (int, float)):
            color = (size,) + color
            size = None

        if size is None:
            dot_size = max(self._width + 4, self._width * 2)
        else:
            dot_size = float(size)

        dot_color = self._pencolor
        if len(color) > 0:
            if len(color) == 1:
                c = color[0]
                if isinstance(c, (list, tuple)) and len(c) == 3:
                    r = int(c[0]*255) if isinstance(c[0], float) and c[0] <= 1.0 else int(c[0])
                    g = int(c[1]*255) if isinstance(c[1], float) and c[1] <= 1.0 else int(c[1])
                    b = int(c[2]*255) if isinstance(c[2], float) and c[2] <= 1.0 else int(c[2])
                    dot_color = f"rgb({r},{g},{b})"
                else:
                    dot_color = str(c)
            elif len(color) == 3:
                r = int(color[0]*255) if isinstance(color[0], float) and color[0] <= 1.0 else int(color[0])
                g = int(color[1]*255) if isinstance(color[1], float) and color[1] <= 1.0 else int(color[1])
                b = int(color[2]*255) if isinstance(color[2], float) and color[2] <= 1.0 else int(color[2])
                dot_color = f"rgb({r},{g},{b})"
            else:
                dot_color = str(color[0])

        if isinstance(dot_color, (list, tuple)) and len(dot_color) == 3:
            r = int(dot_color[0]*255) if isinstance(dot_color[0], float) and dot_color[0] <= 1.0 else int(dot_color[0])
            g = int(dot_color[1]*255) if isinstance(dot_color[1], float) and dot_color[1] <= 1.0 else int(dot_color[1])
            b = int(dot_color[2]*255) if isinstance(dot_color[2], float) and dot_color[2] <= 1.0 else int(dot_color[2])
            dot_color = f"rgb({r},{g},{b})"
        else:
            dot_color = str(dot_color)

        js.addTurtleDot(self._x, self._y, dot_size / 2.0, dot_color)
        self._update_js_state()

    def speed(self, speed=None):
        return 0

    def shape(self, name=None):
        if name is None:
            return js.getTurtleShape()
        js.setTurtleShape(name)

    def clear(self):
        js.clearTurtleCanvas()

    def reset(self):
        self.home()
        self.clear()
        self.pendown()
        self.showturtle()
        self._pencolor = "black"
        self._fillcolor = "black"
        self._width = 1.0

_default_turtle = Turtle()

class Screen:
    def bgcolor(self, color):
        js.setTurtleBgColor(color)
    def setup(self, width=None, height=None, *args, **kwargs):
        js.setupTurtleCanvas(width, height)
    def title(self, titletext):
        pass
    def clear(self):
        js.clearTurtleCanvas()
    def reset(self):
        js.resetTurtleCanvas()
    def done(self):
        pass
    def mainloop(self):
        pass
    def exitonclick(self):
        pass

_default_screen = Screen()

def Screen():
    return _default_screen

def forward(distance): _default_turtle.forward(distance)
fd = forward
def backward(distance): _default_turtle.backward(distance)
bk = backward
back = backward
def right(angle): _default_turtle.right(angle)
rt = right
def left(angle): _default_turtle.left(angle)
lt = left
def penup(): _default_turtle.penup()
pu = penup
up = penup
def pendown(): _default_turtle.pendown()
pd = pendown
down = pendown
def isdown(): return _default_turtle.isdown()
def goto(x, y=None): _default_turtle.goto(x, y)
setpos = goto
setposition = goto
def setheading(to_angle): _default_turtle.setheading(to_angle)
seth = setheading
def home(): _default_turtle.home()
def xcor(): return _default_turtle.xcor()
def ycor(): return _default_turtle.ycor()
def pos(): return _default_turtle.pos()
position = pos
def heading(): return _default_turtle.heading()
def pencolor(color=None): return _default_turtle.pencolor(color)
def fillcolor(color=None): return _default_turtle.fillcolor(color)
def color(color1=None, color2=None): return _default_turtle.color(color1, color2)
def pensize(width=None): return _default_turtle.pensize(width)
width = pensize
def hideturtle(): _default_turtle.hideturtle()
ht = hideturtle
def showturtle(): _default_turtle.showturtle()
st = showturtle
def isvisible(): return _default_turtle.isvisible()
def begin_fill(): _default_turtle.begin_fill()
def end_fill(): _default_turtle.end_fill()
def circle(radius, extent=None, steps=None): _default_turtle.circle(radius, extent, steps)
def write(arg, move=False, align="left", font=("Arial", 8, "normal")): _default_turtle.write(arg, move, align, font)
def dot(size=None, *color): _default_turtle.dot(size, *color)
def speed(speed=None): return _default_turtle.speed(speed)
def shape(name=None): return _default_turtle.shape(name)
def clear(): _default_turtle.clear()
def reset(): _default_turtle.reset()
def bgcolor(color): _default_screen.bgcolor(color)
def setup(width=None, height=None, *args, **kwargs): _default_screen.setup(width, height, *args, **kwargs)
def title(titletext): pass
def done(): pass
mainloop = done
exitonclick = done
`;



    // Global Error Handler for debugging
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      console.error('Window Error:', msg, lineNo, columnNo, error);
      // Only show alert for real script errors
      if (msg.toLowerCase().indexOf('script error') === -1) {
        setRunnerStatus('JS Error: ' + msg + ' (Line ' + lineNo + ')');
      }
      return false;
    };


    // Pyodide initialization
    if (typeof loadPyodide !== "undefined") {
      pyodideReadyPromise = loadPyodide({
        stdout: (text) => {
          if (currentAppMode !== 'display') {
            outputEl.textContent += text + '\n';
          }
        },
        stderr: (text) => {
          if (currentAppMode !== 'display') {
            outputEl.textContent += text + '\n';
          }
        }
      }).then(p => {

        pyodideInstance = p;
        p.runPython(`
import sys, builtins
# Initialization complete
        `);

        // Write custom virtual turtle module to VFS
        p.FS.writeFile('/home/pyodide/turtle.py', turtleShimPythonCode);

        return p;
      });
    }

    const editor = document.getElementById('editor');
    const lineNumbers = document.getElementById('lineNumbers');
    const outputEl = document.getElementById('output');
    const runnerMessage = document.getElementById('runnerMessage');
    const runnerStatus = document.getElementById('runnerStatus');
    const detectionLabel = document.getElementById('detectionLabel');
    const runnerLayout = document.getElementById('runnerLayout');
    const runnerToggle = document.getElementById('runnerToggle');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const openNewTabButton = document.getElementById('openNewTabButton');

    const btnEditMode = document.getElementById('btnEditMode');
    const btnDisplayMode = document.getElementById('btnDisplayMode');
    const btnTurtleMode = document.getElementById('btnTurtleMode');
    const teacherControlsRow = document.getElementById('teacherControlsRow');
    const teachControlsRow = document.getElementById('teachControlsRow');

    const callTracePanel = document.getElementById('callTracePanel');
    const callTraceList = document.getElementById('callTraceList');
    const variablePanel = document.getElementById('variablePanel');
    const variableList = document.getElementById('variableList');
    const highlightLayer = document.getElementById('highlightLayer');
    const editorBg = document.getElementById('editorBg');
    const displayEditor = document.getElementById('displayEditor');
    const displayCode = document.getElementById('displayCode');

    function setAppMode(mode) {
      currentAppMode = mode;
      btnEditMode.classList.toggle('active', mode === 'edit');
      btnDisplayMode.classList.toggle('active', mode === 'display');
      btnTurtleMode.classList.toggle('active', mode === 'turtle');
      updateAppMode();
    }

    function updateAppMode() {
      // Hide all badges first
      const editBadge = document.querySelector('.edit-badge');
      const displayBadge = document.querySelector('.display-badge');
      const turtleBadge = document.querySelector('.turtle-badge');
      if (editBadge) editBadge.style.display = 'none';
      if (displayBadge) displayBadge.style.display = 'none';
      if (turtleBadge) turtleBadge.style.display = 'none';

      const turtleContainer = document.getElementById('turtleCanvasContainer');

      if (currentAppMode === 'display') {
        document.body.classList.add('display-mode-active');
        document.body.classList.remove('turtle-mode-active');
        if (displayBadge) displayBadge.style.display = 'inline-block';

        editor.style.display = 'none';
        displayEditor.style.display = 'block';

        displayCode.textContent = editor.value;
        Prism.highlightElement(displayCode);

        teacherControlsRow.style.display = 'none';
        teachControlsRow.style.display = 'flex';
        callTracePanel.style.display = 'block';
        variablePanel.style.display = 'block';

        // Show turtle canvas in display mode if turtle is imported
        const imports = extractImports(editor.value);
        if (imports.includes('turtle')) {
          if (turtleContainer) turtleContainer.style.display = 'flex';
        } else {
          if (turtleContainer) turtleContainer.style.display = 'none';
        }

        clearRunner();
        setRunnerStatus('Display Mode Ready. Click Play to trace code.');
      } else if (currentAppMode === 'turtle') {
        document.body.classList.remove('display-mode-active');
        document.body.classList.add('turtle-mode-active');
        if (turtleBadge) turtleBadge.style.display = 'inline-block';

        editor.style.display = 'block';
        displayEditor.style.display = 'none';

        teacherControlsRow.style.display = 'flex';
        teachControlsRow.style.display = 'none';
        callTracePanel.style.display = 'none';
        variablePanel.style.display = 'none';

        if (turtleContainer) {
          turtleContainer.style.display = 'flex';
          setupTurtleCanvas(400, 400);
        }

        clearTeachHighlight();
        clearRunner();
        setRunnerStatus('Turtle Mode Ready. Write turtle code and click Run.');
      } else {
        document.body.classList.remove('display-mode-active');
        document.body.classList.remove('turtle-mode-active');
        if (editBadge) editBadge.style.display = 'inline-block';

        editor.style.display = 'block';
        displayEditor.style.display = 'none';

        teacherControlsRow.style.display = 'flex';
        teachControlsRow.style.display = 'none';
        callTracePanel.style.display = 'none';
        variablePanel.style.display = 'none';

        if (turtleContainer) turtleContainer.style.display = 'none';

        clearTeachHighlight();
        clearRunner();
        setRunnerStatus('Edit Mode Ready.');
      }
      applyTheme();
    }

    function applyTheme() {
      const isDark = document.getElementById('dark-mode').checked;
      document.documentElement.classList.toggle('dark-theme', isDark);
      document.body.classList.toggle('dark-theme', isDark);
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      editorBg.style.backgroundColor = '';
      editorBg.style.background = '';
      editor.style.backgroundColor = '';
      editor.style.color = '';
      lineNumbers.style.backgroundColor = '';
      lineNumbers.style.color = '';
      document.getElementById('prism-theme').href = isDark
        ? 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';

      const turtleContainer = document.getElementById('turtleCanvasContainer');
      const turtleHeader = document.getElementById('turtleHeader');
      const turtleCanvasWrapper = document.getElementById('turtleCanvasWrapper');
      if (turtleContainer && turtleHeader && turtleCanvasWrapper) {
        if (isDark) {
          turtleContainer.style.borderColor = '#3f3f46';
          turtleContainer.style.background = '#202020';
          turtleHeader.style.background = '#2a2a2a';
          turtleHeader.style.color = '#f4f4f5';
          turtleHeader.style.borderColor = '#3f3f46';
          turtleCanvasWrapper.style.background = '#151515';
        } else {
          turtleContainer.style.borderColor = '#cbd5e1';
          turtleContainer.style.background = '#ffffff';
          turtleHeader.style.background = '#f1f5f9';
          turtleHeader.style.color = '#1e293b';
          turtleHeader.style.borderColor = '#cbd5e1';
          turtleCanvasWrapper.style.background = '#f8fafc';
        }
      }

      if (currentAppMode === 'display') {
        Prism.highlightElement(displayCode);
      }
    }


    function showStartScreen() {
      document.getElementById('inputContainer').style.display = 'flex';
      document.getElementById('starterPanel').style.display = 'block';
      document.getElementById('instructionsPanel').style.display = 'block';
      document.getElementById('workspace').style.display = 'none';
      window.history.pushState({}, '', window.location.pathname);
    }

    let currentInstructionSlide = 0;
    let totalInstructionSlides = 0;

    function updateInstructionCarousel() {
      const track = document.getElementById('carouselTrack');
      if (track) {
        track.style.transform = `translateX(-${currentInstructionSlide * 100}%)`;
      }

      const dots = document.querySelectorAll('#carouselDots .dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentInstructionSlide);
      });
    }

    function prevInstructionSlide() {
      if (currentInstructionSlide > 0) {
        currentInstructionSlide--;
        updateInstructionCarousel();
      }
    }

    function nextInstructionSlide() {
      if (currentInstructionSlide < totalInstructionSlides - 1) {
        currentInstructionSlide++;
        updateInstructionCarousel();
      }
    }

    function goToInstructionSlide(index) {
      currentInstructionSlide = index;
      updateInstructionCarousel();
    }

    document.addEventListener('DOMContentLoaded', () => {
      // Fetch and build instruction carousel dynamically
      fetch('pythoncopycarousel.html')
        .then(response => response.text())
        .then(html => {
          const track = document.getElementById('carouselTrack');
          if (track) {
            track.innerHTML = html;
            const slides = track.querySelectorAll('.carousel-slide');
            totalInstructionSlides = slides.length;
            
            const dotsContainer = document.getElementById('carouselDots');
            if (dotsContainer) {
              dotsContainer.innerHTML = '';
              for (let i = 0; i < totalInstructionSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.onclick = () => goToInstructionSlide(i);
                dotsContainer.appendChild(dot);
              }
            }
            updateInstructionCarousel();
          }
        })
        .catch(err => console.error('Error loading instruction carousel:', err));

      const urlParams = new URLSearchParams(window.location.search);
      const url = urlParams.get('url');

      if (url) {
        document.getElementById('urlInput').value = url;
        document.getElementById('inputContainer').style.display = 'none';
        document.getElementById('starterPanel').style.display = 'none';
        document.getElementById('instructionsPanel').style.display = 'none';
        fetchCode(url);
      } else if (urlParams.has('blank')) {
        startBlankFile();
      }

      document.querySelectorAll('.starter-button').forEach(button => {
        button.addEventListener('click', function () {
          if (button.dataset.action === 'blank') {
            startBlankFile();
            return;
          }

          const starterUrl = button.dataset.url;
          document.getElementById('urlInput').value = starterUrl;
          document.getElementById('inputContainer').style.display = 'none';
          document.getElementById('starterPanel').style.display = 'none';
          document.getElementById('instructionsPanel').style.display = 'none';
          const newURL = `${window.location.pathname}?url=${encodeURIComponent(starterUrl)}`;
          window.history.pushState({}, '', newURL);
          fetchCode(starterUrl);
        });
      });

      document.getElementById('light-mode').addEventListener('change', function () {
        applyTheme();
      });

      document.getElementById('dark-mode').addEventListener('change', function () {
        applyTheme();
      });



      document.getElementById('font-size').addEventListener('input', function () {
        applyCodeFontSize(this.value);
      });

      document.getElementById('copyButton').addEventListener('click', async function () {
        const code = editor.value;
        try {
          await copyTextToClipboard(code);
          showCopyButtonCopied();
          setRunnerStatus('Code copied to clipboard.');
        } catch (err) {
          setRunnerStatus('Copy failed. Select the code and copy manually.');
          alert('Copy failed. Please select the code and copy manually.');
        }
      });

      document.getElementById('blankFileButton').addEventListener('click', startBlankFile);

      document.getElementById('copyForDocsButton').addEventListener('click', copyForDocs);

      document.getElementById('uploadPyButton').addEventListener('click', function () {
        document.getElementById('uploadPyInput').click();
      });

      document.getElementById('uploadPyInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
          editor.value = event.target.result;
          hasUnsavedChanges = false;
          updateLineNumbers();
          analyseCodeAndUpdateMessage();
          clearRunner();
          setRunnerStatus('File loaded successfully.');
        };
        reader.readAsText(file);
        e.target.value = '';
      });

      document.getElementById('downloadPyButton').addEventListener('click', function () {
        hasUnsavedChanges = false;
        downloadText(editor.value, 'code.py', 'text/x-python');
      });

      document.getElementById('downloadTxtButton').addEventListener('click', function () {
        hasUnsavedChanges = false;
        downloadText(editor.value, 'code.txt', 'text/plain');
      });

      fullscreenButton.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
        } else {
          document.exitFullscreen();
        }
      });

      openNewTabButton.addEventListener('click', function () {
        window.open(window.location.href, '_blank', 'noopener');
      });

      document.getElementById('makePuzzleButton').addEventListener('click', function () {
        if (currentURL) {
          const puzzleURL = `https://jamesabela.github.io/jsfun/reorder.html?url=${encodeURIComponent(currentURL)}`;
          window.open(puzzleURL, '_blank');
        } else {
          alert('No valid URL available to create a puzzle.');
        }
      });

      // Teacher Mode binds
      document.getElementById('runButton').addEventListener('click', runCurrentCode);
      const quizBtn = document.getElementById('quizButton');
      if (quizBtn) {
        quizBtn.addEventListener('click', runQuizTests);
      }
      const creativeNextBtn = document.getElementById('creativeNextButton');
      if (creativeNextBtn) {
        creativeNextBtn.addEventListener('click', () => {
          const code = editor.value;
          const parsed = parseQuizTests(code);
          if (parsed.nextUrl) {
            window.location.href = window.location.pathname + '?url=' + encodeURIComponent(parsed.nextUrl);
          }
        });
      }
      const creativeEndBtn = document.getElementById('creativeEndButton');
      if (creativeEndBtn) {
        creativeEndBtn.addEventListener('click', () => {
          const code = editor.value;
          const parsed = parseQuizTests(code);
          if (parsed.isEnd) {
            renderQuizResults([], 0, 0, null, true, parsed.courseTitle);
            const runnerLayout = document.getElementById('runnerLayout');
            if (runnerLayout && runnerLayout.classList.contains('collapsed')) {
              toggleRunner();
            }
          }
        });
      }
      document.getElementById('consoleSubmitButton').addEventListener('click', submitConsoleInput);


      // Display Mode binds
      document.getElementById('playPauseButton').addEventListener('click', displayPlayPause);
      document.getElementById('stepBackButton').addEventListener('click', displayStepBack);
      document.getElementById('stepButton').addEventListener('click', displayStep);
      document.getElementById('resetButton').addEventListener('click', displayReset);

      document.getElementById('consoleInputField').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitConsoleInput();
        }
      });

      editor.addEventListener('input', () => {
        hasUnsavedChanges = true;
        updateLineNumbers();
        analyseCodeAndUpdateMessage(true);
      });

      editor.addEventListener('scroll', syncLineNumberScroll);
      displayEditor.addEventListener('scroll', syncLineNumberScroll);
      runnerToggle.addEventListener('click', toggleRunner);
      window.addEventListener('resize', () => updateRunnerToggleLabel());

      document.getElementById('toggleGlobalPreviewBtn').addEventListener('click', () => {
        const container = document.getElementById('webPreviewContainer');
        const isCurrentlyOpen = container.style.display === 'block';
        if (isCurrentlyOpen) {
          closeWebPreview();
        } else {
          const code = editor.value;
          const links = extractLinksFromCode(code);
          if (links.length > 0) {
            const iframe = document.getElementById('webPreviewIframe');
            const lastUrl = iframe.dataset.lastUrl || links[0].url;
            previewWebLink(lastUrl);
          }
        }
      });
      document.getElementById('openNewTabFromPreview').addEventListener('click', () => {
        const iframe = document.getElementById('webPreviewIframe');
        if (iframe && iframe.src) {
          window.open(iframe.src, '_blank');
        }
      });
      editor.addEventListener('focus', () => {
        if (currentAppMode === 'edit') {
          const highlightLayer = document.getElementById('highlightLayer');
          if (highlightLayer) highlightLayer.innerHTML = '';
        }
      });

      updateFullscreenAvailability();
      updateLineNumbers();
      applyCodeFontSize(document.getElementById('font-size').value);
      updateRunnerToggleLabel();
      updateAppMode();

      window.addEventListener('beforeunload', function (e) {
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    });

    function updateFullscreenAvailability() {
      const isEmbedded = window.self !== window.top;
      openNewTabButton.style.display = isEmbedded ? 'inline-block' : 'none';
      if (document.fullscreenEnabled) return;
      fullscreenButton.style.display = 'none';
    }

    function applyCodeFontSize(sizeValue) {
      const fontSize = Number(sizeValue) || 16;
      const lineHeight = Math.round(fontSize * 1.5);

      editor.style.fontSize = fontSize + 'px';
      editor.style.lineHeight = lineHeight + 'px';
      displayEditor.style.fontSize = fontSize + 'px';
      displayEditor.style.lineHeight = lineHeight + 'px';
      displayCode.style.fontSize = 'inherit';
      displayCode.style.lineHeight = 'inherit';
      lineNumbers.style.fontSize = fontSize + 'px';
      lineNumbers.style.lineHeight = lineHeight + 'px';
      updateLineNumbers();
    }

    function getCodeLineHeight() {
      const activeView = currentAppMode === 'display' ? displayEditor : editor;
      const parsed = parseFloat(window.getComputedStyle(activeView).lineHeight);
      return Number.isFinite(parsed) ? parsed : 24;
    }

    function updateLineNumbers() {
      const lines = Math.max(1, editor.value.split('\n').length);
      let nums = '';
      for (let i = 1; i <= lines; i++) {
        nums += i + (i < lines ? '\n' : '');
      }
      lineNumbers.textContent = nums;
      syncLineNumberScroll();
    }

    function syncLineNumberScroll(event) {
      if (event && event.target) {
        const target = event.target;
        if (target === editor) displayEditor.scrollTop = editor.scrollTop;
        else if (target === displayEditor) editor.scrollTop = displayEditor.scrollTop;
      }
      const scrollTop = currentAppMode === 'display' ? displayEditor.scrollTop : editor.scrollTop;
      lineNumbers.scrollTop = scrollTop;
      highlightLayer.style.top = (14 - scrollTop) + 'px';
    }

    function toggleRunner() {
      const collapsed = runnerLayout.classList.toggle('collapsed');
      document.getElementById('workspace').classList.toggle('runner-collapsed', collapsed);
      updateRunnerToggleLabel(collapsed);
      runnerToggle.title = collapsed ? 'Show run window' : 'Hide run window';
    }

    function updateRunnerToggleLabel(collapsed = runnerLayout.classList.contains('collapsed')) {
      const isStacked = window.matchMedia('(max-width: 1200px)').matches;
      runnerToggle.textContent = isStacked
        ? (collapsed ? '▼' : '▲')
        : (collapsed ? '▶' : '◀');
    }

    function downloadText(text, filename, mimeType) {
      const blob = new Blob([text], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    async function copyForDocs() {
      const code = editor.value;
      const isDarkMode = document.body.classList.contains('dark-theme');

      // Define theme colors for the pasted document
      const theme = isDarkMode ? {
        bg: '#1e1e1e',
        text: '#d4d4d4',
        gutterBg: '#2d2d2d',
        gutterText: '#858585',
        comment: '#6a9955',
        keyword: '#569cd6',
        string: '#ce9178',
        function: '#dcdcaa',
        number: '#b5cea8',
        operator: '#d4d4d4'
      } : {
        bg: '#ffffff',
        text: '#333333',
        gutterBg: '#f0f0f0',
        gutterText: '#999999',
        comment: '#008000',
        keyword: '#0000ff',
        string: '#a31515',
        function: '#795e26',
        number: '#098658',
        operator: '#333333'
      };

      const lines = code.split('\n');
      // Remove width: 100% to prevent "squeezing" in Google Docs
      let tableHtml = `<div style="background-color: ${theme.bg}; padding: 15px; border-radius: 10px; border: 1px solid #ccc; display: inline-block; min-width: 100%;">`;
      tableHtml += `<table cellspacing="0" cellpadding="0" style="border-collapse: collapse; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 11pt; background: ${theme.bg}; color: ${theme.text};">`;

      for (let i = 0; i < lines.length; i++) {
        const lineNum = i + 1;
        const lineCode = lines[i] || ' ';

        let highlighted = lineCode;
        try {
          highlighted = Prism.highlight(lineCode, Prism.languages.python || Prism.languages.javascript, 'python');
        } catch (e) {
          highlighted = lineCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        const styledCode = highlighted
          .replace(/class="token comment"/g, `style="color: ${theme.comment}; font-style: italic;"`)
          .replace(/class="token keyword"/g, `style="color: ${theme.keyword}; font-weight: bold;"`)
          .replace(/class="token string"/g, `style="color: ${theme.string};"`)
          .replace(/class="token function"/g, `style="color: ${theme.function};"`)
          .replace(/class="token number"/g, `style="color: ${theme.number};"`)
          .replace(/class="token (punctuation|operator)"/g, `style="color: ${theme.operator};"`);

        // Using inline styles with zero margin/padding to prevent Word from adding massive paragraph spacing
        // and avoiding literal newlines in the HTML string which Word interprets as empty paragraphs.
        tableHtml += `<tr style="padding:0; margin:0; line-height:1.2;"><td width="60" style="width:60px; padding:0 10px 0 0; margin:0; background-color:${theme.gutterBg}; color:${theme.gutterText}; text-align:right; border-right:3px solid #007bff; vertical-align:top; font-size:10pt; font-weight:bold; white-space:nowrap; line-height:1.2;">${lineNum}</td><td style="padding:0 0 0 15px; margin:0; white-space:pre; vertical-align:top; line-height:1.2; font-family:'Consolas', 'Monaco', 'Courier New', monospace;">${styledCode}</td></tr>`;
      }
      tableHtml += '</table></div>';

      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const blob = new Blob([tableHtml], { type: 'text/html' });
          const plainBlob = new Blob([code], { type: 'text/plain' });
          const data = [new ClipboardItem({
            'text/html': blob,
            'text/plain': plainBlob
          })];
          await navigator.clipboard.write(data);
        } else {
          // Fallback for browsers that don't support ClipboardItem
          const div = document.createElement('div');
          div.innerHTML = tableHtml;
          div.style.position = 'fixed';
          div.style.left = '-9999px';
          document.body.appendChild(div);

          const range = document.createRange();
          range.selectNode(div);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          document.body.removeChild(div);
        }

        const originalText = runnerStatus.textContent;
        setRunnerStatus('✓ Copied with line numbers!');
        setTimeout(() => setRunnerStatus(originalText), 3000);
      } catch (err) {
        console.error('Failed to copy rich text:', err);
        setRunnerStatus('Clipboard error. Try again?');
      }
    }

    async function copyTextToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);

      try {
        const copied = document.execCommand('copy');
        if (!copied) throw new Error('Copy command failed.');
      } finally {
        document.body.removeChild(textArea);
      }
    }

    function showCopyButtonCopied() {
      const button = document.getElementById('copyButton');
      button.textContent = 'Copied';
      if (copyButtonTimeout) clearTimeout(copyButtonTimeout);
      copyButtonTimeout = setTimeout(() => {
        button.textContent = 'Copy';
        copyButtonTimeout = null;
      }, 5000);
    }

    function updateURL() {
      const inputURL = document.getElementById('urlInput').value.trim();
      if (inputURL === '') {
        alert('Please enter a valid URL.');
        return;
      }
      const newURL = `${window.location.pathname}?url=${encodeURIComponent(inputURL)}`;
      window.history.pushState({}, '', newURL);
      fetchCode(inputURL);
    }

    function startBlankFile() {
      currentURL = '';
      editor.value = '';
      hasUnsavedChanges = false;
      displayCode.textContent = '';
      document.getElementById('urlInput').value = '';
      document.getElementById('workspace').style.display = 'grid';
      document.getElementById('inputContainer').style.display = 'none';
      document.getElementById('starterPanel').style.display = 'none';
      document.getElementById('instructionsPanel').style.display = 'none';
      window.history.pushState({}, '', window.location.pathname + '?blank');
      updateLineNumbers();
      analyseCodeAndUpdateMessage();
      clearRunner();
      setRunnerStatus('Blank file ready.');
      editor.focus();
    }

    function fetchCode(url) {
      currentURL = url;
      const fetchURL = /pastebin\.com/i.test(url)
        ? `https://corsproxy.io/?${encodeURIComponent(url)}`
        : url;

      fetch(fetchURL)
        .then(response => response.text())
        .then(data => {
          editor.value = data;
          hasUnsavedChanges = false;
          updateLineNumbers();
          document.getElementById('workspace').style.display = 'grid';
          document.getElementById('inputContainer').style.display = 'none';
          document.getElementById('starterPanel').style.display = 'none';
          document.getElementById('instructionsPanel').style.display = 'none';
          analyseCodeAndUpdateMessage();
          clearRunner();
        })
        .catch(error => {
          alert('Failed to load code. Please ensure the URL is correct and points to a raw Python file.');
          console.error('Error fetching code:', error);
        });
    }

    function extractImports(source) {
      const imports = new Set();
      const lines = source.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('import ')) {
          const parts = trimmed.replace('import ', '').split(',');
          for (const part of parts) {
            const moduleName = part.trim().split(' as ')[0].split('.')[0];
            if (moduleName) imports.add(moduleName);
          }
        } else if (trimmed.startsWith('from ')) {
          const afterFrom = trimmed.replace('from ', '');
          const moduleName = afterFrom.split(' import ')[0].trim().split('.')[0];
          if (moduleName) imports.add(moduleName);
        }
      }
      return [...imports];
    }

    function classifyCode(source) {
      const imports = extractImports(source);
      const browserSafeImports = new Set(['random', 'math', 'statistics', 'datetime', 'string', 'turtle']);
      const localOnlyImports = imports.filter(moduleName => !browserSafeImports.has(moduleName));
      const allowedImports = imports.filter(moduleName => browserSafeImports.has(moduleName));

      if (localOnlyImports.length > 0) {
        return {
          ok: false,
          mode: 'download',
          message: `Local-only imports detected: ${localOnlyImports.join(', ')}. Please download and run this program on a local Python installation.`
        };
      }

      return {
        ok: true,
        mode: 'normal',
        message: allowedImports.length > 0
          ? `Browser-safe imports detected: ${allowedImports.join(', ')}. This code looks suitable for browser running.`
          : 'No imports detected. This code looks suitable for browser running.'
      };
    }

    let hasWarnedAboutImports = false;

    function analyseCodeAndUpdateMessage(isTyping = false) {
      const analysis = classifyCode(editor.value);
      const imports = extractImports(editor.value);
      const hasTurtle = imports.includes('turtle');

      if (isTyping) {
        // When typing, do not generate errors or block execution
        document.getElementById('runButton').disabled = false;
        hasWarnedAboutImports = false;

        // Show status based only on browser-safe imports
        const browserSafeImports = new Set(['random', 'math', 'statistics', 'datetime', 'string', 'turtle']);
        const allowedImports = imports.filter(moduleName => browserSafeImports.has(moduleName));

        runnerMessage.style.display = 'block';
        runnerMessage.textContent = allowedImports.length > 0
          ? `Browser-safe imports detected: ${allowedImports.join(', ')}. This code looks suitable for browser running.`
          : 'No imports detected. This code looks suitable for browser running.';

        if (hasTurtle || currentAppMode === 'turtle') {
          detectionLabel.textContent = 'Detection: Turtle graphics mode.';
        } else {
          detectionLabel.textContent = 'Detection: normal Python mode.';
        }
      } else {
        // Original behavior when entering the page (loading code) or running/tracing
        runnerMessage.style.display = 'block';
        runnerMessage.textContent = analysis.message;

        if (!analysis.ok) {
          detectionLabel.textContent = 'Detection: download required.';
          document.getElementById('runButton').disabled = true;
          if (!hasWarnedAboutImports) {
            alert('Warning: Complex or local imports detected. Python Code Lab cannot run this code in the browser. Please download the .py file to run it locally.');
            hasWarnedAboutImports = true;
          }
        } else {
          if (hasTurtle || currentAppMode === 'turtle') {
            detectionLabel.textContent = 'Detection: Turtle graphics mode.';
          } else {
            detectionLabel.textContent = 'Detection: normal Python mode.';
          }
          document.getElementById('runButton').disabled = false;
          hasWarnedAboutImports = false;
        }
      }
      updateReferenceLinks();
      updateQuizDetection();
    }

    function updateQuizDetection() {
      const code = editor.value;
      const parsed = parseQuizTests(code);
      const testCases = parsed.testCases;
      const quizBtn = document.getElementById('quizButton');
      const creativeNextBtn = document.getElementById('creativeNextButton');
      const creativeEndBtn = document.getElementById('creativeEndButton');

      if (quizBtn) quizBtn.style.display = 'none';
      if (creativeNextBtn) creativeNextBtn.style.display = 'none';
      if (creativeEndBtn) creativeEndBtn.style.display = 'none';

      if (testCases.length > 0) {
        if (quizBtn) {
          quizBtn.style.display = 'inline-block';
          quizBtn.textContent = `Run Tests (${testCases.length})`;
        }
        const currentText = detectionLabel.textContent;
        if (!currentText.includes('Coding Quiz')) {
          detectionLabel.textContent = currentText.split(' | ')[0] + ` | Coding Quiz (${testCases.length} test${testCases.length > 1 ? 's' : ''})`;
        }
      } else if (parsed.nextUrl || parsed.isEnd) {
        if (parsed.nextUrl) {
          if (creativeNextBtn) creativeNextBtn.style.display = 'inline-block';
        } else if (parsed.isEnd) {
          if (creativeEndBtn) creativeEndBtn.style.display = 'inline-block';
        }
        const currentText = detectionLabel.textContent;
        if (!currentText.includes('Creative Assignment')) {
          detectionLabel.textContent = currentText.split(' | ')[0] + ` | Creative Assignment (No tests)`;
        }
      }
    }

    function extractLinksFromCode(code) {
      const lines = code.split('\n');
      const links = [];
      const seen = new Set();
      const urlRegex = /https?:\/\/[^\s'"`()]+/g;
      let mode = null;

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        let isNextLine = false;

        if (trimmed.startsWith('#')) {
          const commentContent = trimmed.substring(1).trim();
          if (/^next\b/i.test(commentContent)) {
            isNextLine = true;
            const rest = commentContent.substring(4).trim();
            const match = rest.match(/https?:\/\/[^\s'"`()]+/);
            if (!match) {
              mode = 'next';
            }
          } else if (mode === 'next') {
            isNextLine = true;
            mode = null;
          } else if (/^(input|output|end)\b/i.test(commentContent)) {
            mode = null;
          }
        } else {
          mode = null;
        }

        if (isNextLine) {
          return;
        }

        let match;
        urlRegex.lastIndex = 0;
        while ((match = urlRegex.exec(line)) !== null) {
          let url = match[0];
          url = url.replace(/[.,;:?!~)]+$/, '');
          if (url && !seen.has(url)) {
            seen.add(url);
            links.push({
              url: url,
              line: index + 1
            });
          }
        }
      });
      return links;
    }

    function cleanUrlDisplay(url) {
      try {
        const parsed = new URL(url);
        let display = parsed.hostname;
        if (display.startsWith('www.')) {
          display = display.substring(4);
        }
        if (parsed.pathname && parsed.pathname !== '/') {
          display += parsed.pathname;
        }
        if (display.length > 35) {
          display = display.substring(0, 32) + '...';
        }
        return display;
      } catch (e) {
        return url.length > 35 ? url.substring(0, 32) + '...' : url;
      }
    }

    function transformYoutubeUrl(url) {
      try {
        const parsed = new URL(url);
        let videoId = '';

        if (parsed.hostname.includes('youtube.com')) {
          if (parsed.pathname.includes('/watch')) {
            videoId = parsed.searchParams.get('v');
          } else if (parsed.pathname.includes('/shorts/')) {
            const parts = parsed.pathname.split('/');
            videoId = parts[parts.indexOf('shorts') + 1];
          } else if (parsed.pathname.includes('/embed/')) {
            return url;
          }
        } else if (parsed.hostname.includes('youtu.be')) {
          videoId = parsed.pathname.substring(1);
        }

        if (videoId) {
          videoId = videoId.split(/[?#&]/)[0];
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
      return url;
    }

    function scrollToCodeLine(lineNum) {
      const activeView = currentAppMode === 'display' ? displayEditor : editor;
      const lines = editor.value.split('\n');
      if (lineNum < 1 || lineNum > lines.length) return;

      if (currentAppMode === 'edit') {
        let charIndex = 0;
        for (let i = 0; i < lineNum - 1; i++) {
          charIndex += lines[i].length + 1;
        }
        editor.focus();
        editor.setSelectionRange(charIndex, charIndex + lines[lineNum - 1].length);
      }

      const lineHeight = getCodeLineHeight();
      const yPos = (lineNum - 1) * lineHeight;
      const viewRect = activeView.getBoundingClientRect();
      activeView.scrollTop = Math.max(0, yPos - viewRect.height / 3);

      highlightLine(lineNum);
    }

    function updateReferenceLinks() {
      const code = editor.value;
      const links = extractLinksFromCode(code);
      const linksPanel = document.getElementById('linksPanel');
      const linksList = document.getElementById('linksList');

      if (links.length === 0) {
        linksPanel.style.display = 'none';
        closeWebPreview(false);
        return;
      }

      linksPanel.style.display = 'block';

      const activeIframe = document.getElementById('webPreviewIframe');
      const previewContainer = document.getElementById('webPreviewContainer');
      const previewingUrl = previewContainer.style.display === 'block' ? activeIframe.dataset.originalUrl : '';

      linksList.innerHTML = '';
      let isPreviewingUrlStillAvailable = false;

      links.forEach(link => {
        const isPreviewed = (link.url === previewingUrl);
        if (isPreviewed) {
          isPreviewingUrlStillAvailable = true;
        }

        const item = document.createElement('div');
        item.className = 'link-item';

        const leftSide = document.createElement('div');
        leftSide.style.display = 'flex';
        leftSide.style.alignItems = 'center';
        leftSide.style.gap = '8px';
        leftSide.style.minWidth = '0';
        leftSide.style.flex = '1';

        const badge = document.createElement('span');
        badge.className = 'link-item-badge';
        badge.textContent = `Ln ${link.line}`;
        badge.title = `Click to scroll to line ${link.line}`;
        badge.onclick = () => scrollToCodeLine(link.line);

        const anchor = document.createElement('a');
        anchor.className = 'link-item-anchor';
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.textContent = cleanUrlDisplay(link.url);
        anchor.title = link.url;

        leftSide.appendChild(badge);
        leftSide.appendChild(anchor);

        const rightSide = document.createElement('div');
        rightSide.style.display = 'flex';
        rightSide.style.gap = '6px';
        rightSide.style.flexShrink = '0';

        const previewBtn = document.createElement('button');
        if (isPreviewed) {
          previewBtn.className = 'link-item-btn-preview';
          previewBtn.style.background = '#ef4444'; // Red
          previewBtn.textContent = 'Close';
          previewBtn.onclick = () => closeWebPreview();
          previewBtn.onmouseenter = () => { previewBtn.style.background = '#dc2626'; };
          previewBtn.onmouseleave = () => { previewBtn.style.background = '#ef4444'; };
        } else {
          previewBtn.className = 'link-item-btn-preview';
          previewBtn.textContent = 'Preview';
          previewBtn.onclick = () => previewWebLink(link.url);
        }

        const openBtn = document.createElement('a');
        openBtn.className = 'link-item-btn-open';
        openBtn.href = link.url;
        openBtn.target = '_blank';
        openBtn.textContent = 'Open';

        rightSide.appendChild(previewBtn);
        rightSide.appendChild(openBtn);

        item.appendChild(leftSide);
        item.appendChild(rightSide);

        linksList.appendChild(item);
      });

      if (!isPreviewingUrlStillAvailable && previewingUrl) {
        closeWebPreview(false);
      }
    }

    function setGlobalPreviewButtonState(isOn) {
      const toggleBtn = document.getElementById('toggleGlobalPreviewBtn');
      if (!toggleBtn) return;
      if (isOn) {
        toggleBtn.style.background = '#10b981'; // Green
        toggleBtn.textContent = 'Preview: On';
      } else {
        toggleBtn.style.background = '#ef4444'; // Red
        toggleBtn.textContent = 'Preview: Off';
      }
    }

    function previewWebLink(url) {
      const container = document.getElementById('webPreviewContainer');
      const iframe = document.getElementById('webPreviewIframe');
      const title = document.getElementById('previewUrlTitle');
      const fallbackLink = document.getElementById('iframeFallbackLink');

      const transformed = transformYoutubeUrl(url);

      title.textContent = `Previewing: ${cleanUrlDisplay(url)}`;
      iframe.src = transformed;
      iframe.dataset.originalUrl = url;
      iframe.dataset.lastUrl = url;
      fallbackLink.href = url;
      container.style.display = 'block';

      setGlobalPreviewButtonState(true);
      updateReferenceLinks();

      // Auto scroll runner panel down to make sure preview is visible
      const runnerPanel = document.querySelector('.runner-panel');
      if (runnerPanel) {
        setTimeout(() => {
          container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }

    function closeWebPreview(shouldUpdateLinks = true) {
      const container = document.getElementById('webPreviewContainer');
      const iframe = document.getElementById('webPreviewIframe');
      
      const originalUrl = iframe.dataset.originalUrl;
      if (!originalUrl && container.style.display === 'none') {
        return; // Already closed
      }

      iframe.src = '';
      iframe.removeAttribute('data-original-url');
      container.style.display = 'none';

      setGlobalPreviewButtonState(false);
      
      if (shouldUpdateLinks) {
        updateReferenceLinks();
      }
    }

    function setRunnerStatus(text) {
      runnerStatus.textContent = text;
    }

    function showConsoleInput(promptText) {
      const panel = document.getElementById('consoleInputPanel');
      const help = document.getElementById('consoleInputHelp');
      const field = document.getElementById('consoleInputField');
      help.textContent = promptText && promptText.trim()
        ? `Input needed: ${promptText}`
        : 'This program is waiting for input.';
      panel.style.display = 'block';
      field.value = '';
      field.focus();
    }

    function hideConsoleInput() {
      document.getElementById('consoleInputPanel').style.display = 'none';
      document.getElementById('consoleInputField').value = '';
    }

    function submitConsoleInput() {
      const field = document.getElementById('consoleInputField');
      if (!inputResolver) return;
      const value = field.value;
      const resolver = inputResolver;
      inputResolver = null;
      hideConsoleInput();
      resolver(value);
    }

    function clearRunner() {
      executionCancelled = true;
      outputEl.textContent = '';
      hideConsoleInput();
      clearTeachHighlight();

      displayCurrentStep = 0;
      displayTraceLog = [];
      displayInputHistory = [];
      displayTraceStatus = 'ready';
      displayPendingPrompt = '';
      displayFinalOutput = '';
      isAwaitingDisplayInput = false;
      document.getElementById('playPauseButton').textContent = 'Play';
      if (displayTimeout) clearTimeout(displayTimeout);

      resetTurtleCanvas();

      if (inputResolver) {
        const resolver = inputResolver;
        inputResolver = null;
        resolver('');
      }

      setRunnerStatus('System reset.');
    }

    function requestDisplayInput(promptText) {
      showConsoleInput(promptText);
      return new Promise(resolve => {
        inputResolver = function (value) {
          resolve(value);
        };
      });
    }

    function parseQuizTests(code) {
      const lines = code.split('\n');
      const inputsList = [];
      const outputsList = [];
      let nextUrl = null;
      let isEnd = false;
      let courseTitle = "Python Algorithms";
      let mode = null;

      const isHelpText = /entered|seperator|separator|speech\s+marks|between|expected|same\s+format|how\s+to|example/i;

      for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) {
          const commentContent = trimmed.substring(1).trim();
          
          if (/^input\b/i.test(commentContent)) {
            mode = 'input';
          } else if (/^output\b/i.test(commentContent)) {
            mode = 'output';
          } else if (/^next\b/i.test(commentContent)) {
            const rest = commentContent.substring(4).trim();
            const match = rest.match(/https?:\/\/[^\s'"`()]+/);
            if (match) {
              nextUrl = match[0];
              mode = null;
            } else {
              mode = 'next';
            }
          } else if (/^end\b/i.test(commentContent)) {
            isEnd = true;
            const rest = commentContent.substring(3).trim();
            if (rest !== '') {
              courseTitle = rest;
              mode = null;
            } else {
              mode = 'end';
            }
          } else {
            if (commentContent !== '' && !isHelpText.test(commentContent)) {
              if (mode === 'input' || mode === 'output') {
                const parts = commentContent.split(',').map(part => {
                  let p = part.trim();
                  if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
                    p = p.substring(1, p.length - 1);
                  }
                  return p;
                });
                if (mode === 'input') {
                  inputsList.push(parts);
                } else {
                  outputsList.push(parts);
                }
              } else if (mode === 'next') {
                const match = commentContent.match(/https?:\/\/[^\s'"`()]+/);
                if (match) {
                  nextUrl = match[0];
                }
                mode = null;
              } else if (mode === 'end') {
                courseTitle = commentContent;
                mode = null;
              }
            }
          }
        }
      }

      const testCases = [];
      const count = Math.min(inputsList.length, outputsList.length);
      for (let i = 0; i < count; i++) {
        testCases.push({
          inputs: inputsList[i],
          expected: outputsList[i]
        });
      }
      return {
        testCases: testCases,
        nextUrl: nextUrl,
        isEnd: isEnd,
        courseTitle: courseTitle
      };
    }

    async function runSingleTestCase(source, inputs) {
      if (!pyodideInstance && pyodideReadyPromise) {
        await pyodideReadyPromise;
      }

      const setupCode = `
import sys, io, builtins, json

# Save originals
if not hasattr(builtins, '_original_input'):
    builtins._original_input = builtins.input
if not hasattr(builtins, '_original_print'):
    builtins._original_print = builtins.print

_test_inputs = json.loads(_test_inputs_raw)
_test_input_index = 0
_test_output = io.StringIO()

def _test_input(prompt=""):
    global _test_input_index
    if prompt:
        _test_output.write(str(prompt))
    if _test_input_index < len(_test_inputs):
        val = str(_test_inputs[_test_input_index])
        _test_input_index += 1
        _test_output.write(val + '\\n')
        return val
    else:
        return ""

def _test_print(*args, **kwargs):
    kwargs['file'] = _test_output
    builtins._original_print(*args, **kwargs)

builtins.input = _test_input
builtins.print = _test_print

# Reset turtle module state if it exists
if 'turtle' in sys.modules:
    import turtle
    try:
        turtle._default_turtle.reset()
        turtle._default_screen.reset()
    except Exception:
        pass
`;

      const runCode = `
_test_error = None
try:
    exec(compile(source_code, '<user_code>', 'exec'), {"__name__": "__main__"})
except Exception as e:
    _test_error = str(e)
finally:
    builtins.input = builtins._original_input
    builtins.print = builtins._original_print

# Get results
_test_result = {
    "output": _test_output.getvalue(),
    "error": _test_error
}
import json
json.dumps(_test_result)
`;

      try {
        pyodideInstance.globals.set("source_code", source);
        pyodideInstance.globals.set("_test_inputs_raw", JSON.stringify(inputs));
        await pyodideInstance.runPythonAsync(setupCode);
        const resultJson = await pyodideInstance.runPythonAsync(runCode);
        return JSON.parse(resultJson);
      } catch (err) {
        return {
          output: "",
          error: String(err)
        };
      }
    }

    async function runQuizTests() {
      const code = editor.value;
      const parsed = parseQuizTests(code);
      const testCases = parsed.testCases;
      if (testCases.length === 0) return;

      executionCancelled = false;
      outputEl.textContent = '';
      hideConsoleInput();

      const runnerLayout = document.getElementById('runnerLayout');
      if (runnerLayout && runnerLayout.classList.contains('collapsed')) {
        toggleRunner();
      }

      setRunnerStatus('Running quiz tests...');
      outputEl.innerHTML = `
        <div style="padding: 12px; font-family: sans-serif; color: #475569;">
          <div style="font-weight: 600; font-size: 15px; margin-bottom: 8px;">Running ${testCases.length} tests...</div>
          <div style="height: 6px; background: #e2e8f0; border-radius: 3px; overflow:hidden;">
            <div style="height: 100%; background: #6366f1; width: 0%; transition: width 0.2s;" id="quizProgressBar"></div>
          </div>
        </div>
      `;

      if (!pyodideInstance && pyodideReadyPromise) {
        setRunnerStatus('Loading Python engine...');
        await pyodideReadyPromise;
      }

      const results = [];
      let passedCount = 0;

      for (let i = 0; i < testCases.length; i++) {
        if (executionCancelled) {
          setRunnerStatus('Tests cancelled.');
          return;
        }

        const tc = testCases[i];
        setRunnerStatus(`Running test ${i + 1} of ${testCases.length}...`);

        const runRes = await runSingleTestCase(code, tc.inputs);

        // Evaluate outputs
        const actualOutput = runRes.output || "";
        const error = runRes.error;

        const expectedChecks = [];
        let isPass = true;

        if (error) {
          isPass = false;
          expectedChecks.push({
            expected: tc.expected.join(', '),
            matched: false,
            msg: `Error: ${error}`
          });
        } else {
          // Check each expected output string
          for (let expectedItem of tc.expected) {
            const cleanExpected = expectedItem.trim();
            // Perform a case-insensitive check
            const matched = actualOutput.toLowerCase().includes(cleanExpected.toLowerCase());
            if (!matched) {
              isPass = false;
            }
            expectedChecks.push({
              expected: cleanExpected,
              matched: matched
            });
          }
        }

        if (isPass) {
          passedCount++;
        }

        results.push({
          index: i + 1,
          inputs: tc.inputs,
          expected: tc.expected,
          actual: actualOutput,
          error: error,
          isPass: isPass,
          checks: expectedChecks
        });

        // Update progress bar
        const progressFill = document.getElementById('quizProgressBar');
        if (progressFill) {
          progressFill.style.width = `${((i + 1) / testCases.length) * 100}%`;
        }
      }

      renderQuizResults(results, passedCount, testCases.length, parsed.nextUrl, parsed.isEnd, parsed.courseTitle);
    }

    function renderQuizResults(results, passedCount, totalCount, nextUrl = null, isEnd = false, courseTitle = "") {
      const isCreative = (totalCount === 0);
      const isAllPassed = isCreative || (passedCount === totalCount);
      const isNonePassed = !isCreative && (passedCount === 0);
      const badgeClass = isAllPassed ? 'pass' : 'fail';
      const badgeText = isCreative ? 'Completed 🎉' : `${passedCount} / ${totalCount} Passed`;
      const fillClass = isAllPassed ? 'pass' : 'fail';
      const percentage = isCreative ? 100 : ((passedCount / totalCount) * 100);

      if (!window.toggleTestCaseDetails) {
        window.toggleTestCaseDetails = function(index) {
          const el = document.getElementById(`test-case-details-${index}`);
          const btn = document.getElementById(`toggle-btn-${index}`);
          if (el) {
            if (el.style.display === 'none') {
              el.style.display = 'block';
              btn.textContent = 'Hide Details';
            } else {
              el.style.display = 'none';
              btn.textContent = 'Details';
            }
          }
        };
      }

      let html = `
        <div class="test-results-container">
          <div class="test-results-header">
            <span class="test-results-title">Quiz Test Results</span>
            <span class="test-results-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="test-results-progress-bar">
            <div class="test-results-progress-fill ${fillClass}" style="width: ${percentage}%"></div>
          </div>
          <div class="test-case-list">
      `;

      results.forEach(res => {
        const icon = res.isPass ? '✔' : '❌';
        const statusText = res.isPass ? 'Pass' : 'Fail';
        const statusClass = res.isPass ? 'pass' : 'fail';

        const inputsDisplay = res.inputs.join(', ') || '(no input)';

        html += `
          <div class="test-case-item">
            <div class="test-case-summary" onclick="toggleTestCaseDetails(${res.index})">
              <span class="status-icon ${statusClass}">${icon}</span>
              <span class="test-case-name">Test Case ${res.index}: inputs [${escapeHtml(inputsDisplay)}]</span>
              <span class="test-case-status-text ${statusClass}">${statusText}</span>
              <button class="toggle-details-btn" id="toggle-btn-${res.index}">Details</button>
            </div>
            <div class="test-case-details" id="test-case-details-${res.index}" style="display: none;">
              <div class="detail-grid">
                <div class="detail-section">
                  <span class="detail-label">Inputs</span>
                  <pre class="detail-value">${escapeHtml(res.inputs.join('\n') || '(none)')}</pre>
                </div>
                <div class="detail-section">
                  <span class="detail-label">Expected Checks</span>
                  <div class="detail-value">
                    <ul class="expected-check-list">
        `;

        res.checks.forEach(chk => {
          const chkIcon = chk.matched ? '✔' : '❌';
          const chkClass = chk.matched ? 'pass' : 'fail';
          if (chk.msg) {
            html += `<li class="expected-check-item ${chkClass}"><span>${chkIcon}</span> <span>${escapeHtml(chk.msg)}</span></li>`;
          } else {
            html += `<li class="expected-check-item ${chkClass}"><span>${chkIcon}</span> <span>Contains: "${escapeHtml(chk.expected)}"</span></li>`;
          }
        });

        html += `
                    </ul>
                  </div>
                </div>
                <div class="detail-section" style="grid-column: span 2;">
                  <span class="detail-label">Actual Console Output</span>
                  <pre class="detail-value ${res.isPass ? 'pass' : 'fail'}">${escapeHtml(res.actual || (res.error ? 'Error during execution:\n' + res.error : '(no output)'))}</pre>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
      `;

      if (isAllPassed) {
        if (nextUrl) {
          html += `
            <div class="quiz-completion-panel pass">
              <h4>🎉 Level Passed!</h4>
              <p>You have successfully completed all tests for this level.</p>
              <button class="next-level-btn" onclick="window.location.href = window.location.pathname + '?url=' + encodeURIComponent('${nextUrl}')">Next Level ➔</button>
            </div>
          `;
        } else if (isEnd) {
          html += `
            <div class="quiz-completion-panel end">
              <h4>🏆 Course Completed!</h4>
              <p>Outstanding! You have completed the final level of: <strong>${escapeHtml(courseTitle)}</strong></p>
              <div class="cert-input-row">
                <input type="text" id="studentCertName" placeholder="Enter your name for the certificate" />
                <button class="download-cert-btn" onclick="window.triggerCertDownload('${escapeHtml(courseTitle).replace(/'/g, "\\'")}')">Claim Certificate 🎓</button>
              </div>
            </div>
          `;
        }
      }

      html += `
        </div>
      `;

      outputEl.innerHTML = html;
      setRunnerStatus(isAllPassed ? 'All tests passed!' : `${totalCount - passedCount} test(s) failed.`);
    }

    function generateCertificatePNG(studentName, courseTitle) {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // Helper to draw the ReadySetCompute Laptop Icon
      function drawLaptopIcon(c, x, y, size) {
        c.save();
        c.fillStyle = '#0f172a';
        c.strokeStyle = '#0f172a';
        c.lineJoin = 'round';
        c.lineCap = 'round';

        const w = size;
        const h = size * 0.6;
        const sx = x - w/2;
        const sy = y - h/2 - size * 0.05;

        // Screen frame
        c.lineWidth = size * 0.08;
        c.strokeRect(sx + w*0.1, sy, w*0.8, h);
        
        // Base keyboard with built-in center notch (transparent vector path)
        c.beginPath();
        c.moveTo(sx, sy + h);
        c.lineTo(x - w * 0.12, sy + h);
        c.lineTo(x - w * 0.12, sy + h + size * 0.03);
        c.lineTo(x + w * 0.12, sy + h + size * 0.03);
        c.lineTo(x + w * 0.12, sy + h);
        c.lineTo(sx + w, sy + h);
        c.lineTo(sx + w * 0.95, sy + h + size * 0.08);
        c.lineTo(sx + w * 0.05, sy + h + size * 0.08);
        c.closePath();
        c.fill();

        // Code characters <>
        c.font = `bold ${Math.round(size * 0.22)}px sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('<>', x, sy + h/2);

        c.restore();
      }

      // Background Gradient (Matches ReadySetCompute soft background mesh gradient)
      const grad = ctx.createLinearGradient(0, 800, 1200, 0); // Diagonal bottom-left to top-right
      grad.addColorStop(0, '#f0fdf4');   // Soft mint green
      grad.addColorStop(0.35, '#eff6ff'); // Soft sky blue
      grad.addColorStop(0.7, '#f5f3ff');  // Soft violet/purple
      grad.addColorStop(1, '#fdf2f8');   // Soft pink
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer Border (Vibrant diagonal brand gradient to match the website)
      const borderGrad = ctx.createLinearGradient(0, 800, 1200, 0);
      borderGrad.addColorStop(0, '#4ade80');   // Mint Green
      borderGrad.addColorStop(0.35, '#3b82f6'); // Sky Blue
      borderGrad.addColorStop(0.7, '#8b5cf6');  // Violet/Purple
      borderGrad.addColorStop(1, '#ec4899');   // Hot Pink
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

      // Corner Ornaments
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(60, 60, 20, 20);
      ctx.fillRect(canvas.width - 80, 60, 20, 20);
      ctx.fillRect(60, canvas.height - 80, 20, 20);
      ctx.fillRect(canvas.width - 80, canvas.height - 80, 20, 20);

      ctx.textBaseline = 'middle';

      // 1. Draw ReadySetCompute Logo Centered at Top
      ctx.font = 'bold 36px "Segoe UI", sans-serif';
      const textWidth = ctx.measureText('ReadySetCompute').width;
      const iconSize = 44;
      const gap = 12;
      const totalWidth = iconSize + gap + textWidth;
      const startX = 600 - totalWidth / 2;

      // Draw Icon
      drawLaptopIcon(ctx, startX + iconSize / 2, 110, iconSize);

      // Draw Brand Text
      ctx.fillStyle = '#0f172a'; // Navy
      ctx.textAlign = 'left';
      ctx.fillText('ReadySetCompute', startX + iconSize + gap, 110);

      // 2. Draw Certificate Info
      ctx.textAlign = 'center';

      // Main title
      ctx.font = 'bold 44px "Segoe UI", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('CERTIFICATE OF COMPLETION', 600, 200);

      // Subtitle
      ctx.font = 'italic 20px "Segoe UI", Georgia, serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('This certifies that', 600, 270);

      // Student Name
      ctx.font = 'bold 44px Georgia, serif';
      ctx.fillStyle = '#2563eb'; // Brand Blue Name
      ctx.fillText(studentName.toUpperCase(), 600, 340);

      // Underline (Vibrant Gradient line)
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(350, 380);
      ctx.lineTo(850, 380);
      ctx.stroke();

      // Text
      ctx.font = '18px "Segoe UI", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('has successfully completed the programming lab course', 600, 430);

      // Course Name
      ctx.font = 'bold 32px "Segoe UI", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(courseTitle, 600, 490);

      // 3. Date / Certification stamp line
      ctx.font = '16px "Segoe UI", sans-serif';
      ctx.fillStyle = '#64748b';
      
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      ctx.fillText('Date: ' + today, 350, 610);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, 590);
      ctx.lineTo(450, 590);
      ctx.stroke();

      ctx.fillText('ReadySetCompute Certified', 850, 610);
      ctx.beginPath();
      ctx.moveTo(750, 590);
      ctx.lineTo(950, 590);
      ctx.stroke();

      // 4. Seal Badge
      // Gradient Outer (Vibrant mesh color matches border)
      ctx.fillStyle = borderGrad;
      ctx.beginPath();
      ctx.arc(600, 630, 44, 0, Math.PI * 2);
      ctx.fill();

      // Navy Center
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(600, 630, 34, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Segoe UI", sans-serif';
      ctx.fillText('PASSED', 600, 630);

      return canvas.toDataURL('image/png');
    }

    window.triggerCertDownload = function(courseTitle) {
      const nameInput = document.getElementById('studentCertName');
      const name = nameInput ? nameInput.value.trim() : "";
      if (!name) {
        alert("Please enter your name to claim your certificate.");
        return;
      }

      const dataUrl = generateCertificatePNG(name, courseTitle);
      const link = document.createElement('a');
      link.download = `${name.replace(/\s+/g, '_')}_python_certificate.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    async function runCurrentCode() {
      const source = editor.value;
      const analysis = classifyCode(source);

      executionCancelled = false;
      outputEl.textContent = '';
      hideConsoleInput();

      if (!analysis.ok) {
        analyseCodeAndUpdateMessage(false);
        setRunnerStatus('Cannot run this code in the browser.');
        return;
      }

      const imports = extractImports(source);
      const usesTurtle = imports.includes('turtle');
      const turtleContainer = document.getElementById('turtleCanvasContainer');

      if (usesTurtle || currentAppMode === 'turtle') {
        if (turtleContainer) {
          turtleContainer.style.display = 'flex';
          setupTurtleCanvas(400, 400);
          resetTurtleCanvas();
        }
      } else {
        if (turtleContainer && currentAppMode !== 'turtle') {
          turtleContainer.style.display = 'none';
        }
      }

      runnerMessage.style.display = 'block';
      runnerMessage.textContent = analysis.message;
      setRunnerStatus('Running...');

      if (runnerLayout.classList.contains('collapsed')) {
        toggleRunner();
      }

      if (!pyodideInstance && pyodideReadyPromise) {
        setRunnerStatus('Loading Python engine...');
        await pyodideReadyPromise;
      }

      try {
        pyodideInstance.setStdin({
          stdin: () => {
            const result = prompt("Enter input:");
            if (result !== null) {
              outputEl.textContent += result + '\n';
              return result;
            }
            return "";
          }
        });
        // Reset Python-side turtle module state if it exists
        await pyodideInstance.runPythonAsync(`
import sys
if 'turtle' in sys.modules:
    import turtle
    turtle._default_turtle.reset()
    turtle._default_screen.reset()
        `);
        await pyodideInstance.runPythonAsync(source);

        hideConsoleInput();
        setRunnerStatus('Finished successfully.');
      } catch (err) {
        hideConsoleInput();
        outputEl.textContent += String(err);
        setRunnerStatus('There was an error while running the code.');
      }
    }


    // --- Robust Display Mode Tracing Logic ---
    async function prepareDisplayTrace() {
      if (isTracing) return false;
      isTracing = true;

      const analysis = classifyCode(editor.value);
      if (!analysis.ok) {
        analyseCodeAndUpdateMessage(false);
        displayTraceStatus = 'error';
        outputEl.textContent = '';
        setRunnerStatus('Cannot trace imported code in the browser.');
        isTracing = false;
        return false;
      }

      const source = editor.value;
      const imports = extractImports(source);
      const usesTurtle = imports.includes('turtle');
      const turtleContainer = document.getElementById('turtleCanvasContainer');

      if (usesTurtle || currentAppMode === 'turtle') {
        if (turtleContainer) {
          turtleContainer.style.display = 'flex';
          setupTurtleCanvas(400, 400);
          resetTurtleCanvas();
        }
      } else {
        if (turtleContainer && currentAppMode !== 'turtle') {
          turtleContainer.style.display = 'none';
        }
      }

      if (!pyodideInstance && pyodideReadyPromise) {
        setRunnerStatus('Loading Python engine...');
        await pyodideReadyPromise;
      }

      const setupCode = `
import sys, io, builtins, json, ast

if 'turtle' in sys.modules:
    import turtle
    turtle._default_turtle.reset()
    turtle._default_screen.reset()

_trace_output = []
_trace_log = []
_call_stack = []
_frame_states = {}
_stdout_capture = io.StringIO()
displayInputHistory = json.loads(displayInputHistoryJson)
_recursive_functions = set()
_source_lines = source_code.splitlines()

def _get_turtle_snapshot():
    try:
        import js
        if hasattr(js, 'getTurtleSnapshot'):
            return js.getTurtleSnapshot()
    except Exception:
        pass
    return None

try:
    _tree = ast.parse(source_code)
    for _node in ast.walk(_tree):
        if isinstance(_node, ast.FunctionDef):
            for _child in ast.walk(_node):
                if isinstance(_child, ast.Call) and isinstance(_child.func, ast.Name) and _child.func.id == _node.name:
                    _recursive_functions.add(_node.name)
                    break
except Exception:
    pass

def _safe_repr(value):
    try:
        text = repr(value)
    except Exception:
        text = "..."
    if len(text) > 80:
        text = text[:77] + "..."
    return text

def _frame_locals(frame):
    locs = {}
    for k, v in frame.f_locals.items():
        if not k.startswith('_') and k not in ['kwargs', 'args', 'builtins', 'prompt', 'displayInputHistory', 'TraceInterrupt']:
            try: locs[k] = str(v)
            except Exception: locs[k] = "..."
    return locs

def _format_call(frame):
    func_name = frame.f_code.co_name
    arg_names = frame.f_code.co_varnames[:frame.f_code.co_argcount]
    parts = []
    for name in arg_names:
        if name in frame.f_locals:
            if len(arg_names) == 1:
                parts.append(_safe_repr(frame.f_locals[name]))
            else:
                parts.append(name + "=" + _safe_repr(frame.f_locals[name]))
    return func_name + "(" + ", ".join(parts) + ")"

def _stack_text():
    return [item['call'] for item in _call_stack]

def _source_line(line_no):
    if 1 <= line_no <= len(_source_lines):
        return _source_lines[line_no - 1].strip()
    return ""

def _trace_hook(frame, event, arg):
    if frame.f_code.co_filename != '<user_code>':
        return _trace_hook

    func_name = frame.f_code.co_name
    if func_name in ['custom_catch_print', 'custom_display_input', '_run_trace']:
        return _trace_hook

    if event == 'call' and func_name != '<module>':
        call_text = _format_call(frame)
        is_recursive_call = any(item['name'] == func_name for item in _call_stack)
        if is_recursive_call and _call_stack:
            for item in reversed(_call_stack):
                if item['name'] == func_name:
                    item['made_recursive_call'] = True
                    break

        state = {
            'name': func_name,
            'call': call_text,
            'made_recursive_call': False,
            'recursive_function': func_name in _recursive_functions
        }
        _frame_states[id(frame)] = state
        _call_stack.append(state)

        note = "Calling " + call_text
        label = "Call:"
        if state['recursive_function'] and is_recursive_call:
            label = "Going deeper"
            note = "Need " + call_text
        elif state['recursive_function']:
            note = "Calling " + call_text + "\\nGoing down: making function calls until the base case."

        _trace_log.append({
            'event': 'call',
            'line': frame.f_code.co_firstlineno,
            'locals': _frame_locals(frame),
            'output_len': len(_trace_output),
            'call_label': label,
            'call_note': note,
            'call_text': call_text,
            'call_stack': _stack_text(),
            'depth': len(_call_stack),
            'turtle_snapshot': _get_turtle_snapshot()
        })
        return _trace_hook

    if event == 'return' and func_name != '<module>':
        state = _frame_states.get(id(frame), {'name': func_name, 'call': _format_call(frame), 'made_recursive_call': False, 'recursive_function': func_name in _recursive_functions})
        return_value = _safe_repr(arg)
        return_line = _source_line(frame.f_lineno)
        recursive_function = state.get('recursive_function') or state.get('made_recursive_call')
        label = "Returned value:"
        note = state['call'] + " returns " + return_value

        if recursive_function and not state.get('made_recursive_call'):
            label = "Base case reached"
            note = state['call'] + "\\nBase case reached\\nReturn " + return_value
        elif recursive_function:
            label = "Returning to previous call"
            if len(_call_stack) > 1:
                note = "Back to " + _call_stack[-2]['call'] + "\\n" + state['call'] + " returned " + return_value
            else:
                note = state['call'] + " returned " + return_value

        if return_line.startswith('return'):
            note += "\\nCode: " + return_line

        _trace_log.append({
            'event': 'return',
            'line': frame.f_lineno,
            'locals': _frame_locals(frame),
            'output_len': len(_trace_output),
            'call_label': label,
            'call_note': note,
            'call_text': state['call'],
            'return_value': return_value,
            'call_stack': _stack_text(),
            'depth': len(_call_stack),
            'turtle_snapshot': _get_turtle_snapshot()
        })

        if _call_stack and _call_stack[-1] is state:
            _call_stack.pop()
        else:
            for idx in range(len(_call_stack) - 1, -1, -1):
                if _call_stack[idx].get('call') == state.get('call'):
                    _call_stack.pop(idx)
                    break
        _frame_states.pop(id(frame), None)
        return _trace_hook

    if event == 'line':
        _trace_log.append({
            'event': 'line',
            'line': frame.f_lineno,
            'locals': _frame_locals(frame),
            'output_len': len(_trace_output),
            'call_stack': _stack_text(),
            'call_text': _call_stack[-1]['call'] if _call_stack else "",
            'call_label': "Current call:" if _call_stack else "",
            'call_note': _call_stack[-1]['call'] if _call_stack else "",
            'depth': len(_call_stack),
            'turtle_snapshot': _get_turtle_snapshot()
        })
    return _trace_hook

def custom_catch_print(*args, **kwargs):
    kwargs['file'] = _stdout_capture
    builtins._original_print(*args, **kwargs)
    val = _stdout_capture.getvalue()
    _stdout_capture.truncate(0)
    _stdout_capture.seek(0)
    _trace_output.append(val)

if not hasattr(builtins, '_original_print'):
   builtins._original_print = builtins.print
builtins.print = custom_catch_print

if not hasattr(builtins, '_original_input'):
   builtins._original_input = builtins.input

class TraceInterrupt(Exception):
    def __init__(self, prompt_text):
        self.prompt_text = prompt_text

def custom_display_input(p=""):
    _trace_output.append(p)
    # Filter log for inputs already satisfied
    idx = len([x for x in _trace_log if '_is_input' in x])
    
    if idx < len(displayInputHistory):
        ans = displayInputHistory[idx]
        _trace_output.append(ans + '\\n')
        if _trace_log:
            _trace_log[-1]['_is_input'] = True
        return ans
    else:
        raise TraceInterrupt(p)

builtins.input = custom_display_input


def _run_trace():

    _trace_log.clear()
    _trace_output.clear()
    sys.settrace(_trace_hook)
    status = "finished"
    pending_prompt = ""
    try:
        exec(compile(source_code, '<user_code>', 'exec'), {"__name__": "__main__"})
    except TraceInterrupt as ti:
        status = "waiting_input"
        pending_prompt = ti.prompt_text
    except Exception as e:
        _trace_output.append(str(e) + '\\n')
        status = "error"
    finally:
        sys.settrace(None)
        builtins.print = getattr(builtins, '_original_print', builtins.print)
        builtins.input = getattr(builtins, '_original_input', builtins.input)
    return {"log": _trace_log, "output": _trace_output, "status": status, "pending_prompt": pending_prompt}
`;
      try {
        pyodideInstance.globals.set("source_code", source);
        pyodideInstance.globals.set("displayInputHistoryJson", JSON.stringify(displayInputHistory));

        pyodideInstance.runPython(setupCode);
        const resProxy = pyodideInstance.runPython("_run_trace()");
        let res;
        try {
          res = resProxy.toJs({ dict_converter: Object.fromEntries });
        } finally {
          resProxy.destroy();
        }

        displayTraceLog = res.log || [];
        displayTraceStatus = res.status;
        displayPendingPrompt = res.pending_prompt;

        const outputArr = res.output || [];
        displayFinalOutput = outputArr.join('');
        displayTraceLog.forEach(step => {
          const outLen = step.output_len || 0;
          let outPart = '';
          for (let i = 0; i < outLen && i < outputArr.length; i++) {
            outPart += outputArr[i];
          }
          step.full_output = outPart;
        });
        if (displayTraceStatus === 'finished' && displayTraceLog.length > 0) {
          displayTraceLog[displayTraceLog.length - 1].full_output = displayFinalOutput;
        }



        if (displayTraceStatus === 'error') {
          setRunnerStatus('Trace Error.');
          // Add error details to the output window for better debugging
          const lastOut = outputArr.length > 0 ? outputArr[outputArr.length - 1] : "";
          if (lastOut && lastOut.includes("Exception")) {
            outputEl.textContent += "\n--- Traceback ---\n" + lastOut;
          }
        } else {
          setRunnerStatus(displayTraceStatus === 'waiting_input' ? 'Ready (Input needed)' : 'Trace updated.');
        }

        isTracing = false;
        return true;
      } catch (err) {
        console.error('Trace Generation Error:', err);
        outputEl.textContent = "Trace Error: " + String(err);
        displayTraceStatus = 'error';
        isTracing = false;
        return false;
      }
    }





    function renderDisplayStep(stepIndex) {
      if (stepIndex >= displayTraceLog.length) return;
      const step = displayTraceLog[stepIndex];
      if (!step) return;

      // Restore turtle snapshot if available
      if (step.turtle_snapshot) {
        try {
          const snap = JSON.parse(step.turtle_snapshot);
          turtleCommands = snap.commands || [];
          turtleX = snap.x || 0;
          turtleY = snap.y || 0;
          turtleHeading = snap.heading || 0;
          turtleVisible = snap.visible !== undefined ? snap.visible : true;
          turtleBgColor = snap.bgColor || '#ffffff';
          turtleShape = snap.shape || 'classic';
          drawEverything();
        } catch (e) {
          console.error("Error restoring turtle snapshot:", e);
        }
      }

      const lineNum = step.line;
      if (lineNum !== undefined) highlightLine(lineNum);
      renderCallTrace(step);

      const locs = step.locals || {};
      let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">';
      tableHtml += '<tr style="border-bottom: 2px solid #cbd5e1;"><th style="text-align: left; padding: 4px; font-size: 12px; color: #64748b;">Variable</th><th style="text-align: left; padding: 4px; font-size: 12px; color: #64748b;">Value</th></tr>';

      const keys = Object.keys(locs);
      if (keys.length > 0) {
        keys.forEach(k => {
          tableHtml += `<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 6px 4px; font-weight: 600; color: #0f172a;">${k}</td><td style="padding: 6px 4px; color: #059669;">${locs[k]}</td></tr>`;
        });
        tableHtml += '</table>';
        variableList.innerHTML = tableHtml;
      } else {
        variableList.textContent = 'No variables.';
      }

      const out = step.full_output || '';
      if (out !== undefined) outputEl.textContent = out;

      syncLineNumberScroll();
    }

    function escapeHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderCallTrace(step) {
      const stack = step.call_stack || [];
      const label = step.call_label || '';
      const note = step.call_note || '';

      if (!stack.length && !label && !note) {
        callTraceList.textContent = 'No function call yet.';
        return;
      }

      let html = '';
      if (label || note) {
        html += `<div style="margin-bottom: 8px;"><strong>${escapeHtml(label)}</strong>`;
        if (note) {
          html += `<div style="margin-top: 4px;">${escapeHtml(note)}</div>`;
        }
        html += '</div>';
      }

      if (stack.length) {
        html += '<div><strong>Call stack:</strong></div>';
        html += '<div style="margin-top: 4px;">';
        stack.forEach((call, index) => {
          const indent = '&nbsp;'.repeat(index * 4);
          const isCurrent = index === stack.length - 1;
          html += `<div>${indent}${isCurrent ? '-> ' : '   '}${escapeHtml(call)}</div>`;
        });
        html += '</div>';
      }

      callTraceList.innerHTML = html;
    }




    function clearTeachHighlight() {
      highlightLayer.innerHTML = '';
      callTraceList.textContent = '';
      variableList.textContent = '';
    }

    function highlightLine(lineNum) {
      clearTeachHighlight();
      const lineHeight = getCodeLineHeight();
      const yPos = (lineNum - 1) * lineHeight;
      const hl = document.createElement('div');
      hl.className = 'highlight-line';
      hl.style.top = yPos + 'px';
      hl.style.height = lineHeight + 'px';
      highlightLayer.appendChild(hl);

      // Auto-scroll logic
      const activeView = currentAppMode === 'display' ? displayEditor : editor;
      const viewRect = activeView.getBoundingClientRect();
      if (yPos < activeView.scrollTop || yPos > activeView.scrollTop + viewRect.height - 40) {
        activeView.scrollTop = Math.max(0, yPos - viewRect.height / 2);
      }
    }

    async function displayStep() {
      if (displayTraceStatus === 'error') return;
      if (isTracing || isAwaitingDisplayInput) return;

      if (displayTraceLog.length === 0) {
        const success = await prepareDisplayTrace();
        if (!success) return;
        if (displayTraceLog.length > 0 && displayCurrentStep === 0) {
          renderDisplayStep(displayCurrentStep);
          displayCurrentStep++;
          setRunnerStatus(`Step ${displayCurrentStep} of ${displayTraceLog.length}${displayTraceStatus === 'waiting_input' ? ' (input pending)' : ''}`);
        }
        return;
      }

      if (displayCurrentStep < displayTraceLog.length) {
        renderDisplayStep(displayCurrentStep);
        displayCurrentStep++;
        setRunnerStatus(`Step ${displayCurrentStep} of ${displayTraceLog.length}${displayTraceStatus === 'waiting_input' ? ' (input pending)' : ''}`);
      } else if (displayTraceStatus === 'waiting_input') {
        const wasPlaying = btnPlayStatus === 'playing';
        if (displayTimeout) clearTimeout(displayTimeout);
        isAwaitingDisplayInput = true;
        setRunnerStatus('Waiting for input.');

        try {
          const ans = await requestDisplayInput(displayPendingPrompt || "Input required:");
          if (!isAwaitingDisplayInput || displayTraceStatus === 'ready') return;
          displayInputHistory.push(ans);
          hideConsoleInput();

          const success = await prepareDisplayTrace();
          if (success && displayCurrentStep < displayTraceLog.length) {
            renderDisplayStep(displayCurrentStep);
            displayCurrentStep++;
            setRunnerStatus(`Step ${displayCurrentStep} of ${displayTraceLog.length}${displayTraceStatus === 'waiting_input' ? ' (input pending)' : ''}`);
          } else if (success && displayTraceStatus !== 'waiting_input') {
            setRunnerStatus('Execution finished.');
          }

          if (success && wasPlaying && btnPlayStatus === 'playing' && displayTraceStatus !== 'error') {
            startDisplayAutoPlay();
          }
        } finally {
          isAwaitingDisplayInput = false;
        }
      } else {
        if (displayTraceStatus === 'finished') {
          outputEl.textContent = displayFinalOutput;
        }
        setRunnerStatus('Execution finished.');
        stopDisplayAutoPlay();
      }
    }


    function startDisplayAutoPlay() {
      const btn = document.getElementById('playPauseButton');
      if (btn) btn.textContent = 'Pause';
      btnPlayStatus = 'playing';

      function next() {
        if (btnPlayStatus !== 'playing') return;

        if (displayCurrentStep < displayTraceLog.length) {
          displayStep();
          displayTimeout = setTimeout(next, 800);
        } else if (displayTraceStatus === 'waiting_input') {
          // Pause auto-play for input
          displayStep();
        } else {
          stopDisplayAutoPlay();
        }
      }

      if (displayTimeout) clearTimeout(displayTimeout);
      displayTimeout = setTimeout(next, 800);
    }

    function stopDisplayAutoPlay() {
      const btn = document.getElementById('playPauseButton');
      if (btn) btn.textContent = 'Play';
      btnPlayStatus = 'idle';
      if (displayTimeout) clearTimeout(displayTimeout);
    }


    async function displayPlayPause() {
      if (btnPlayStatus === 'playing') {
        stopDisplayAutoPlay();
      } else {
        if (displayTraceLog.length === 0) {
          const success = await prepareDisplayTrace();
          if (!success) return;
        }
        if (displayCurrentStep >= displayTraceLog.length && displayTraceStatus !== 'waiting_input') {
          displayReset();
        }
        startDisplayAutoPlay();
      }
    }

    function displayStepBack() {
      if (displayTraceLog.length === 0 || displayCurrentStep <= 1) return;
      displayCurrentStep -= 2;
      if (displayCurrentStep < 0) displayCurrentStep = 0;
      renderDisplayStep(displayCurrentStep);
      displayCurrentStep++;
      setRunnerStatus(`Step ${displayCurrentStep} of ${displayTraceLog.length}`);
    }

    function displayReset() {
      displayInputHistory = [];
      displayTraceStatus = 'ready';
      isAwaitingDisplayInput = false;
      stopDisplayAutoPlay();
      clearRunner();
    }
