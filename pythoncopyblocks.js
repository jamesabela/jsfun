// --- Blockly Integration Support for Python Code Lab 4.1 ---

// Shared state with pythoncopy.js
window.blocklyWorkspace = null;
window.blocklyWorkspaceSearch = null;
window.isUpdatingBlocklyFromText = false;
window.lastGeneratedBlocklyPython = null;

function getBlocklyPythonVariableName(gen, block, fieldName) {
  const variableId = block.getFieldValue(fieldName);
  if (typeof gen.getVariableName === 'function') {
    return gen.getVariableName(variableId);
  }
  if (gen.nameDB_ && typeof gen.nameDB_.getName === 'function') {
    const variableCategory = Blockly.VARIABLE_CATEGORY_NAME ||
      (Blockly.Names && Blockly.Names.NameType && Blockly.Names.NameType.VARIABLE) ||
      'VARIABLE';
    return gen.nameDB_.getName(variableId, variableCategory);
  }
  const variable = block.workspace && block.workspace.getVariableById(variableId);
  return variable ? variable.name : variableId;
}

function createBlocklyColourField(defaultColor) {
  if (typeof FieldColour === 'function') {
    return new FieldColour(defaultColor);
  }

  return new Blockly.FieldDropdown([
    ["red", "#ff0000"],
    ["orange", "#ff9900"],
    ["yellow", "#ffff00"],
    ["green", "#00cc00"],
    ["blue", "#3366ff"],
    ["purple", "#6633ff"],
    ["pink", "#ff99ff"],
    ["black", "#000000"],
    ["white", "#ffffff"]
  ]);
}

// Custom blocks definition and Python code generation
function registerCustomBlocks() {
  if (typeof Blockly === 'undefined') return;

  const gen = (typeof Blockly.Python !== 'undefined') 
    ? Blockly.Python 
    : (typeof python !== 'undefined' ? python.pythonGenerator : null);
    
  if (!gen) {
    console.error("Blockly Python generator not found.");
    return;
  }

  if (typeof registerFieldColour === 'function') {
    registerFieldColour();
  }
  
  const target = gen.forBlock || gen;
  const orderAtomic = gen.ORDER_ATOMIC;

  const defineBlock = (type, initFn, generatorFn) => {
    Blockly.Blocks[type] = { init: initFn };
    target[type] = generatorFn;
  };

  target.text = function(block) {
    const text = block.getFieldValue('TEXT') || '';
    return [JSON.stringify(text), orderAtomic];
  };

  target.text_print = function(block) {
    const text = gen.valueToCode(block, 'TEXT', gen.ORDER_NONE || orderAtomic) || '""';
    return 'print(' + text + ')\n';
  };

  target.math_change = function(block) {
    const varName = getBlocklyPythonVariableName(gen, block, 'VAR');
    const delta = gen.valueToCode(block, 'DELTA', gen.ORDER_ADDITIVE || orderAtomic) || '0';
    return varName + ' = ' + varName + ' + ' + delta + '\n';
  };

  const inputPromptWithNewline = (block) => {
    const prompt = block.getFieldValue('PROMPT') || '';
    return prompt.endsWith('\n') ? prompt : prompt + '\n';
  };

  defineBlock('comment_line', function() {
    this.appendDummyInput()
        .appendField("comment")
        .appendField(new Blockly.FieldTextInput("explain what happens here"), "TEXT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#6a9955');
    this.setTooltip("Add a Python comment. Comments explain code but do not run.");
  }, function(block) {
    const text = block.getFieldValue('TEXT') || '';
    const singleLineText = text.replace(/[\r\n]+/g, ' ').trim();
    return singleLineText ? '# ' + singleLineText + '\n' : '#\n';
  });

  defineBlock('when_run_clicked', function() {
    this.appendDummyInput()
        .appendField("when 🚩 clicked");
    this.setNextStatement(true, null);
    this.setColour('#ffbf00');
    this.setTooltip("Start of the program when Run is clicked.");
  }, function(block) {
    return '';
  });

  defineBlock('forever_loop', function() {
    this.appendDummyInput()
        .appendField("forever");
    this.appendStatementInput("DO")
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setColour('#ffab19');
    this.setTooltip("Repeat forever.");
  }, function(block) {
    const branch = gen.statementToCode(block, 'DO') || '  pass\n';
    return 'while True:\n' + branch;
  });

  defineBlock('python_for_repeat', function() {
    this.appendValueInput("TIMES")
        .setCheck("Number")
        .appendField("for repeat");
    this.appendDummyInput()
        .appendField("times");
    this.appendStatementInput("DO")
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#5ba55b');
    this.setTooltip("A Python for loop that repeats code a set number of times.");
  }, function(block) {
    const times = gen.valueToCode(block, 'TIMES', orderAtomic) || '10';
    const branch = gen.statementToCode(block, 'DO') || '  pass\n';
    return 'for i in range(' + times + '):\n' + branch;
  });

  defineBlock('python_for_each', function() {
    this.appendDummyInput()
        .appendField("for each")
        .appendField(new Blockly.FieldVariable("item"), "ITEM")
        .appendField("in list")
        .appendField(new Blockly.FieldVariable("items"), "LIST");
    this.appendStatementInput("DO")
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#5ba55b');
    this.setTooltip("Loop through each item in a Python list.");
  }, function(block) {
    const itemName = getBlocklyPythonVariableName(gen, block, 'ITEM');
    const listName = getBlocklyPythonVariableName(gen, block, 'LIST');
    const branch = gen.statementToCode(block, 'DO') || '  pass\n';
    return 'for ' + itemName + ' in ' + listName + ':\n' + branch;
  });

  defineBlock('wait_seconds', function() {
    this.appendValueInput("SECONDS")
        .setCheck("Number")
        .appendField("wait");
    this.appendDummyInput()
        .appendField("seconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#ffab19');
    this.setTooltip("Wait for specified number of seconds.");
  }, function(block) {
    const sec = gen.valueToCode(block, 'SECONDS', orderAtomic) || '1';
    return 'time.sleep(' + sec + ')\n';
  });

  defineBlock('simple_input_text', function() {
    this.appendDummyInput()
        .appendField("input")
        .appendField(new Blockly.FieldTextInput("Enter value"), "PROMPT");
    this.setOutput(true, "String");
    this.setColour('#5ba58c');
    this.setTooltip("Ask for text input.");
  }, function(block) {
    const prompt = inputPromptWithNewline(block);
    return ['input(' + JSON.stringify(prompt) + ')', gen.ORDER_FUNCTION_CALL || orderAtomic];
  });

  defineBlock('simple_input_number', function() {
    this.appendDummyInput()
        .appendField("input number")
        .appendField(new Blockly.FieldTextInput("Enter number"), "PROMPT");
    this.setOutput(true, "Number");
    this.setColour('#5b67a5');
    this.setTooltip("Ask for input and convert it to a number.");
  }, function(block) {
    const prompt = inputPromptWithNewline(block);
    return ['int(input(' + JSON.stringify(prompt) + '))', gen.ORDER_FUNCTION_CALL || orderAtomic];
  });

  defineBlock('python_to_int', function() {
    this.appendValueInput("VALUE")
        .appendField("int");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour('#5b67a5');
    this.setTooltip("Convert a value to a whole number with int(...).");
  }, function(block) {
    const value = gen.valueToCode(block, 'VALUE', orderAtomic) || '0';
    return ['int(' + value + ')', gen.ORDER_FUNCTION_CALL || orderAtomic];
  });

  defineBlock('python_to_float', function() {
    this.appendValueInput("VALUE")
        .appendField("float");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour('#5b67a5');
    this.setTooltip("Convert a value to a decimal number with float(...).");
  }, function(block) {
    const value = gen.valueToCode(block, 'VALUE', orderAtomic) || '0';
    return ['float(' + value + ')', gen.ORDER_FUNCTION_CALL || orderAtomic];
  });

  defineBlock('python_to_string', function() {
    this.appendValueInput("VALUE")
        .appendField("str");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour('#5ba58c');
    this.setTooltip("Convert a value to text with str(...).");
  }, function(block) {
    const value = gen.valueToCode(block, 'VALUE', orderAtomic) || '""';
    return ['str(' + value + ')', gen.ORDER_FUNCTION_CALL || orderAtomic];
  });

  defineBlock('random_integer', function() {
    this.appendValueInput("FROM")
        .setCheck("Number")
        .appendField("random integer from");
    this.appendValueInput("TO")
        .setCheck("Number")
        .appendField("to");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour('#5b67a5');
    this.setTooltip("Pick a random whole number using random.randint(...).");
  }, function(block) {
    const from = gen.valueToCode(block, 'FROM', orderAtomic) || '1';
    const to = gen.valueToCode(block, 'TO', orderAtomic) || '10';
    return ['random.randint(' + from + ', ' + to + ')', gen.ORDER_FUNCTION_CALL || orderAtomic];
  });

  defineBlock('simple_text_join', function() {
    this.appendValueInput("LEFT")
        .appendField("join");
    this.appendValueInput("RIGHT")
        .appendField("and");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour('#5ba58c');
    this.setTooltip("Join two pieces of text, such as a word and a variable.");
  }, function(block) {
    const left = gen.valueToCode(block, 'LEFT', orderAtomic) || '""';
    const right = gen.valueToCode(block, 'RIGHT', orderAtomic) || '""';
    return ['str(' + left + ') + str(' + right + ')', gen.ORDER_ADDITION || orderAtomic];
  });

  defineBlock('turtle_forward', function() {
    this.appendValueInput("DISTANCE")
        .setCheck("Number")
        .appendField("move");
    this.appendDummyInput()
        .appendField("steps");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4c97ff');
    this.setTooltip("Moves turtle forward by distance.");
  }, function(block) {
    const dist = gen.valueToCode(block, 'DISTANCE', orderAtomic) || '0';
    return 'turtle.forward(' + dist + ')\n';
  });

  defineBlock('turtle_backward', function() {
    this.appendValueInput("DISTANCE")
        .setCheck("Number")
        .appendField("move");
    this.appendDummyInput()
        .appendField("steps backward");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4c97ff');
    this.setTooltip("Moves turtle backward by distance.");
  }, function(block) {
    const dist = gen.valueToCode(block, 'DISTANCE', orderAtomic) || '0';
    return 'turtle.backward(' + dist + ')\n';
  });

  defineBlock('turtle_left', function() {
    this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("turn ↶");
    this.appendDummyInput()
        .appendField("degrees");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4c97ff');
    this.setTooltip("Turns turtle left by angle.");
  }, function(block) {
    const angle = gen.valueToCode(block, 'ANGLE', orderAtomic) || '0';
    return 'turtle.left(' + angle + ')\n';
  });

  defineBlock('turtle_right', function() {
    this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField("turn ↷");
    this.appendDummyInput()
        .appendField("degrees");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4c97ff');
    this.setTooltip("Turns turtle right by angle.");
  }, function(block) {
    const angle = gen.valueToCode(block, 'ANGLE', orderAtomic) || '0';
    return 'turtle.right(' + angle + ')\n';
  });

  defineBlock('turtle_circle', function() {
    this.appendValueInput("RADIUS")
        .setCheck("Number")
        .appendField("draw circle radius");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4c97ff');
    this.setTooltip("Draws a circle with radius.");
  }, function(block) {
    const radius = gen.valueToCode(block, 'RADIUS', orderAtomic) || '50';
    return 'turtle.circle(' + radius + ')\n';
  });

  defineBlock('turtle_goto', function() {
    this.appendValueInput("X")
        .setCheck("Number")
        .appendField("turtle goto x");
    this.appendValueInput("Y")
        .setCheck("Number")
        .appendField("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#4c97ff');
    this.setTooltip("Moves turtle to the specified x and y coordinates.");
  }, function(block) {
    const x = gen.valueToCode(block, 'X', orderAtomic) || '0';
    const y = gen.valueToCode(block, 'Y', orderAtomic) || '0';
    return 'turtle.goto(' + x + ', ' + y + ')\n';
  });


  defineBlock('turtle_penup', function() {
    this.appendDummyInput().appendField("pen up");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0fbd8c');
    this.setTooltip("Lifts the pen.");
  }, function(block) {
    return 'turtle.penup()\n';
  });

  defineBlock('turtle_pendown', function() {
    this.appendDummyInput().appendField("pen down");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0fbd8c');
    this.setTooltip("Lowers the pen.");
  }, function(block) {
    return 'turtle.pendown()\n';
  });

  defineBlock('turtle_pencolor', function() {
    const colourField = createBlocklyColourField("#000000");
    this.appendDummyInput()
        .appendField("set pen color to")
        .appendField(colourField, "COLOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0fbd8c');
    this.setTooltip("Sets pen color.");
  }, function(block) {
    const color = block.getFieldValue('COLOR') || '#000000';
    return 'turtle.pencolor(' + JSON.stringify(color) + ')\n';
  });

  defineBlock('turtle_fillcolor', function() {
    const colourField = createBlocklyColourField("#ff0000");
    this.appendDummyInput()
        .appendField("set fill color to")
        .appendField(colourField, "COLOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0fbd8c');
    this.setTooltip("Choose the color used to fill closed turtle shapes.");
  }, function(block) {
    const color = block.getFieldValue('COLOR') || '#ff0000';
    return 'turtle.fillcolor(' + JSON.stringify(color) + ')\n';
  });

  defineBlock('turtle_begin_fill', function() {
    this.appendDummyInput().appendField("begin fill");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0fbd8c');
    this.setTooltip("Start recording the shape to fill.");
  }, function(block) {
    return 'turtle.begin_fill()\n';
  });

  defineBlock('turtle_end_fill', function() {
    this.appendDummyInput().appendField("end fill");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#0fbd8c');
    this.setTooltip("Fill the shape drawn since begin fill.");
  }, function(block) {
    return 'turtle.end_fill()\n';
  });

  defineBlock('list_append', function() {
    this.appendValueInput("VALUE")
        .appendField("append");
    this.appendDummyInput()
        .appendField("to list")
        .appendField(new Blockly.FieldVariable("items"), "LIST");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#745ba5');
    this.setTooltip("Add an item to the end of a Python list.");
  }, function(block) {
    const value = gen.valueToCode(block, 'VALUE', orderAtomic) || 'None';
    const listName = getBlocklyPythonVariableName(gen, block, 'LIST');
    return listName + '.append(' + value + ')\n';
  });
}

// Light and Dark theme setups with startHats enabled
window.lightThemeObj = null;
window.darkThemeObj = null;

function initBlocklyTheme() {
  if (typeof Blockly !== 'undefined') {
    if (!window.lightThemeObj) {
      try {
        window.lightThemeObj = Blockly.Theme.defineTheme('customLightTheme', {
          'base': Blockly.Themes.Classic,
          'startHats': true
        });
      } catch (e) {
        console.warn("Could not define light theme", e);
      }
    }
    if (!window.darkThemeObj) {
      try {
        window.darkThemeObj = Blockly.Theme.defineTheme('customDarkTheme', {
          'base': Blockly.Themes.Classic,
          'startHats': true,
          'componentStyles': {
            'workspaceBackgroundColour': '#151515',
            'toolboxBackgroundColour': '#202020',
            'toolboxForegroundColour': '#f4f4f5',
            'flyoutBackgroundColour': '#1a1a1a',
            'flyoutForegroundColour': '#d4d4d8',
            'scrollbarColour': '#3f3f46',
            'insertionMarkerColour': '#ffffff'
          }
        });
      } catch (e) {
        console.warn("Could not define dark theme", e);
      }
    }
  }
}

function applyBlocklyTheme(isDark) {
  if (window.blocklyWorkspace && typeof Blockly !== 'undefined') {
    initBlocklyTheme();
    if (isDark) {
      if (window.darkThemeObj) {
        window.blocklyWorkspace.setTheme(window.darkThemeObj);
      }
    } else {
      if (window.lightThemeObj) {
        window.blocklyWorkspace.setTheme(window.lightThemeObj);
      } else {
        window.blocklyWorkspace.setTheme(Blockly.Themes.Classic);
      }
    }
  }
}

// Blockly Toolbox XML Configuration
window.toolboxXml = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
  <category name="Search" kind="search"></category>
  <category name="Events" colour="#ffbf00">
    <block type="when_run_clicked"></block>
  </category>
  <category name="Comments" colour="#6a9955">
    <block type="comment_line"></block>
  </category>
  <category name="Logic" colour="#5b80a5">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
  </category>
  <category name="Loops" colour="#5ba55b">
    <block type="forever_loop"></block>
    <block type="python_for_repeat">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="python_for_each"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="controls_whileUntil"></block>
    <block type="wait_seconds">
      <value name="SECONDS">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Math" colour="#5b67a5">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
    <block type="simple_input_number"></block>
    <block type="python_to_int">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT">5</field>
        </shadow>
      </value>
    </block>
    <block type="python_to_float">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT">3.14</field>
        </shadow>
      </value>
    </block>
    <block type="math_arithmetic">
      <value name="A">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="B">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Random" colour="#5b67a5">
    <block type="random_integer">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Text" colour="#5ba58c">
    <block type="text"></block>
    <block type="simple_input_text"></block>
    <block type="python_to_string">
      <value name="VALUE">
        <shadow type="math_number">
          <field name="NUM">42</field>
        </shadow>
      </value>
    </block>
    <block type="simple_text_join">
      <value name="LEFT">
        <shadow type="text">
          <field name="TEXT">Hello </field>
        </shadow>
      </value>
      <value name="RIGHT">
        <shadow type="text">
          <field name="TEXT">world</field>
        </shadow>
      </value>
    </block>
    <block type="text_print">
      <value name="TEXT">
        <shadow type="text">
          <field name="TEXT">hello</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Variables" custom="VARIABLE" colour="#a55b80"></category>
  <category name="Functions" custom="PROCEDURE" colour="#995ba5"></category>
  <category name="Lists" colour="#745ba5">
    <block type="lists_create_with">
      <mutation items="0"></mutation>
    </block>
    <block type="lists_create_with"></block>
    <block type="lists_repeat">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf"></block>
    <block type="lists_getIndex"></block>
    <block type="lists_setIndex"></block>
    <block type="list_append">
      <value name="VALUE">
        <shadow type="text">
          <field name="TEXT">new item</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Turtle" colour="#a58a5b">
    <block type="turtle_forward">
      <value name="DISTANCE">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    <block type="turtle_backward">
      <value name="DISTANCE">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    <block type="turtle_left">
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    <block type="turtle_right">
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    <block type="turtle_circle">
      <value name="RADIUS">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>
    <block type="turtle_goto">
      <value name="X">
        <shadow type="math_number">
          <field name="NUM">0</field>
        </shadow>
      </value>
      <value name="Y">
        <shadow type="math_number">
          <field name="NUM">0</field>
        </shadow>
      </value>
    </block>
    <block type="turtle_penup"></block>
    <block type="turtle_pendown"></block>
    <block type="turtle_begin_fill"></block>
    <block type="turtle_end_fill"></block>
    <block type="turtle_pencolor">
      <field name="COLOR">#000000</field>
    </block>
    <block type="turtle_fillcolor">
      <field name="COLOR">#ff0000</field>
    </block>
  </category>
</xml>
`;

function getBlocklyToolboxConfig() {
  if (typeof Blockly !== 'undefined' &&
      Blockly.registry &&
      Blockly.registry.Type &&
      Blockly.registry.hasItem &&
      Blockly.registry.hasItem(Blockly.registry.Type.TOOLBOX_ITEM, 'search')) {
    return window.toolboxXml;
  }

  return window.toolboxXml.replace(/\s*<category name="Search" kind="search"><\/category>/, '');
}

function getWorkspacePythonCode() {
  if (!window.blocklyWorkspace) return '';
  const gen = (typeof Blockly.Python !== 'undefined') 
    ? Blockly.Python 
    : (typeof python !== 'undefined' ? python.pythonGenerator : null);
  if (!gen) return '';
  
  let code = gen.workspaceToCode(window.blocklyWorkspace);
  code = normalizeGeneratedPythonQuotes(code);
  code = ensureCommentOnlyPythonSuitesHavePass(code);
  const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let hasTurtleBlocks = false;
  let hasWaitBlocks = false;
  let hasRandomBlocks = false;
  const changedVariableNames = new Set();
  const blocks = window.blocklyWorkspace.getAllBlocks(false);
  for (const b of blocks) {
    if (b.type.startsWith('turtle_')) {
      hasTurtleBlocks = true;
    }
    if (b.type === 'wait_seconds') {
      hasWaitBlocks = true;
    }
    if (b.type === 'random_integer') {
      hasRandomBlocks = true;
    }
    if (b.type === 'math_change') {
      changedVariableNames.add(getBlocklyPythonVariableName(gen, b, 'VAR'));
    }
  }

  for (const varName of changedVariableNames) {
    const initPattern = new RegExp('(^|\\n)' + escapeRegExp(varName) + ' = None(?=\\n|$)');
    code = code.replace(initPattern, '$1' + varName + ' = 0');
  }
  code = code.replace(
    /^([A-Za-z_][A-Za-z0-9_]*) = None(?=[\s\S]*^\1 = \1 \+ )/gm,
    '$1 = 0'
  );
  
  let prepend = '';
  if (hasTurtleBlocks && !code.includes('import turtle') && !code.includes('from turtle import')) {
    prepend += 'import turtle\n';
  }
  if (hasWaitBlocks && !code.includes('import time') && !code.includes('from time import')) {
    prepend += 'import time\n';
  }
  if (hasRandomBlocks && !code.includes('import random') && !code.includes('from random import')) {
    prepend += 'import random\n';
  }
  return prepend + code;
}

function normalizeGeneratedPythonQuotes(code) {
  return code.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, function(match, content) {
    if (content.includes('"')) return match;
    return '"' + content.replace(/\\"/g, '"').replace(/"/g, '\\"') + '"';
  });
}

function ensureCommentOnlyPythonSuitesHavePass(code) {
  const lines = code.split('\n');
  const result = lines.slice();
  let insertionOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim().endsWith(':')) continue;

    const parentIndent = line.match(/^ */)[0].length;
    let hasIndentedLine = false;
    let hasExecutableLine = false;
    let childIndent = parentIndent + 2;
    let insertIndex = i + 1;

    for (let j = i + 1; j < lines.length; j++) {
      const candidate = lines[j];
      const trimmed = candidate.trim();
      if (!trimmed) {
        if (hasIndentedLine) {
          insertIndex = j + 1;
        }
        continue;
      }

      const indent = candidate.match(/^ */)[0].length;
      if (indent <= parentIndent) break;

      if (!hasIndentedLine) {
        childIndent = indent;
      }
      hasIndentedLine = true;
      insertIndex = j + 1;

      if (!trimmed.startsWith('#')) {
        hasExecutableLine = true;
        break;
      }
    }

    if (hasIndentedLine && !hasExecutableLine) {
      result.splice(insertIndex + insertionOffset, 0, ' '.repeat(childIndent) + 'pass');
      insertionOffset++;
    }
  }

  return result.join('\n');
}

function initBlockly() {
  if (window.blocklyWorkspace) return;
  registerCustomBlocks();
  initBlocklyTheme();

  const blocklyDiv = document.getElementById('blocklyDiv');
  window.blocklyWorkspace = Blockly.inject(blocklyDiv, {
    toolbox: getBlocklyToolboxConfig(),
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    trashcan: true
  });

  const isDark = document.getElementById('dark-mode').checked;
  applyBlocklyTheme(isDark);

  const fontSize = Number(document.getElementById('font-size').value) || 16;
  window.blocklyWorkspace.setScale(fontSize / 16);

  window.blocklyWorkspace.addChangeListener(onBlocklyWorkspaceChange);
  initBlocklyWorkspaceSearch();
}

function initBlocklyWorkspaceSearch() {
  if (!window.blocklyWorkspace || window.blocklyWorkspaceSearch) return;
  if (typeof WorkspaceSearch === 'undefined') return;

  window.blocklyWorkspaceSearch = new WorkspaceSearch(window.blocklyWorkspace);
  window.blocklyWorkspaceSearch.init();
  if (typeof window.blocklyWorkspaceSearch.setSearchPlaceholder === 'function') {
    window.blocklyWorkspaceSearch.setSearchPlaceholder('Search workspace blocks');
  }
}

function onBlocklyWorkspaceChange(event) {
  if (window.currentAppMode !== 'blocks') return;
  if (window.isUpdatingBlocklyFromText) return;

  const code = getWorkspacePythonCode();
  window.lastGeneratedBlocklyPython = code;

  if (typeof window.updateBlocksCodePreview === 'function') {
    window.updateBlocksCodePreview(code);
  }

  const editor = document.getElementById('editor');
  if (editor) {
    editor.value = code;
    const inputEvent = new Event('input', { bubbles: true });
    editor.dispatchEvent(inputEvent);
  }
}

function checkCodeConvertibility(code) {
  const lines = code.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  if (lines.length === 0) return true;

  for (const line of lines) {
    const isSupported = 
      line.startsWith('import ') ||
      line.startsWith('from ') ||
      line === 'else:' ||
      line.startsWith('elif ') ||
      line.startsWith('if ') ||
      line.startsWith('for ') ||
      line.startsWith('while ') ||
      line.startsWith('print(') ||
      line.match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/) ||
      line.match(/^[a-zA-Z_][a-zA-Z0-9_]*\.append\(/) ||
      line.match(/^(?:turtle\.)?(forward|fd|backward|bk|left|lt|right|rt|circle|pencolor|fillcolor|begin_fill|end_fill|penup|up|pu|pendown|down|pd|goto|setpos|setposition)\(/) ||
      line.match(/^(?:time\.)?sleep\(/) ||
      line === 'pass';

    if (!isSupported) {
      return false;
    }
  }
  return true;
}

function updateBlocksButtonState() {
  const btn = document.getElementById('tryBlocksButton');
  if (!btn) return;

  btn.disabled = false;
  btn.style.opacity = '1';
  btn.style.cursor = 'pointer';
  btn.title = "Create a blank Blocks file in a new tab";
}

function getWrappedCallArgument(exprString, functionName) {
  const expr = exprString.trim();
  const prefix = functionName + '(';
  if (!expr.startsWith(prefix) || !expr.endsWith(')')) return null;

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
      if (depth === 0 && i !== expr.length - 1) return null;
    }
  }

  return depth === 0 ? expr.slice(prefix.length, -1) : null;
}

function splitTopLevelArguments(argsString) {
  const args = [];
  let start = 0;
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = 0; i < argsString.length; i++) {
    const ch = argsString[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--;
    } else if (ch === ',' && depth === 0) {
      args.push(argsString.slice(start, i).trim());
      start = i + 1;
    }
  }

  args.push(argsString.slice(start).trim());
  return args;
}

function findTopLevelOperator(exprString, operators) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = 0; i < exprString.length; i++) {
    const ch = exprString[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth--;
    } else if (depth === 0 && operators.includes(ch)) {
      return i;
    }
  }
  return -1;
}

function parseExpression(exprString, workspace) {
  exprString = exprString.trim();

  const isQuotedText = (value) =>
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));

  const unwrapStr = (value) => getWrappedCallArgument(value, 'str') || value;

  const plusIndex = findTopLevelOperator(exprString, ['+']);
  if (plusIndex > -1) {
    const rawLeft = exprString.slice(0, plusIndex).trim();
    const rawRight = exprString.slice(plusIndex + 1).trim();
    const left = unwrapStr(rawLeft);
    const right = unwrapStr(rawRight);
    const isTextJoin = isQuotedText(left.trim()) ||
      isQuotedText(right.trim()) ||
      getWrappedCallArgument(rawLeft, 'str') !== null ||
      getWrappedCallArgument(rawRight, 'str') !== null;

    if (isTextJoin) {
      const leftBlock = parseExpression(left, workspace);
      const rightBlock = parseExpression(right, workspace);
      if (leftBlock && rightBlock) {
        const block = workspace.newBlock('simple_text_join');
        block.getInput('LEFT').connection.connect(leftBlock.outputConnection);
        block.getInput('RIGHT').connection.connect(rightBlock.outputConnection);
        return block;
      }
    }
  }

  const numberInputInner = getWrappedCallArgument(exprString, 'int') ||
    getWrappedCallArgument(exprString, 'float');
  const inputInner = getWrappedCallArgument(numberInputInner || exprString, 'input');
  if (inputInner !== null) {
    const promptText = inputInner.trim();
    const promptTextContent = ((promptText.startsWith('"') || promptText.startsWith("'")) ? promptText.slice(1, -1) : promptText)
      .replace(/\\n$/, '');
    const block = workspace.newBlock(numberInputInner !== null ? 'simple_input_number' : 'simple_input_text');
    block.setFieldValue(promptTextContent, 'PROMPT');
    return block;
  }

  const randomIntInner = getWrappedCallArgument(exprString, 'random.randint') ||
    getWrappedCallArgument(exprString, 'randint');
  if (randomIntInner !== null) {
    const args = splitTopLevelArguments(randomIntInner);
    if (args.length === 2) {
      const block = workspace.newBlock('random_integer');
      const fromBlock = parseExpression(args[0], workspace);
      const toBlock = parseExpression(args[1], workspace);
      if (fromBlock) {
        block.getInput('FROM').connection.connect(fromBlock.outputConnection);
      }
      if (toBlock) {
        block.getInput('TO').connection.connect(toBlock.outputConnection);
      }
      return block;
    }
  }

  const conversionTypes = [
    { fn: 'int', blockType: 'python_to_int', input: 'VALUE' },
    { fn: 'float', blockType: 'python_to_float', input: 'VALUE' },
    { fn: 'str', blockType: 'python_to_string', input: 'VALUE' }
  ];
  for (const conversion of conversionTypes) {
    const inner = getWrappedCallArgument(exprString, conversion.fn);
    if (inner !== null) {
      const block = workspace.newBlock(conversion.blockType);
      const innerBlock = parseExpression(inner, workspace);
      if (innerBlock) {
        block.getInput(conversion.input).connection.connect(innerBlock.outputConnection);
      }
      return block;
    }
  }

  const compIndex = findTopLevelOperator(exprString, ['<', '>', '=']);
  const compMatch = exprString.match(/^(.+?)\s*(==|!=|<=|>=|<|>)\s*(.+)$/);
  if (compIndex > -1 && compMatch) {
    const leftBlock = parseExpression(compMatch[1], workspace);
    const op = compMatch[2];
    const rightBlock = parseExpression(compMatch[3], workspace);
    if (leftBlock && rightBlock) {
      const block = workspace.newBlock('logic_compare');
      let opValue = 'EQ';
      if (op === '!=') opValue = 'NEQ';
      else if (op === '<') opValue = 'LT';
      else if (op === '<=') opValue = 'LTE';
      else if (op === '>') opValue = 'GT';
      else if (op === '>=') opValue = 'GTE';
      block.setFieldValue(opValue, 'OP');
      block.getInput('A').connection.connect(leftBlock.outputConnection);
      block.getInput('B').connection.connect(rightBlock.outputConnection);
      return block;
    }
  }
  
  if (isQuotedText(exprString)) {
    const textVal = exprString.slice(1, -1);
    const block = workspace.newBlock('text');
    block.setFieldValue(textVal, 'TEXT');
    return block;
  }
  if (/^-?\d+(\.\d+)?$/.test(exprString)) {
    const numVal = Number(exprString);
    const block = workspace.newBlock('math_number');
    block.setFieldValue(numVal, 'NUM');
    return block;
  }
  if (exprString === 'True' || exprString === 'False') {
    const block = workspace.newBlock('logic_boolean');
    block.setFieldValue(exprString.toUpperCase(), 'BOOL');
    return block;
  }
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(exprString)) {
    const block = workspace.newBlock('variables_get');
    let variable = workspace.getVariable(exprString);
    if (!variable) {
      variable = workspace.createVariable(exprString);
    }
    block.setFieldValue(variable.getId(), 'VAR');
    return block;
  }
  const mathIndex = findTopLevelOperator(exprString, ['+', '-', '*', '/']);
  if (mathIndex > -1) {
    const leftBlock = parseExpression(exprString.slice(0, mathIndex), workspace);
    const op = exprString[mathIndex];
    const rightBlock = parseExpression(exprString.slice(mathIndex + 1), workspace);
    if (leftBlock && rightBlock) {
      const block = workspace.newBlock('math_arithmetic');
      let opValue = 'ADD';
      if (op === '-') opValue = 'MINUS';
      else if (op === '*') opValue = 'MULTIPLY';
      else if (op === '/') opValue = 'DIVIDE';
      block.setFieldValue(opValue, 'OP');
      block.getInput('A').connection.connect(leftBlock.outputConnection);
      block.getInput('B').connection.connect(rightBlock.outputConnection);
      return block;
    }
  }

  const block = workspace.newBlock('text');
  block.setFieldValue(exprString, 'TEXT');
  return block;
}

function parseNodeToBlock(node, workspace) {
  if (node.text.startsWith('#')) {
    const block = workspace.newBlock('comment_line');
    block.setFieldValue(node.text.slice(1).replace(/^ /, ''), 'TEXT');
    return block;
  }

  const printMatch = node.text.match(/^print\((.*)\)$/);
  if (printMatch) {
    const block = workspace.newBlock('text_print');
    const expr = printMatch[1].trim();
    if (expr) {
      const exprBlock = parseExpression(expr, workspace);
      if (exprBlock) {
        block.getInput('TEXT').connection.connect(exprBlock.outputConnection);
      }
    }
    return block;
  }

  const appendMatch = node.text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.append\((.*)\)$/);
  if (appendMatch) {
    const listName = appendMatch[1];
    const expr = appendMatch[2].trim();
    const block = workspace.newBlock('list_append');
    let variable = workspace.getVariable(listName);
    if (!variable) {
      variable = workspace.createVariable(listName);
    }
    block.setFieldValue(variable.getId(), 'LIST');
    if (expr) {
      const exprBlock = parseExpression(expr, workspace);
      if (exprBlock) {
        block.getInput('VALUE').connection.connect(exprBlock.outputConnection);
      }
    }
    return block;
  }
  
  const assignMatch = node.text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
  if (assignMatch) {
    const varName = assignMatch[1];
    const expr = assignMatch[2].trim();
    const block = workspace.newBlock('variables_set');
    let variable = workspace.getVariable(varName);
    if (!variable) {
      variable = workspace.createVariable(varName);
    }
    block.setFieldValue(variable.getId(), 'VAR');
    const exprBlock = parseExpression(expr, workspace);
    if (exprBlock) {
      block.getInput('VALUE').connection.connect(exprBlock.outputConnection);
    }
    return block;
  }
  
  const whileMatch = node.text.match(/^while\s+(.+):$/);
  if (whileMatch) {
    const cond = whileMatch[1].trim();
    let block;
    if (cond === 'True') {
      block = workspace.newBlock('forever_loop');
      if (node.children.length > 0) {
        const bodyBlock = convertNodesToBlocks(node.children, workspace);
        if (bodyBlock) {
          block.getInput('DO').connection.connect(bodyBlock.previousConnection);
        }
      }
    } else {
      block = workspace.newBlock('controls_whileUntil');
      block.setFieldValue('WHILE', 'MODE');
      const condBlock = parseExpression(cond, workspace);
      if (condBlock) {
        block.getInput('BOOL').connection.connect(condBlock.outputConnection);
      }
      if (node.children.length > 0) {
        const bodyBlock = convertNodesToBlocks(node.children, workspace);
        if (bodyBlock) {
          block.getInput('DO').connection.connect(bodyBlock.previousConnection);
        }
      }
    }
    return block;
  }
  
  const forRangeMatch = node.text.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\((.+)\):$/);
  if (forRangeMatch) {
    const rangeArgs = forRangeMatch[2].split(',').map(s => s.trim());
    const block = workspace.newBlock('python_for_repeat');
    let timesVal = 10;
    if (rangeArgs.length === 1) {
      timesVal = Number(rangeArgs[0]) || 10;
    } else if (rangeArgs.length === 2) {
      const start = Number(rangeArgs[0]) || 0;
      const stop = Number(rangeArgs[1]) || 10;
      timesVal = stop - start;
    }
    const timesBlock = workspace.newBlock('math_number');
    timesBlock.setFieldValue(timesVal, 'NUM');
    block.getInput('TIMES').connection.connect(timesBlock.outputConnection);
    if (node.children.length > 0) {
      const bodyBlock = convertNodesToBlocks(node.children, workspace);
      if (bodyBlock) {
        block.getInput('DO').connection.connect(bodyBlock.previousConnection);
      }
    }
    return block;
  }

  const forEachMatch = node.text.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([a-zA-Z_][a-zA-Z0-9_]*):$/);
  if (forEachMatch) {
    const itemName = forEachMatch[1];
    const listName = forEachMatch[2];
    const block = workspace.newBlock('python_for_each');
    let itemVariable = workspace.getVariable(itemName);
    if (!itemVariable) {
      itemVariable = workspace.createVariable(itemName);
    }
    let listVariable = workspace.getVariable(listName);
    if (!listVariable) {
      listVariable = workspace.createVariable(listName);
    }
    block.setFieldValue(itemVariable.getId(), 'ITEM');
    block.setFieldValue(listVariable.getId(), 'LIST');
    if (node.children.length > 0) {
      const bodyBlock = convertNodesToBlocks(node.children, workspace);
      if (bodyBlock) {
        block.getInput('DO').connection.connect(bodyBlock.previousConnection);
      }
    }
    return block;
  }

  const turtleMatch = node.text.match(/^(?:turtle\.)?(forward|fd|backward|bk|left|lt|right|rt|circle|pencolor|fillcolor)\((.*)\)$/);
  if (turtleMatch) {
    const cmd = turtleMatch[1];
    const arg = turtleMatch[2].trim();
    let blockType = '';
    let inputName = '';
    
    if (cmd === 'forward' || cmd === 'fd') { blockType = 'turtle_forward'; inputName = 'DISTANCE'; }
    else if (cmd === 'backward' || cmd === 'bk') { blockType = 'turtle_backward'; inputName = 'DISTANCE'; }
    else if (cmd === 'left' || cmd === 'lt') { blockType = 'turtle_left'; inputName = 'ANGLE'; }
    else if (cmd === 'right' || cmd === 'rt') { blockType = 'turtle_right'; inputName = 'ANGLE'; }
    else if (cmd === 'circle') { blockType = 'turtle_circle'; inputName = 'RADIUS'; }
    else if (cmd === 'pencolor') { blockType = 'turtle_pencolor'; }
    else if (cmd === 'fillcolor') { blockType = 'turtle_fillcolor'; }
    
    if (blockType) {
      const block = workspace.newBlock(blockType);
      if ((cmd === 'pencolor' || cmd === 'fillcolor') && arg) {
        const color = arg.trim();
        const isQuoted = (color.startsWith('"') && color.endsWith('"')) ||
          (color.startsWith("'") && color.endsWith("'"));
        if (isQuoted) {
          block.setFieldValue(color.slice(1, -1), 'COLOR');
        }
      }
      if (inputName && arg) {
        const argBlock = parseExpression(arg, workspace);
        if (argBlock) {
          block.getInput(inputName).connection.connect(argBlock.outputConnection);
        }
      }
      return block;
    }
  }

  const gotoMatch = node.text.match(/^(?:turtle\.)?(goto|setpos|setposition)\((.*)\)$/);
  if (gotoMatch) {
    const args = splitTopLevelArguments(gotoMatch[2]);
    if (args.length === 2) {
      const block = workspace.newBlock('turtle_goto');
      const xBlock = parseExpression(args[0], workspace);
      const yBlock = parseExpression(args[1], workspace);
      if (xBlock) {
        block.getInput('X').connection.connect(xBlock.outputConnection);
      }
      if (yBlock) {
        block.getInput('Y').connection.connect(yBlock.outputConnection);
      }
      return block;
    }
  }

  const penupMatch = node.text.match(/^(?:turtle\.)?(penup|up|pu)\(\)$/);
  if (penupMatch) {
    return workspace.newBlock('turtle_penup');
  }
  const pendownMatch = node.text.match(/^(?:turtle\.)?(pendown|down|pd)\(\)$/);
  if (pendownMatch) {
    return workspace.newBlock('turtle_pendown');
  }
  const beginFillMatch = node.text.match(/^(?:turtle\.)?begin_fill\(\)$/);
  if (beginFillMatch) {
    return workspace.newBlock('turtle_begin_fill');
  }
  const endFillMatch = node.text.match(/^(?:turtle\.)?end_fill\(\)$/);
  if (endFillMatch) {
    return workspace.newBlock('turtle_end_fill');
  }

  const sleepMatch = node.text.match(/^(?:time\.)?sleep\((.*)\)$/);
  if (sleepMatch) {
    const block = workspace.newBlock('wait_seconds');
    const arg = sleepMatch[1].trim();
    if (arg) {
      const argBlock = parseExpression(arg, workspace);
      if (argBlock) {
        block.getInput('SECONDS').connection.connect(argBlock.outputConnection);
      }
    }
    return block;
  }

  return null;
}

function convertNodesToBlocks(nodes, workspace) {
  let firstBlock = null;
  let currentBlock = null;
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    const ifMatch = node.text.match(/^if\s+(.+):$/);
    if (ifMatch) {
      const block = workspace.newBlock('controls_if');
      const cond = ifMatch[1].trim();
      const condBlock = parseExpression(cond, workspace);
      if (condBlock) {
        block.getInput('IF0').connection.connect(condBlock.outputConnection);
      }
      
      if (node.children.length > 0) {
        const bodyBlock = convertNodesToBlocks(node.children, workspace);
        if (bodyBlock) {
          block.getInput('DO0').connection.connect(bodyBlock.previousConnection);
        }
      }
      
      let elseIfCount = 0;
      let hasElse = false;
      let lookAheadIndex = i + 1;
      
      while (lookAheadIndex < nodes.length) {
        const nextNode = nodes[lookAheadIndex];
        const elifMatch = nextNode.text.match(/^elif\s+(.+):$/);
        const elseMatch = nextNode.text.match(/^else\s*:$/);
        
        if (elifMatch) {
          elseIfCount++;
          const mutationXml = Blockly.utils.xml.createElement('mutation');
          mutationXml.setAttribute('elseif', elseIfCount.toString());
          mutationXml.setAttribute('else', hasElse ? '1' : '0');
          block.domToMutation(mutationXml);
          
          const elifCond = elifMatch[1].trim();
          const elifCondBlock = parseExpression(elifCond, workspace);
          if (elifCondBlock) {
            block.getInput('IF' + elseIfCount).connection.connect(elifCondBlock.outputConnection);
          }
          
          if (nextNode.children.length > 0) {
            const elifBodyBlock = convertNodesToBlocks(nextNode.children, workspace);
            if (elifBodyBlock) {
              block.getInput('DO' + elseIfCount).connection.connect(elifBodyBlock.previousConnection);
            }
          }
          i = lookAheadIndex;
          lookAheadIndex++;
        } else if (elseMatch) {
          hasElse = true;
          const mutationXml = Blockly.utils.xml.createElement('mutation');
          mutationXml.setAttribute('elseif', elseIfCount.toString());
          mutationXml.setAttribute('else', '1');
          block.domToMutation(mutationXml);
          
          if (nextNode.children.length > 0) {
            const elseBodyBlock = convertNodesToBlocks(nextNode.children, workspace);
            if (elseBodyBlock) {
              block.getInput('ELSE').connection.connect(elseBodyBlock.previousConnection);
            }
          }
          i = lookAheadIndex;
          break;
        } else {
          break;
        }
      }
      
      if (!firstBlock) {
        firstBlock = block;
        currentBlock = block;
      } else {
        if (currentBlock.nextConnection && block.previousConnection) {
          currentBlock.nextConnection.connect(block.previousConnection);
          currentBlock = block;
        }
      }
      continue;
    }
    
    const block = parseNodeToBlock(node, workspace);
    if (!block) continue;
    
    if (!firstBlock) {
      firstBlock = block;
      currentBlock = block;
    } else {
      if (currentBlock.nextConnection && block.previousConnection) {
        currentBlock.nextConnection.connect(block.previousConnection);
        currentBlock = block;
      }
    }
  }
  return firstBlock;
}

function convertPythonToWorkspace(code, workspace) {
  const targetWorkspace = workspace;
  const conversionWorkspace = new Blockly.Workspace();
  let converted = false;

  const whenRunBlock = conversionWorkspace.newBlock('when_run_clicked');
  if (whenRunBlock) {
    whenRunBlock.moveBy(20, 20);
  }

  const lines = code.split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) return null;

      const indent = line.match(/^ */)[0].length;
      return { text: trimmed, indent: indent };
    })
    .filter(x => x !== null);

  if (lines.length === 0) {
    converted = true;
  } else {
    const root = { children: [] };
    const stack = [{ indent: -1, node: root }];

    for (const line of lines) {
      while (stack.length > 1 && stack[stack.length - 1].indent >= line.indent) {
        stack.pop();
      }

      const parentNode = stack[stack.length - 1].node;
      const node = { text: line.text, children: [] };
      parentNode.children.push(node);

      if (line.text.endsWith(':')) {
        stack.push({ indent: line.indent, node: node });
      }
    }

    const firstBlock = convertNodesToBlocks(root.children, conversionWorkspace);
    if (firstBlock && whenRunBlock) {
      if (whenRunBlock.nextConnection && firstBlock.previousConnection) {
        whenRunBlock.nextConnection.connect(firstBlock.previousConnection);
      }
    }
    converted = Boolean(firstBlock);
  }

  const xml = Blockly.Xml.workspaceToDom(conversionWorkspace);
  targetWorkspace.clear();
  Blockly.Xml.domToWorkspace(xml, targetWorkspace);
  renderAllWorkspaceBlocks(targetWorkspace);
  conversionWorkspace.dispose();
  return converted;
}

function renderAllWorkspaceBlocks(workspace) {
  if (!workspace) return;

  const blocks = workspace.getAllBlocks(false);
  for (const block of blocks) {
    try {
      if (typeof block.getSvgRoot === 'function' && !block.getSvgRoot()) {
        block.initSvg();
      }
      if (typeof block.render === 'function') {
        block.render();
      }
    } catch (err) {
      console.warn('Could not render Blockly block:', err);
    }
  }

  workspace.render();
  if (typeof workspace.scrollCenter === 'function') {
    workspace.scrollCenter();
  }
}
