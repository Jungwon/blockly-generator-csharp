blockly-generator-csharp
========================

Generate C# code from Blockly blocks.  See [the Blockly Wiki](http://code.google.com/p/blockly/wiki/LanguageGenerators) for more information.

Usage
-----
1. Include *csharp.js* and scripts from the *csharp* folder as required for the built-in blocks supported by your configuration.
2. [Write and include code generation scripts](http://code.google.com/p/blockly/wiki/GeneratingCode) for your custom blocks.
3. Generate C# code with the following JavaScript
```
var code = Blockly.CSharp.workspaceToCode();
```