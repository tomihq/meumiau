import { Lexer, parseCommandToAstNode } from './lexer';
import { interpretAstNode } from './interpreter';

// Test cases for the new token-based parser
const testCases = [
  // Variable assignments
  "$x = 5",
  "$name = 'John'",
  "$list = [1, 2, 3]",
  "$x = $x + 2",
  
  // Commands
  "echo Hello World",
  "cd home",
  "pwd",
  "vars",
  
  // IF statements
  "if (true) then (echo 'Hello')",
  "if ($x > 10) then (echo 'Large') else (echo 'Small')",
  "if ($name == 'Tom') then (cd contact)",
  
  // Do loops
  "$list.do((item) -> echo item)",
  "$nums.do((n) -> echo Number: n)",
  
  // Complex expressions
  "echo 'Hello, {$name}'",
  "echo 'Result: {2 + 3}'",
];

export function testParser() {
  console.log("🧪 Testing new token-based parser...\n");
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase}"`);
    
    try {
      // Test lexer
      const lexer = new Lexer(testCase);
      const tokens = lexer.tokenize();
      console.log(`  Tokens: [${tokens.map(t => `${t.type}:'${t.value}'`).join(', ')}]`);
      
      // Test parser
      const astNode = parseCommandToAstNode(testCase);
      console.log(`  AST: ${astNode.type}`);
      
      if (astNode.type === 'Command') {
        console.log(`  Command: ${astNode.name} "${astNode.args}"`);
      } else if (astNode.type === 'VariableAssignment') {
        console.log(`  Assignment: $${astNode.name} = "${astNode.value}"`);
      } else if (astNode.type === 'IfStatement') {
        console.log(`  If: ${astNode.condition}`);
      } else if (astNode.type === 'DoLoop') {
        console.log(`  Do: $${astNode.collection}.do((${astNode.param}) -> ${astNode.command})`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error}`);
    }
    
    console.log('');
  });
}

// Test interpreter with variables
export function testInterpreter() {
  console.log("🧪 Testing interpreter with variables...\n");
  
  const mockContext = {
    currentSection: 'home',
    router: { push: (path: string) => console.log(`Navigate to: ${path}`) },
    variables: { x: 5, name: 'Tom', list: [1, 2, 3] },
    setVariables: (fn: any) => console.log('Variables updated'),
    setHistory: (fn: any) => console.log('History updated'),
    setIsOpen: (fn: any) => console.log('Terminal state updated'),
  };
  
  const testCommands = [
    "echo $name",
    "echo 'Hello, {$name}'",
    "echo 'X is {$x}'",
    "echo 'List: {$list}'",
    "if ($x > 3) then (echo 'X is greater than 3')",
    "$list.do((item) -> echo item)",
  ];
  
  testCommands.forEach((command, index) => {
    console.log(`Test ${index + 1}: "${command}"`);
    
    try {
      const astNode = parseCommandToAstNode(command);
      const output = interpretAstNode(astNode, mockContext);
      console.log(`  Output: ${output.join('\n    ')}`);
    } catch (error) {
      console.log(`  ❌ Error: ${error}`);
    }
    
    console.log('');
  });
}

// Run tests if this file is executed directly
if (require.main === module) {
  testParser();
  testInterpreter();
} 