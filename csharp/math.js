'use strict';

Blockly.CSharp.math = {};

Blockly.CSharp.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getTitleValue('NUM'));
  return [code, Blockly.CSharp.ORDER_ATOMIC];
};

Blockly.CSharp.math_arithmetic = function() {
  // Basic arithmetic operators, and power.
  var mode = this.getTitleValue('OP');
  var tuple = Blockly.CSharp.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.CSharp.valueToCode(this, 'A', order) || '0.0';
  var argument1 = Blockly.CSharp.valueToCode(this, 'B', order) || '0.0';
  var code;
  // Power in CSharp requires a special case since it has no operator.
  if (!operator) {
    code = 'Math.Pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.CSharp.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.CSharp.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.CSharp.ORDER_ADDITION],
  MINUS: [' - ', Blockly.CSharp.ORDER_SUBTRACTION],
  MULTIPLY: [' * ', Blockly.CSharp.ORDER_MULTIPLICATION],
  DIVIDE: [' / ', Blockly.CSharp.ORDER_DIVISION],
  POWER: [null, Blockly.CSharp.ORDER_COMMA]  // Handle power separately.
};

Blockly.CSharp.math_single = function() {
  // Math operators with single operand.
  var operator = this.getTitleValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.CSharp.valueToCode(this, 'NUM',
        Blockly.CSharp.ORDER_UNARY_NEGATION) || '0.0';
    if (arg[0] == '-') {
      // --3 is not allowed
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.CSharp.ORDER_UNARY_NEGATION];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.CSharp.valueToCode(this, 'NUM',
        Blockly.CSharp.ORDER_DIVISION) || '0';
  } else {
    arg = Blockly.CSharp.valueToCode(this, 'NUM',
        Blockly.CSharp.ORDER_NONE) || '0.0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'Math.Abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'Math.Sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.Log(' + arg + ')';
      break;
    case 'LOG10':
      code = 'Math.Log10(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.Exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'Math.Pow(' + arg + ', 10)';
      break;
    case 'ROUND':
      code = 'Math.Round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'Math.Ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'Math.Floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'Math.Sin(' + arg + ' / 180 * Math.PI)';
      break;
    case 'COS':
      code = 'Math.Cos(' + arg + ' / 180 * Math.PI)';
      break;
    case 'TAN':
      code = 'Math.Tan(' + arg + ' / 180 * Math.PI)';
      break;
  }
  if (code) {
    return [code, Blockly.CSharp.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ASIN':
      code = 'Math.Asin(' + arg + ') / Math.PI * 180';
      break;
    case 'ACOS':
      code = 'Math.Acos(' + arg + ') / Math.PI * 180';
      break;
    case 'ATAN':
      code = 'Math.Atan(' + arg + ') / Math.PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.CSharp.ORDER_DIVISION];
};

Blockly.CSharp.math_constant = function() {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var constant = this.getTitleValue('CONSTANT');
  return Blockly.CSharp.math_constant.CONSTANTS[constant];
};

Blockly.CSharp.math_constant.CONSTANTS = {
  PI: ['Math.PI', Blockly.CSharp.ORDER_MEMBER],
  E: ['Math.E', Blockly.CSharp.ORDER_MEMBER],
  GOLDEN_RATIO: ['(1 + Math.Sqrt(5)) / 2', Blockly.CSharp.ORDER_DIVISION],
  SQRT2: ['Math.Sqrt(2)', Blockly.CSharp.ORDER_MEMBER],
  SQRT1_2: ['Math.Sqrt(1.0 / 2)', Blockly.CSharp.ORDER_MEMBER],
  INFINITY: ['double.PositiveInfinity', Blockly.CSharp.ORDER_ATOMIC]
};

Blockly.CSharp.math_number_property = function() {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.CSharp.valueToCode(this, 'NUMBER_TO_CHECK',
      Blockly.CSharp.ORDER_MODULUS) || 'double.NaN';
  var dropdown_property = this.getTitleValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    if (!Blockly.CSharp.definitions_['isPrime']) {
      var functionName = Blockly.CSharp.variableDB_.getDistinctName(
          'isPrime', Blockly.Generator.NAME_TYPE);
      Blockly.CSharp.logic_prime= functionName;
      var func = [];
      func.push('bool ' + functionName + '(double n) {');
      func.push('  // http://en.wikipedia.org/wiki/Primality_test#Naive_methods');
      func.push('  if (n == 2.0 || n == 3.0)');
      func.push('    return true;');
      func.push('  // False if n is NaN, negative, is 1, or not whole. And false if n is divisible by 2 or 3.');
      func.push('  if (double.IsNaN(n) || n <= 1 || n % 1 != 0.0 || n % 2 == 0.0 || n % 3 == 0.0)');
      func.push('    return false;');
      func.push('  // Check all the numbers of form 6k +/- 1, up to sqrt(n).');
      func.push('  for (var x = 6; x <= Math.Sqrt(n) + 1; x += 6) {');
      func.push('    if (n % (x - 1) == 0.0 || n % (x + 1) == 0.0)');
      func.push('      return false;');
      func.push('  }');
      func.push('  return true;');
      func.push('}');
      Blockly.CSharp.definitions_['isPrime'] = func.join('\n');
    }
    code = Blockly.CSharp.logic_prime + '(' + number_to_check + ')';
    return [code, Blockly.CSharp.ORDER_FUNCTION_CALL];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.CSharp.valueToCode(this, 'DIVISOR',
          Blockly.CSharp.ORDER_MODULUS) || 'double.NaN';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.CSharp.ORDER_EQUALITY];
};

Blockly.CSharp.math_change = function() {
  // Add to a variable in place.
  var argument0 = Blockly.CSharp.valueToCode(this, 'DELTA',
      Blockly.CSharp.ORDER_ADDITION) || '0.0';
  var varName = Blockly.CSharp.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n'; // TODO
};

// Rounding functions have a single operand.
Blockly.CSharp.math_round = Blockly.CSharp.math_single;
// Trigonometry functions have a single operand.
Blockly.CSharp.math_trig = Blockly.CSharp.math_single;

