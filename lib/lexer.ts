import { Token, TokenType, ParserContext, AstNode } from './types';

// Keywords that have special meaning
const KEYWORDS = new Set(['if', 'then', 'else', 'do']);

// Operators with their precedence
const OPERATORS = new Map([
  ['=', 'ASSIGN'],
  ['==', 'EQ'],
  ['!=', 'NEQ'],
  ['<', 'LT'],
  ['>', 'GT'],
  ['<=', 'LTE'],
  ['>=', 'GTE'],
  ['+', 'ADD'],
  ['-', 'SUB'],
  ['*', 'MUL'],
  ['/', 'DIV'],
]);

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input;
  }

  private isEOF(): boolean {
    return this.position >= this.input.length;
  }

  private peek(): string {
    return this.isEOF() ? '\0' : this.input[this.position];
  }

  private peekNext(): string {
    return this.position + 1 >= this.input.length ? '\0' : this.input[this.position + 1];
  }

  private advance(): string {
    if (this.isEOF()) return '\0';
    const char = this.input[this.position];
    this.position++;
    return char;
  }

  private match(expected: string): boolean {
    if (this.peek() === expected) {
      this.advance();
      return true;
    }
    return false;
  }

  private skipWhitespace(): void {
    while (!this.isEOF() && /\s/.test(this.peek())) {
      if (this.peek() === '\n') {
        this.line++;
      }
      this.advance();
    }
  }

  private readString(): Token {
    const quote = this.advance(); // Consume opening quote
    const start = this.position;
    
    while (!this.isEOF() && this.peek() !== quote) {
      if (this.peek() === '\\' && this.peekNext() === quote) {
        this.advance(); // Skip backslash
      }
      this.advance();
    }

    if (this.isEOF()) {
      throw new Error(`Unterminated string at line ${this.line}`);
    }

    const value = this.input.substring(start, this.position);
    this.advance(); // Consume closing quote

    return {
      type: 'STRING',
      value,
      position: start - 1,
      line: this.line
    };
  }

  private readNumber(): Token {
    const start = this.position;
    
    while (!this.isEOF() && /\d/.test(this.peek())) {
      this.advance();
    }

    // Handle decimal part
    if (this.peek() === '.' && /\d/.test(this.peekNext())) {
      this.advance(); // Consume decimal point
      while (!this.isEOF() && /\d/.test(this.peek())) {
        this.advance();
      }
    }

    const value = this.input.substring(start, this.position);
    return {
      type: 'NUMBER',
      value,
      position: start,
      line: this.line
    };
  }

  private readIdentifier(): Token {
    const start = this.position;
    
    while (!this.isEOF() && /[a-zA-Z0-9_]/.test(this.peek())) {
      this.advance();
    }

    const value = this.input.substring(start, this.position);
    const type: TokenType = KEYWORDS.has(value) ? 'KEYWORD' : 'IDENTIFIER';

    return {
      type,
      value,
      position: start,
      line: this.line
    };
  }

  private readOperator(): Token {
    const start = this.position;
    
    // Try two-character operators first
    if (this.position + 1 < this.input.length) {
      const twoChar = this.input.substring(this.position, this.position + 2);
      if (OPERATORS.has(twoChar)) {
        this.advance();
        this.advance();
        return {
          type: 'OPERATOR',
          value: twoChar,
          position: start,
          line: this.line
        };
      }
    }

    // Single character operator
    const char = this.advance();
    if (OPERATORS.has(char)) {
      return {
        type: 'OPERATOR',
        value: char,
        position: start,
        line: this.line
      };
    }

    throw new Error(`Unknown operator '${char}' at line ${this.line}`);
  }

  public tokenize(): Token[] {
    this.tokens = [];
    this.position = 0;
    this.line = 1;

    while (!this.isEOF()) {
      const char = this.peek();

      if (/\s/.test(char)) {
        this.skipWhitespace();
        continue;
      }

      if (char === '"' || char === "'") {
        this.tokens.push(this.readString());
        continue;
      }

      if (/\d/.test(char)) {
        this.tokens.push(this.readNumber());
        continue;
      }

      if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      if (char === '$') {
        this.advance(); // Consume $
        if (/[a-zA-Z_]/.test(this.peek())) {
          const identifier = this.readIdentifier();
          this.tokens.push({
            type: 'IDENTIFIER',
            value: '$' + identifier.value,
            position: identifier.position - 1,
            line: identifier.line
          });
        } else {
          throw new Error(`Invalid variable name after $ at line ${this.line}`);
        }
        continue;
      }

      if (char === ';') {
        this.tokens.push({
          type: 'SEMICOLON',
          value: this.advance(),
          position: this.position - 1,
          line: this.line
        });
        continue;
      }

      if (char === ',') {
        this.tokens.push({
          type: 'SYMBOL',
          value: this.advance(),
          position: this.position - 1,
          line: this.line
        });
        continue;
      }

      if (char === '(' || char === ')' || char === '[' || char === ']') {
        this.tokens.push({
          type: 'SYMBOL',
          value: this.advance(),
          position: this.position - 1,
          line: this.line
        });
        continue;
      }

      if (char === '.') {
        this.tokens.push({
          type: 'SYMBOL',
          value: this.advance(),
          position: this.position - 1,
          line: this.line
        });
        continue;
      }

      if (char === '-' && this.peekNext() === '>') {
        this.advance(); // Consume -
        this.advance(); // Consume >
        this.tokens.push({
          type: 'SYMBOL',
          value: '->',
          position: this.position - 2,
          line: this.line
        });
        continue;
      }

      // Try to read as operator
      if (OPERATORS.has(char) || ['=', '!', '<', '>', '+', '-', '*', '/'].includes(char)) {
        this.tokens.push(this.readOperator());
        continue;
      }

      // En vez de lanzar error, agrego un token UNKNOWN y avanzo
      this.tokens.push({
        type: 'UNKNOWN',
        value: this.advance(),
        position: this.position - 1,
        line: this.line
      });
      continue;
    }

    // Add EOF token
    this.tokens.push({
      type: 'EOF',
      value: '',
      position: this.position,
      line: this.line
    });

    return this.tokens;
  }
}

// Parser helper functions
export function createParserContext(tokens: Token[]): ParserContext {
  return {
    tokens,
    current: 0,
    line: 1
  };
}

export function isAtEnd(context: ParserContext): boolean {
  return context.current >= context.tokens.length || 
         context.tokens[context.current].type === 'EOF';
}

export function peek(context: ParserContext): Token {
  return context.tokens[context.current];
}

export function peekNext(context: ParserContext): Token {
  if (context.current + 1 >= context.tokens.length) {
    return context.tokens[context.tokens.length - 1]; // Return EOF
  }
  return context.tokens[context.current + 1];
}

export function advance(context: ParserContext): Token {
  if (!isAtEnd(context)) {
    context.current++;
  }
  return context.tokens[context.current - 1];
}

export function check(context: ParserContext, type: TokenType): boolean {
  if (isAtEnd(context)) return false;
  return peek(context).type === type;
}

export function match(context: ParserContext, ...types: TokenType[]): boolean {
  for (const type of types) {
    if (check(context, type)) {
      advance(context);
      return true;
    }
  }
  return false;
}

export function consume(context: ParserContext, type: TokenType, message: string): Token {
  if (check(context, type)) return advance(context);
  
  const token = peek(context);
  throw new Error(`${message} at line ${token.line}, got ${token.type} '${token.value}'`);
}

// Parser implementation
function parseStatement(context: ParserContext): AstNode {
  // Check for if statement
  if (check(context, 'KEYWORD') && peek(context).value === 'if') {
    return parseIfStatement(context);
  }

  // Check for variable assignment
  if (check(context, 'IDENTIFIER') && peek(context).value.startsWith('$')) {
    const varToken = peek(context);
    const nextToken = peekNext(context);
    
    if (nextToken.type === 'OPERATOR' && nextToken.value === '=') {
      return parseVariableAssignment(context);
    }
  }

  // Check for do loop
  if (check(context, 'IDENTIFIER') && peek(context).value.startsWith('$')) {
    const varToken = peek(context);
    const nextToken = peekNext(context);
    
    if (nextToken.type === 'SYMBOL' && nextToken.value === '.') {
      const thirdToken = context.tokens[context.current + 2];
      if (thirdToken && thirdToken.type === 'KEYWORD' && thirdToken.value === 'do') {
        return parseDoLoop(context);
      }
    }
  }

  // Check for map
  if (check(context, 'IDENTIFIER') && peek(context).value.startsWith('$')) {
    const varToken = peek(context);
    const nextToken = peekNext(context);
    if (nextToken.type === 'SYMBOL' && nextToken.value === '.') {
      const thirdToken = context.tokens[context.current + 2];
      if (thirdToken && thirdToken.type === 'IDENTIFIER' && thirdToken.value === 'map') {
        return parseMap(context);
      }
      if (thirdToken && thirdToken.type === 'IDENTIFIER' && thirdToken.value === 'filter') {
        return parseFilter(context);
      }
      if (thirdToken && thirdToken.type === 'KEYWORD' && thirdToken.value === 'do') {
        return parseDoLoop(context);
      }
    }
  }

  // Default to command
  return parseCommand(context);
}

function parseIfStatement(context: ParserContext): AstNode {
  // Consume 'if'
  consume(context, 'KEYWORD', "Expected 'if'");
  
  // Consume '('
  consume(context, 'SYMBOL', "Expected '(' after 'if'");
  
  // Parse condition
  const conditionTokens: Token[] = [];
  let parenCount = 1;
  
  while (!isAtEnd(context) && parenCount > 0) {
    const token = peek(context);
    if (token.type === 'SYMBOL') {
      if (token.value === '(') parenCount++;
      else if (token.value === ')') parenCount--;
    }
    
    if (parenCount > 0) {
      conditionTokens.push(advance(context));
    }
  }
  
  // Consume ')'
  consume(context, 'SYMBOL', "Expected ')' after condition");
  
  // Consume 'then'
  consume(context, 'KEYWORD', "Expected 'then'");
  
  // Parse then block - can be either a simple expression or a parenthesized block
  let thenBranch: AstNode;
  if (check(context, 'SYMBOL') && peek(context).value === '(') {
    // Parenthesized block
    advance(context); // Consume '('
    const thenTokens: Token[] = [];
    let parenCount = 1;
    
    while (!isAtEnd(context) && parenCount > 0) {
      const token = peek(context);
      if (token.type === 'SYMBOL') {
        if (token.value === '(') parenCount++;
        else if (token.value === ')') parenCount--;
      }
      
      if (parenCount > 0) {
        thenTokens.push(advance(context));
      }
    }
    
    consume(context, 'SYMBOL', "Expected ')' after then block");
    
    // Parse then block
    const thenContext = createParserContext(thenTokens);
    thenBranch = parseStatement(thenContext);
  } else {
    // Simple expression (no parentheses)
    const thenTokens: Token[] = [];
    while (!isAtEnd(context) && 
           !(check(context, 'KEYWORD') && peek(context).value === 'else') &&
           !check(context, 'SEMICOLON')) {
      thenTokens.push(advance(context));
    }
    
    if (thenTokens.length === 0) {
      throw new Error("Expected expression after 'then'");
    }
    
    // Parse as expression
    const thenContext = createParserContext(thenTokens);
    thenBranch = parseExpression(thenContext);
  }
  
  // Parse else block if present
  let elseBranch: AstNode | undefined;
  if (check(context, 'KEYWORD') && peek(context).value === 'else') {
    advance(context); // Consume 'else'
    
    // Parse else block - can be either a simple expression or a parenthesized block
    if (check(context, 'SYMBOL') && peek(context).value === '(') {
      // Parenthesized block
      advance(context); // Consume '('
      const elseTokens: Token[] = [];
      let parenCount = 1;
      
      while (!isAtEnd(context) && parenCount > 0) {
        const token = peek(context);
        if (token.type === 'SYMBOL') {
          if (token.value === '(') parenCount++;
          else if (token.value === ')') parenCount--;
        }
        
        if (parenCount > 0) {
          elseTokens.push(advance(context));
        }
      }
      
      consume(context, 'SYMBOL', "Expected ')' after else block");
      
      // Parse else block
      const elseContext = createParserContext(elseTokens);
      elseBranch = parseStatement(elseContext);
    } else {
      // Simple expression (no parentheses)
      const elseTokens: Token[] = [];
      while (!isAtEnd(context) && !check(context, 'SEMICOLON')) {
        elseTokens.push(advance(context));
      }
      
      if (elseTokens.length === 0) {
        throw new Error("Expected expression after 'else'");
      }
      
      // Parse as expression
      const elseContext = createParserContext(elseTokens);
      elseBranch = parseExpression(elseContext);
    }
  }
  
  return {
    type: 'IfStatement',
    condition: conditionTokens.map(t => t.value).join(' '),
    thenBranch,
    elseBranch
  };
}

function parseVariableAssignment(context: ParserContext): AstNode {
  const varToken = advance(context); // Consume variable name
  const varName = varToken.value.substring(1); // Remove '$'
  
  advance(context); // Consume '='
  
  // Parse the right-hand side as an expression
  const expressionNode = parseExpression(context);
  
  // Consume semicolon if present
  if (check(context, 'SEMICOLON')) {
    advance(context);
  }
  
  return {
    type: 'VariableAssignment',
    name: varName,
    value: expressionNode
  };
}

// New function to parse expressions (including IF statements)
function parseExpression(context: ParserContext): AstNode {
  // Check for IF statement
  if (check(context, 'KEYWORD') && peek(context).value === 'if') {
    return parseIfStatement(context);
  }
  
  // Check for variable reference
  if (check(context, 'IDENTIFIER') && peek(context).value.startsWith('$')) {
    const varToken = advance(context);
    return { type: 'Literal', value: varToken.value };
  }
  
  // Check for boolean literals
  if (check(context, 'IDENTIFIER')) {
    const token = peek(context);
    if (token.value === 'true') {
      advance(context);
      return { type: 'Literal', value: true };
    }
    if (token.value === 'false') {
      advance(context);
      return { type: 'Literal', value: false };
    }
  }
  
  // Check for numbers
  if (check(context, 'NUMBER')) {
    const token = advance(context);
    return { type: 'Literal', value: Number(token.value) };
  }
  
  // Check for strings
  if (check(context, 'STRING')) {
    const token = advance(context);
    return { type: 'Literal', value: token.value };
  }
  
  // Check for arrays
  if (check(context, 'SYMBOL') && peek(context).value === '[') {
    return parseArray(context);
  }
  
  // Default to command parsing
  return parseCommand(context);
}

// New function to parse arrays
function parseArray(context: ParserContext): AstNode {
  advance(context); // Consume '['
  
  const elements: AstNode[] = [];
  
  while (!isAtEnd(context) && !check(context, 'SYMBOL') || peek(context).value !== ']') {
    if (check(context, 'SYMBOL') && peek(context).value === ',') {
      advance(context); // Consume comma
      continue;
    }
    
    elements.push(parseExpression(context));
  }
  
  if (check(context, 'SYMBOL') && peek(context).value === ']') {
    advance(context); // Consume ']'
  }
  
  return { type: 'Literal', value: elements };
}

function parseDoLoop(context: ParserContext): AstNode {
  const collectionToken = advance(context); // Consume collection variable
  const collection = collectionToken.value.substring(1); // Remove '$'
  
  advance(context); // Consume '.'
  advance(context); // Consume 'do'
  
  consume(context, 'SYMBOL', "Expected '(' after 'do'");
  consume(context, 'SYMBOL', "Expected '(' for parameter");
  
  const paramToken = advance(context); // Consume parameter
  const param = paramToken.value;
  
  consume(context, 'SYMBOL', "Expected ')' after parameter");
  consume(context, 'SYMBOL', "Expected '->'");
  
  // Parse command
  const commandTokens: Token[] = [];
  let parenCount = 1;
  
  while (!isAtEnd(context) && parenCount > 0) {
    const token = peek(context);
    if (token.type === 'SYMBOL') {
      if (token.value === '(') parenCount++;
      else if (token.value === ')') parenCount--;
    }
    
    if (parenCount > 0) {
      commandTokens.push(advance(context));
    }
  }
  
  consume(context, 'SYMBOL', "Expected ')' after command");
  
  const command = commandTokens.map(t => t.value).join(' ');
  
  return {
    type: 'DoLoop',
    collection,
    param,
    command
  };
}

function parseMap(context: ParserContext): AstNode {
  const collectionToken = advance(context); // Consume collection variable
  const collection = collectionToken.value.substring(1); // Remove '$'
  advance(context); // Consume '.'
  advance(context); // Consume 'map'
  consume(context, 'SYMBOL', "Expected '(' after 'map'");
  consume(context, 'SYMBOL', "Expected '(' for parameter");
  const paramToken = advance(context); // Consume parameter
  const param = paramToken.value;
  consume(context, 'SYMBOL', "Expected ')' after parameter");
  consume(context, 'SYMBOL', "Expected '->'");
  // Parse expression
  const exprTokens: Token[] = [];
  let parenCount = 1;
  while (!isAtEnd(context) && parenCount > 0) {
    const token = peek(context);
    if (token.type === 'SYMBOL') {
      if (token.value === '(') parenCount++;
      else if (token.value === ')') parenCount--;
    }
    if (parenCount > 0) {
      exprTokens.push(advance(context));
    }
  }
  consume(context, 'SYMBOL', "Expected ')' after map expression");
  const exprContext = createParserContext(exprTokens);
  const exprNode = parseExpression(exprContext);
  return {
    type: 'Map',
    collection,
    param,
    expr: exprNode
  };
}

function parseFilter(context: ParserContext): AstNode {
  const collectionToken = advance(context); // Consume collection variable
  const collection = collectionToken.value.substring(1); // Remove '$'
  advance(context); // Consume '.'
  advance(context); // Consume 'filter'
  consume(context, 'SYMBOL', "Expected '(' after 'filter'");
  consume(context, 'SYMBOL', "Expected '(' for parameter");
  const paramToken = advance(context); // Consume parameter
  const param = paramToken.value;
  consume(context, 'SYMBOL', "Expected ')' after parameter");
  consume(context, 'SYMBOL', "Expected '->'");
  // Parse expression
  const exprTokens: Token[] = [];
  let parenCount = 1;
  while (!isAtEnd(context) && parenCount > 0) {
    const token = peek(context);
    if (token.type === 'SYMBOL') {
      if (token.value === '(') parenCount++;
      else if (token.value === ')') parenCount--;
    }
    if (parenCount > 0) {
      exprTokens.push(advance(context));
    }
  }
  consume(context, 'SYMBOL', "Expected ')' after filter expression");
  const exprContext = createParserContext(exprTokens);
  const exprNode = parseExpression(exprContext);
  return {
    type: 'Filter',
    collection,
    param,
    expr: exprNode
  };
}

function parseCommand(context: ParserContext): AstNode {
  const tokens: Token[] = [];
  
  while (!isAtEnd(context) && !check(context, 'SEMICOLON')) {
    tokens.push(advance(context));
  }
  
  // Consume semicolon if present
  if (check(context, 'SEMICOLON')) {
    advance(context);
  }
  
  if (tokens.length === 0) {
    return { type: 'Unknown', raw: '' };
  }
  
  // Check for boolean literals
  if (tokens.length === 1) {
    const token = tokens[0];
    if (token.type === 'IDENTIFIER') {
      if (token.value === 'true') {
        return { type: 'Literal', value: true };
      }
      if (token.value === 'false') {
        return { type: 'Literal', value: false };
      }
    }
  }
  
  const commandName = tokens[0].value.toLowerCase();
  const args = tokens.slice(1).map(t => t.value).join(' ');
  
  return {
    type: 'Command',
    name: commandName,
    args
  };
}

// Legacy function for backward compatibility
export const parseCommandToAstNode = (commandString: string): AstNode => {
  const lexer = new Lexer(commandString);
  const tokens = lexer.tokenize();
  const context = createParserContext(tokens);
  
  return parseStatement(context);
};