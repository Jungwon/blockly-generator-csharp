'use strict';

Blockly.CSharp.lists = {}

Blockly.CSharp.lists_create_empty = function() {
  return ['new List<dynamic>()', Blockly.CSharp.ORDER_ATOMIC];
};

Blockly.CSharp.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.CSharp.valueToCode(this, 'ADD' + n,
        Blockly.CSharp.ORDER_COMMA) || 'null';
  }
  code = 'new List<dynamic> {' + code.join(', ') + '}';
  return [code, Blockly.CSharp.ORDER_ATOMIC];
};