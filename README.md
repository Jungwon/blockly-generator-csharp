# blockly-generator-csharp

Generate C# code from Blockly blocks.  See [the Blockly Wiki](http://code.google.com/p/blockly/wiki/LanguageGenerators) for more information.

## Usage

1. Include *csharp.js* and scripts from the *csharp* folder as required for the built-in blocks supported by your configuration.
2. [Write and include code generation scripts](http://code.google.com/p/blockly/wiki/GeneratingCode) for your custom blocks.
3. Generate C# code with the following JavaScript
```
var code = Blockly.CSharp.workspaceToCode();
```

## License

Copyright 2013-2014 City Index

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
