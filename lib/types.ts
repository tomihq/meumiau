export interface CommandHistory {
  command: string
  output: string[]
  timestamp: Date
}

export interface SectionInfo {
  path: string
  description: string
}

export interface TerminalContext {
  currentSection: string
  variables: Record<string, any>
}

// Token types for the lexer
export type TokenType = 
  | 'IDENTIFIER'      // Variable names, command names
  | 'STRING'          // Quoted strings
  | 'NUMBER'          // Numbers
  | 'OPERATOR'        // =, +, -, *, /, ==, !=, <, >, <=, >=
  | 'KEYWORD'         // if, then, else, do
  | 'SYMBOL'          // (, ), [, ], ., ->
  | 'SEMICOLON'       // ;
  | 'WHITESPACE'      // Spaces, tabs
  | 'EOF';            // End of input

export interface Token {
  type: TokenType;
  value: string;
  position: number;
  line: number;
}

// Parser types
export interface ParserContext {
  tokens: Token[];
  current: number;
  line: number;
}

export type AstNode =
  | { type: 'Command'; name: string; args: string }
  | { type: 'VariableAssignment'; name: string; value: string }
  | { type: 'IfStatement'; condition: string; thenBranch: AstNode; elseBranch?: AstNode }
  | { type: 'DoLoop'; collection: string; param: string; command: string }
  | { type: 'Unknown'; raw: string }
  | { type: "Literal"; value: any };

export interface CommandDefinition {
  description: string;
  execute: (args: string, context: { 
    currentSection: string;
    router: any;
    variables: Record<string, any>;
    setVariables: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setHistory: React.Dispatch<React.SetStateAction<CommandHistory[]>>;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    commandHistory?: string[];
  }) => string[];
}

export interface SubCommandContext {
  currentSection: string;
  variables: Record<string, any>; 
  sections: Record<string, SectionInfo>;
  evaluateArithmetic: (expr: string) => { value?: number; error?: string };
}