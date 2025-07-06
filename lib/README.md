# Sistema de Tokenización y Parsing

Este directorio contiene un sistema completo de interpretación de comandos basado en tokenización que reemplaza el enfoque anterior basado en regex.

## Arquitectura

### 1. Lexer (`lexer.ts`)
El lexer convierte el texto de entrada en tokens estructurados:

```typescript
// Ejemplo de tokenización
const lexer = new Lexer("$x = 5 + 3");
const tokens = lexer.tokenize();
// Resultado: [
//   { type: 'IDENTIFIER', value: '$x', position: 0, line: 1 },
//   { type: 'OPERATOR', value: '=', position: 3, line: 1 },
//   { type: 'NUMBER', value: '5', position: 5, line: 1 },
//   { type: 'OPERATOR', value: '+', position: 7, line: 1 },
//   { type: 'NUMBER', value: '3', position: 9, line: 1 }
// ]
```

### 2. Parser (`lexer.ts`)
El parser convierte los tokens en un AST (Abstract Syntax Tree):

```typescript
// Ejemplo de parsing
const astNode = parseCommandToAstNode("$x = 5 + 3");
// Resultado: {
//   type: 'VariableAssignment',
//   name: 'x',
//   value: '5 + 3'
// }
```

### 3. Interpreter (`interpreter.ts`)
El intérprete ejecuta el AST y produce la salida:

```typescript
// Ejemplo de interpretación
const output = interpretAstNode(astNode, context);
// Resultado: ["Variable '$x' set to: 8"]
```

## Tipos de Tokens

- `IDENTIFIER`: Nombres de variables ($x) y comandos (echo, cd)
- `STRING`: Cadenas entre comillas ('texto', "texto")
- `NUMBER`: Números (123, 3.14)
- `OPERATOR`: Operadores (=, +, -, *, /, ==, !=, <, >, <=, >=)
- `KEYWORD`: Palabras clave (if, then, else, do)
- `SYMBOL`: Símbolos especiales ((, ), [, ], ., ->)
- `SEMICOLON`: Punto y coma (;)
- `WHITESPACE`: Espacios en blanco
- `EOF`: Fin de entrada

## Estructuras Soportadas

### 1. Asignación de Variables
```bash
$x = 5
$name = 'John'
$list = [1, 2, 3]
$x = $x + 2
```

### 2. Comandos Simples
```bash
echo Hello World
cd home
pwd
vars
```

### 3. Declaraciones IF
```bash
if (true) then (echo 'Hello')
if ($x > 10) then (echo 'Large') else (echo 'Small')
if ($name == 'Tom') then (cd contact)
```

### 4. Bucles DO
```bash
$list.do((item) -> echo item)
$nums.do((n) -> echo Number: n)
```

### 5. Expresiones con Template Strings
```bash
echo 'Hello, {$name}'
echo 'Result: {2 + 3}'
echo 'Mix: {$age} + {5}'
```

## Ventajas del Nuevo Sistema

### 1. Escalabilidad
- Fácil agregar nuevos tipos de tokens
- Estructura modular y extensible
- Separación clara entre lexer, parser e intérprete

### 2. Robustez
- Mejor manejo de errores con información de línea y posición
- Validación más precisa de la sintaxis
- Menos dependencia de regex complejos

### 3. Mantenibilidad
- Código más legible y organizado
- Fácil debugging con tokens estructurados
- Tests más específicos y confiables

### 4. Rendimiento
- Tokenización una sola vez por comando
- Parsing más eficiente que regex múltiples
- Cache de tokens para comandos repetidos

## Migración

El sistema mantiene compatibilidad hacia atrás:

```typescript
// Código antiguo (sigue funcionando)
const astNode = parseCommandToAstNode("$x = 5");

// Código nuevo (más explícito)
const lexer = new Lexer("$x = 5");
const tokens = lexer.tokenize();
const context = createParserContext(tokens);
const astNode = parseStatement(context);
```

## Extensión

Para agregar nuevas funcionalidades:

1. **Nuevos tokens**: Agregar al enum `TokenType` y al lexer
2. **Nuevas estructuras**: Agregar al tipo `AstNode` y al parser
3. **Nuevos comandos**: Agregar a `COMMAND_DEFINITIONS`

### Ejemplo: Agregar un bucle WHILE

```typescript
// 1. Agregar token
const KEYWORDS = new Set(['if', 'then', 'else', 'do', 'while']);

// 2. Agregar tipo AST
type AstNode = 
  | { type: 'WhileLoop'; condition: string; body: AstNode }
  | // ... otros tipos

// 3. Agregar parser
function parseWhileLoop(context: ParserContext): AstNode {
  // Implementación del parser
}

// 4. Agregar intérprete
case "WhileLoop":
  // Implementación del intérprete
```

## Testing

Usar el archivo `test-parser.ts` para probar el sistema:

```bash
npx ts-node lib/test-parser.ts
```

Esto ejecutará una serie de tests para verificar que todas las funcionalidades funcionan correctamente. 