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
  
  // New: IF statements as values
  "$result = if (6>5) then $arr else $arr2",
  "$bool = if (true) then true else false",
  "$num = if (10>5) then 42 else 0",
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
        console.log(`  Assignment: $${astNode.name} = ${astNode.value.type}`);
        if (astNode.value.type === 'IfStatement') {
          console.log(`    IF condition: ${astNode.value.condition}`);
        }
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
    variables: { x: 5, name: 'Tom', list: [1, 2, 3], arr: [10, 20], arr2: [30, 40] },
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
    // New: IF statements as values
    "$result = if (6>5) then $arr else $arr2",
    "$bool = if (true) then true else false",
    "$num = if (10>5) then 42 else 0",
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

// Test specific IF statement as value
export function testIfAsValue() {
  console.log("🧪 Testing IF statement as value...\n");
  
  const mockContext = {
    currentSection: 'home',
    router: { push: (path: string) => console.log(`Navigate to: ${path}`) },
    variables: { arr: [10, 20], arr2: [30, 40] },
    setVariables: (fn: any) => {
      const newVars = fn({ arr: [10, 20], arr2: [30, 40] });
      console.log('Variables updated:', newVars);
    },
    setHistory: (fn: any) => console.log('History updated'),
    setIsOpen: (fn: any) => console.log('Terminal state updated'),
  };
  
  const testCommands = [
    "$arr3 = if (6>5) then $arr else $arr2",
    "$bool = if (true) then true else false",
    "$num = if (10>5) then 42 else 0",
    "if (6>5) then (if (5<4) then (true) else (false)) else (echo 'hola')"
  ];
  
  testCommands.forEach((testCommand, index) => {
    console.log(`Test ${index + 1}: "${testCommand}"`);
    
    try {
      const astNode = parseCommandToAstNode(testCommand);
      console.log(`AST type: ${astNode.type}`);
      
      if (astNode.type === 'VariableAssignment') {
        console.log(`Variable: $${astNode.name}`);
        console.log(`Value type: ${astNode.value.type}`);
        
        if (astNode.value.type === 'IfStatement') {
          console.log(`IF condition: ${astNode.value.condition}`);
          console.log(`Then branch: ${astNode.value.thenBranch.type}`);
          console.log(`Else branch: ${astNode.value.elseBranch?.type || 'none'}`);
        }
      } else if (astNode.type === 'IfStatement') {
        console.log(`IF condition: ${astNode.condition}`);
        console.log(`Then branch: ${astNode.thenBranch.type}`);
        console.log(`Else branch: ${astNode.elseBranch?.type || 'none'}`);
      }
      
      const output = interpretAstNode(astNode, mockContext);
      console.log(`Output: ${output.join('\n  ')}`);
      
    } catch (error) {
      console.log(`❌ Error: ${error}`);
    }
    
    console.log('');
  });
}

// Test help instructionsAvailable command
export function testHelpInstructions() {
  console.log("🧪 Testing help instructionsAvailable...\n");
  
  const mockContext = {
    currentSection: 'home',
    router: { push: (path: string) => console.log(`Navigate to: ${path}`) },
    variables: {},
    setVariables: (fn: any) => console.log('Variables updated'),
    setHistory: (fn: any) => console.log('History updated'),
    setIsOpen: (fn: any) => console.log('Terminal state updated'),
  };
  
  const testCommands = [
    "help",
    "help instructionsAvailable"
  ];
  
  testCommands.forEach((testCommand, index) => {
    console.log(`Test ${index + 1}: "${testCommand}"`);
    
    try {
      const astNode = parseCommandToAstNode(testCommand);
      console.log(`AST type: ${astNode.type}`);
      
      if (astNode.type === 'Command') {
        console.log(`Command: ${astNode.name}`);
        console.log(`Args: "${astNode.args}"`);
      }
      
      const output = interpretAstNode(astNode, mockContext);
      console.log(`Output lines: ${output.length}`);
      console.log(`First few lines:`);
      output.slice(0, 5).forEach((line, i) => {
        console.log(`  ${i + 1}: ${line}`);
      });
      if (output.length > 5) {
        console.log(`  ... and ${output.length - 5} more lines`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error}`);
    }
    
    console.log('');
  });
}

// Run tests if this file is executed directly
if (require.main === module) {
  testParser();
  testInterpreter();
  testIfAsValue();
  testHelpInstructions();
} 