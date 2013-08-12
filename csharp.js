'use strict';

Blockly.CSharp = Blockly.Generator.get('CSharp');

Blockly.CSharp.addReservedWords(
    //http://msdn.microsoft.com/en-us/library/x53a06bb.aspx
    'abstract,as,base,bool,break,byte,case,catch,char,checked,class,const,continue,decimal,default,delegate,do,double,else,enum,event,explicit,extern,false,finally,fixed,float,for,foreach,goto,if,implicit,in,int,interface,internal,is,lock,long,namespace,new,null,object,operator,out,override,params,private,protected,public,readonly,ref,return,sbyte,sealed,short,sizeof,stackalloc,static,string,struct,switch,this,throw,true,try,typeof,uint,ulong,unchecked,unsafe,ushort,using,virtual,void,volatile,while'
    );

Blockly.CSharp.init = function() {
  Blockly.CSharp.definitions_ = {};

  if (Blockly.Variables) {
    if (!Blockly.CSharp.variableDB_) {
      Blockly.CSharp.variableDB_ =
          new Blockly.Names(Blockly.CSharp.RESERVED_WORDS_);
    } else {
      Blockly.CSharp.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = 'var ' +
          Blockly.CSharp.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ';';
    }
    Blockly.CSharp.definitions_['variables'] = defvars.join('\n');
  }
};

/* Prepend the generated code with the variable definitions. */
Blockly.CSharp.finish = function(code) {
  var definitions = [];
  for (var name in Blockly.CSharp.definitions_) {
    definitions.push(Blockly.CSharp.definitions_[name]);
  }
  return definitions.join('\n\n') + '\n\n\n' + code;
};

Blockly.CSharp.quote_ = function(val) {
  return goog.string.quote(val);
};

/**
 * Common tasks for generating CSharp from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The CSharp code created for this block.
 * @return {string} CSharp code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.CSharp.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Generator.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Generator.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Generator.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
