import React from "react";
import {
  AstNode,
  CommandHistory,
  SubCommandContext,
  SectionInfo,
  Token,
  TokenType,
  ParserContext,
} from "./types";
import {evaluateArithmetic, extractBlock } from "./utils";
import { COMMAND_DEFINITIONS, processEchoArg } from "./command";
import { ifRegex } from "./regex";
import { Lexer, createParserContext, isAtEnd, peek, advance, check, match, consume } from "./lexer";

const SECTIONS: Record<string, SectionInfo> = {
  home: { path: "/", description: "Home page - About Tomás" },
  skills: { path: "/skills", description: "Technical skills and technologies" },
  projects: { path: "/projects", description: "Current and featured projects" },
  notes: { path: "/notes", description: "Mathematical notes and thoughts" },
  blog: { path: "/blog", description: "Latest blog posts and articles" },
  contact: { path: "/contact", description: "Contact information and links" },
};

// Token-based condition evaluator
export const evaluateConditionFromTokens = (
  tokens: Token[],
  currentVariables: Record<string, any>
): boolean => {
  if (tokens.length === 0) return false;
  
  // Handle simple boolean literals
  if (tokens.length === 1) {
    const token = tokens[0];
    if (token.type === 'IDENTIFIER') {
      if (token.value === 'true') return true;
      if (token.value === 'false') return false;
      
      // Variable reference
      if (token.value.startsWith('$')) {
        const varName = token.value.substring(1);
        const value = currentVariables[varName];
        if (value === undefined) return false;
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0 && !isNaN(value);
        if (typeof value === "string") return value.length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
      }
    }
    
    if (token.type === 'NUMBER') {
      return Number(token.value) !== 0;
    }
  }
  
  // Handle comparisons
  if (tokens.length >= 3) {
    const leftTokens = tokens.slice(0, -2);
    const operator = tokens[tokens.length - 2];
    const rightTokens = tokens.slice(-1);
    
    if (operator.type === 'OPERATOR' && ['==', '!=', '<', '>', '<=', '>='].includes(operator.value)) {
      const leftValue = resolveTokenValue(leftTokens, currentVariables);
      const rightValue = resolveTokenValue(rightTokens, currentVariables);
      
      switch (operator.value) {
        case "==":
          return leftValue == rightValue;
        case "!=":
          return leftValue != rightValue;
        case "<":
          return Number(leftValue) < Number(rightValue);
        case ">":
          return Number(leftValue) > Number(rightValue);
        case "<=":
          return Number(leftValue) <= Number(rightValue);
        case ">=":
          return Number(leftValue) >= Number(rightValue);
      }
    }
  }
  
  // Try to evaluate as arithmetic expression
  const expression = tokens.map(t => t.value).join(' ');
  const arithmeticResult = evaluateArithmetic(expression);
  if (!arithmeticResult.error && typeof arithmeticResult.value === "number") {
    return arithmeticResult.value !== 0;
  }
  
  return false;
};

// Helper to resolve token values
function resolveTokenValue(tokens: Token[], variables: Record<string, any>): any {
  if (tokens.length === 1) {
    const token = tokens[0];
    
    if (token.type === 'STRING') {
      return token.value;
    }
    
    if (token.type === 'NUMBER') {
      return Number(token.value);
    }
    
    if (token.type === 'IDENTIFIER') {
      if (token.value.startsWith('$')) {
        const varName = token.value.substring(1);
        if (!(varName in variables)) {
          throw new Error(`Undefined variable: '$${varName}' in condition`);
        }
        return variables[varName];
      }
      
      // Try as variable name without $
      if (token.value in variables) {
        return variables[token.value];
      }
      
      return token.value;
    }
  }
  
  const expression = tokens.map(t => t.value).join(' ');
  const result = evaluateArithmetic(expression);
  if (result.error) {
    throw new Error(`Invalid expression: ${result.error}`);
  }
  return result.value;
}

export const evaluateCondition = (
  condition: string,
  currentVariables: Record<string, any>
): boolean => {
  if (condition.toLowerCase() === "true") return true;
  if (condition.toLowerCase() === "false") return false;

  const comparisonMatch = condition.match(/^(.+?)\s*([=!<>]=|<|>)\s*(.+)$/);
  if (comparisonMatch) {
    const leftExpr = comparisonMatch[1].trim();
    const operator = comparisonMatch[2];
    const rightExpr = comparisonMatch[3].trim();

    const resolveOperand = (expr: string): any => {
      if (expr.startsWith("$")) {
        const varName = expr.substring(1);
        if (!(varName in currentVariables)) {
          throw new Error(`Undefined variable: '$${varName}' in condition`);
        }
        return currentVariables[varName];
      }

      const arithmeticResult = evaluateArithmetic(expr);
      if (!arithmeticResult.error) return arithmeticResult.value;

      if (
        (expr.startsWith('"') && expr.endsWith('"')) ||
        (expr.startsWith("'") && expr.endsWith("'"))
      ) {
        return expr.slice(1, -1);
      }

      return expr;
    };

    let leftValue = resolveOperand(leftExpr);
    let rightValue = resolveOperand(rightExpr);

    // Force number comparison if using arithmetic operators
    if (["<", ">", "<=", ">="].includes(operator)) {
       leftValue = Number(leftValue);
  rightValue = Number(rightValue);
      if (typeof leftValue !== "number" || typeof rightValue !== "number") {
        throw new TypeError(
          `Both operands must be numbers for operator '${operator}'`
        );
      }
    }

    switch (operator) {
      case "==":
        return leftValue == rightValue;
      case "!=":
        return leftValue != rightValue;
      case "<":
        return leftValue < rightValue;
      case ">":
        return leftValue > rightValue;
      case "<=":
        return leftValue <= rightValue;
      case ">=":
        return leftValue >= rightValue;
      default:
        throw new Error(`Unsupported comparison operator: ${operator}`);
    }
  }

  // Simple truthiness check
  if (condition.startsWith("$")) {
    const varName = condition.substring(1);
    const value = currentVariables[varName];
    if (value === undefined) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0 && !isNaN(value);
    if (typeof value === "string") return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  }

  // Try to evaluate as arithmetic expression
  const arithmeticResult = evaluateArithmetic(condition);
  if (!arithmeticResult.error && typeof arithmeticResult.value === "number") {
    return arithmeticResult.value !== 0;
  }

  return false;
};

// Enhanced sub-command executor with token-based parsing
export const executeSimulatedSubCommand = (
  subCmd: string,
  context: SubCommandContext
): string[] => {
  const trimmedSubCmd = subCmd.trim();
  if (!trimmedSubCmd) return [""];

  try {
    // Use new token-based parser
    const lexer = new Lexer(trimmedSubCmd);
    const tokens = lexer.tokenize();
    
    // Check for IF statement using tokens
    if (tokens.length > 0 && tokens[0].type === 'KEYWORD' && tokens[0].value === 'if') {
      return executeIfStatementFromTokens(tokens, context);
    }
    
    // Fallback to old regex-based approach for compatibility
    const match = trimmedSubCmd.match(ifRegex);
    if (match) {
      return executeIfStatementLegacy(match, trimmedSubCmd, context);
    }
    
    // Handle other commands
    return executeCommandFromTokens(tokens, context);
  } catch (error: any) {
    return [`Error parsing command: ${error.message}`];
  }
};

// New token-based IF statement executor
function executeIfStatementFromTokens(
  tokens: Token[],
  context: SubCommandContext
): string[] {
  // This is a simplified version - in a full implementation,
  // you would parse the complete IF structure from tokens
  // For now, we'll fall back to the legacy approach
  return executeIfStatementLegacy(null, tokens.map(t => t.value).join(' '), context);
}

// Legacy IF statement executor
function executeIfStatementLegacy(
  match: RegExpMatchArray | null,
  trimmedSubCmd: string,
  context: SubCommandContext
): string[] {
  if (!match) {
    // Try to parse manually from tokens
    const ifMatch = trimmedSubCmd.match(ifRegex);
    if (!ifMatch) {
      return ["Error: Invalid IF statement syntax"];
    }
    match = ifMatch;
  }

  const conditionStr = match[1].trim();
  const afterThen = trimmedSubCmd.slice(match[0].length).trim();
  
  const thenBlockResult = extractBlock(afterThen);
  if (!thenBlockResult) {
    return ["Error: bloque THEN no válido o no cerrado"];
  }

  let restAfterThen = thenBlockResult.rest.trim();

  let elseBlockResult = null;
  if (restAfterThen.toLowerCase().startsWith("else")) {
    const afterElse = restAfterThen.slice(4).trim();
    elseBlockResult = extractBlock(afterElse);
    if (!elseBlockResult) {
      return ["Error: bloque ELSE no válido o no cerrado"];
    }
  }

  let conditionResult: boolean;
  try {
    conditionResult = evaluateCondition(conditionStr, context.variables);
  } catch (e: any) {
    return [`Error evaluando condición: ${e.message}`];
  }

  const selectedBlock = conditionResult
    ? thenBlockResult.block.trim()
    : elseBlockResult
    ? elseBlockResult.block.trim()
    : "";

  if (!selectedBlock) {
    return [
      `Condición ${conditionResult} pero no se proveyó la rama correspondiente.`,
    ];
  }

  // Execute recursively the selected content
  return executeSimulatedSubCommand(selectedBlock, context);
}

// Token-based command executor
function executeCommandFromTokens(
  tokens: Token[],
  context: SubCommandContext
): string[] {
  if (tokens.length === 0) return [""];
  
  const commandToken = tokens[0];
  if (commandToken.type !== 'IDENTIFIER' && commandToken.type !== 'KEYWORD') {
    return [`Error: Expected command name, got ${commandToken.type}`];
  }
  
  const command = commandToken.value.toLowerCase();
  const args = tokens.slice(1).map(t => t.value).join(' ');
  
  switch (command) {
    case "echo":
      return [processEchoArg(args, context.variables, context.evaluateArithmetic)];
    case "cd":
      if (!args) {
        return [
          "Usage: cd <section>",
          "Available sections: " + Object.keys(context.sections).join(", "),
        ];
      } else if (args === "..") {
        return [`Would navigate to: ${context.sections.home.path}`];
      } else if (args in context.sections) {
        return [
          `Would navigate to: ${
            context.sections[args as keyof typeof context.sections].path
          }`,
        ];
      } else {
        return [`cd: ${args}: No such section (in simulation)`];
      }
    case "pwd":
      return [`Simulated current path: ${context.currentSection}`];
    case "date":
      return [`Simulated current date: ${new Date().toString()}`];
    case "unset":
      let varName = args.replace(/;+/g, "").trim();
      if (varName.startsWith("$")) {
        varName = varName.substring(1);
      }
      if (
        varName &&
        /^[a-zA-Z]/.test(varName) &&
        varName in context.variables
      ) {
        return [`Would remove variable '$${varName}'.`];
      } else {
        return [`Variable '$${varName}' not found (in simulation).`];
      }
    case "vars":
      if (Object.keys(context.variables).length === 0) {
        return ["No variables defined in main scope."];
      } else {
        return [
          "Current variables in main scope (for simulation):",
          "",
          ...Object.entries(context.variables).map(([name, value]) => {
            let displayValue: string;
            if (Array.isArray(value)) {
              displayValue = `[${value
                .map((v) => (typeof v === "string" ? `"${v}"` : v))
                .join(", ")}]`;
            } else if (typeof value === "string") {
              displayValue = `"${value}"`;
            } else {
              displayValue = String(value);
            }
            return `  ${name} = ${displayValue}`;
          }),
        ];
      }
    default:
      return [
        `Simulated command '${command} ${args}' is not directly supported in this context.`,
      ];
  }
}

// Función auxiliar para evaluar recursivamente hasta obtener un valor primitivo
function evaluateToPrimitive(arg: any, context: any): any {
  // Si es un nodo AST
  if (arg && typeof arg === 'object' && arg.type) {
    const result = interpretAstNode(arg, context);
    if (Array.isArray(result)) {
      if (result.length === 1) {
        return evaluateToPrimitive(result[0], context);
      } else {
        return result.map(r => evaluateToPrimitive(r, context)).join('\n');
      }
    } else {
      return evaluateToPrimitive(result, context);
    }
  }
  // Si es string, número, booleano, devolver tal cual
  return arg;
}

// Main interpreter function - refactored for scalability
export const interpretAstNode = (
  node: AstNode,
  context: {
    currentSection: string;
    router: any;
    variables: Record<string, any>;
    setVariables: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setHistory: React.Dispatch<React.SetStateAction<CommandHistory[]>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
): string[] => {
  const output: string[] = [];
  const {
    currentSection,
    router,
    variables,
    setVariables,
    setHistory,
    setIsOpen,
  } = context;

  // Context for SIMULATED commands (read-only for variables, no direct state changes)
  const simulatedContext: SubCommandContext = {
    currentSection,
    variables, // Pass current variables for read-only access
    sections: SECTIONS, // Pass sections config
    evaluateArithmetic: evaluateArithmetic,
  };

  try {
    switch (node.type) {
      case "Literal": 
        return [String(node.value)];
        
      case "IfStatement":
        let conditionResult = evaluateCondition(node.condition, variables);

        if (conditionResult) {
          return interpretAstNode(node.thenBranch, context);
        } else if (node.elseBranch) {
          return interpretAstNode(node.elseBranch, context);
        } else {
          output.push(`-> Condition is FALSE, no 'else' block found.`);
        }
        break;

      case "VariableAssignment":
        const varName = node.name;
        const valueNode = node.value;

        if (!/^[a-zA-Z]/.test(varName)) {
          output.push(
            `Error: Variable name '$${varName}' must start with a letter`
          );
          break;
        }

        // Evaluate the value expression
        let parsedValue: any;
        try {
          if (valueNode.type === 'Literal') {
            if (Array.isArray(valueNode.value)) {
              // Evaluar cada elemento del array recursivamente
              parsedValue = valueNode.value.map((el: any) => {
                if (el.type === 'Literal') return el.value;
                return interpretAstNode(el, context)[0];
              });
            } else if (typeof valueNode.value === 'string' && valueNode.value.startsWith('$')) {
              const refVarName = valueNode.value.substring(1);
              if (!(refVarName in variables)) {
                output.push(`Error: Variable '$${refVarName}' does not exist`);
                break;
              }
              parsedValue = variables[refVarName];
            } else {
              parsedValue = valueNode.value;
            }
          } else if (valueNode.type === 'IfStatement') {
            // Evaluate IF statement and get the result
            const conditionResult = evaluateCondition(valueNode.condition, variables);
            const selectedBranch = conditionResult ? valueNode.thenBranch : valueNode.elseBranch;
            
            if (!selectedBranch) {
              output.push(`Error: IF statement has no ${conditionResult ? 'then' : 'else'} branch`);
              break;
            }
            
            // Recursively evaluate the selected branch
            const branchOutput = interpretAstNode(selectedBranch, context);
            if (branchOutput.length === 1) {
              // Try to parse the output as a value
              const outputStr = branchOutput[0];
              if (outputStr.startsWith('$')) {
                const refVarName = outputStr.substring(1);
                if (!(refVarName in variables)) {
                  output.push(`Error: Variable '$${refVarName}' does not exist`);
                  break;
                }
                parsedValue = variables[refVarName];
              } else {
                // Try to parse as number, boolean, etc.
                if (/^-?\d+\.?\d*$/.test(outputStr)) {
                  parsedValue = Number.parseFloat(outputStr);
                } else if (outputStr === 'true') {
                  parsedValue = true;
                } else if (outputStr === 'false') {
                  parsedValue = false;
                } else {
                  parsedValue = outputStr;
                }
              }
            } else {
              output.push(`Error: IF statement branch returned multiple values`);
              break;
            }
          } else {
            // For other node types, try to evaluate them
            const valueOutput = interpretAstNode(valueNode, context);
            if (valueOutput.length === 1) {
              parsedValue = valueOutput[0];
            } else {
              output.push(`Error: Expression returned multiple values`);
              break;
            }
          }

          // Type checking for existing variables
          if (varName in variables) {
            const existingValue = variables[varName];
            const existingType = Array.isArray(existingValue)
              ? "array"
              : typeof existingValue;
            const newType = Array.isArray(parsedValue)
              ? "array"
              : typeof parsedValue;

            if (existingType !== newType) {
              output.push(
                `Error: Type mismatch! Variable '$${varName}' is ${existingType}, cannot assign ${newType} value`
              );
              break;
            }
          }

          setVariables((prev) => ({ ...prev, [varName]: parsedValue }));
          
          let displayValue: string;
          if (Array.isArray(parsedValue)) {
            displayValue = `[${parsedValue
              .map((v) => (typeof v === "string" ? `"${v}"` : v))
              .join(", ")}]`;
          } else if (typeof parsedValue === "string") {
            displayValue = `"${parsedValue}"`;
          } else {
            displayValue = String(parsedValue);
          }
          output.push(`Variable '$${varName}' set to: ${displayValue}`);
        } catch (error) {
          output.push(
            `Error evaluating expression: ${error instanceof Error ? error.message : String(error)}`
          );
        }
        break;

      case "DoLoop":
        const collectionName = node.collection;
        const paramName = node.param;
        const commandTemplate = node.command;

        if (!(collectionName in variables)) {
          output.push(`Error: Variable '$${collectionName}' does not exist.`);
          break;
        }

        const collection = variables[collectionName];
        if (!Array.isArray(collection)) {
          output.push(
            `Error: Variable '$${collectionName}' is not a collection (array).`
          );
          break;
        }

        output.push(
          `--- Iterating on '$${collectionName}' (${collection.length} items) ---`
        );
        if (collection.length === 0) {
          output.push("Collection is empty, no commands executed.");
        }

        for (let i = 0; i < collection.length; i++) {
          const element = collection[i];
          const processedCommand = commandTemplate.replace(
            new RegExp(`\\b${paramName}\\b`, "g"),
            () => {
              if (typeof element === "string") {
                return `'${element}'`;
              } else if (
                typeof element === "number" ||
                typeof element === "boolean"
              ) {
                return String(element);
              } else if (Array.isArray(element)) {
                return `[${element
                  .map((v) => (typeof v === "string" ? `'${v}'` : v))
                  .join(", ")}]`;
              } else {
                return JSON.stringify(element);
              }
            }
          );

          // Eliminar mensajes de elemento y Simulating
          try {
            const { parseCommandToAstNode } = require("./lexer");
            const ast = parseCommandToAstNode(processedCommand);
            const subOutput = interpretAstNode(ast, context);
            subOutput.forEach((line) => output.push(line));
          } catch (err) {
            output.push(`Error ejecutando comando: ${err}`);
          }
        }
        output.push("--- End Iteration ---");
        break;

      case "Command":
        const commandDef = COMMAND_DEFINITIONS[node.name];
        if (commandDef) {
          let commandArgs: any = node.args;
          // Evaluar recursivamente hasta obtener un valor primitivo
          commandArgs = evaluateToPrimitive(commandArgs, context);
          const commandOutput = commandDef.execute(commandArgs, {
            currentSection,
            router,
            variables,
            setVariables,
            setHistory,
          });
          output.push(...commandOutput);
        } else {
          output.push(
            `Command '${node.name}' not found.`,
            "Type 'help' for available commands.",
            `Did you mean: ${Object.keys(COMMAND_DEFINITIONS)
              .filter((cmd) => cmd.includes(node.name.charAt(0)))
              .slice(0, 3)
              .join(", ")}?`
          );
        }
        break;

      case "Unknown":
        output.push(
          `Command '${node.raw.split(" ")[0]}' not recognized.`,
          "Type 'help' for available commands."
        );
        break;
        
      case "Map": {
        const collectionName = node.collection;
        const paramName = node.param;
        const exprNode = node.expr;
        if (!(collectionName in variables)) {
          output.push(`Error: Variable '$${collectionName}' does not exist.`);
          break;
        }
        const collection = variables[collectionName];
        if (!Array.isArray(collection)) {
          output.push(`Error: Variable '$${collectionName}' is not a collection (array).`);
          break;
        }
        const result = collection.map((element: any) => {
          // Creamos un contexto temporal con la variable del parámetro
          const tempVars = { ...variables, [paramName]: element };
          // Evaluamos la expresión con el parámetro
          let val = evaluateToPrimitive(exprNode, { ...context, variables: tempVars });
          // Si es string y contiene el nombre del parámetro, reemplazar y evaluar aritmética
          if (typeof val === 'string' && val.includes(paramName)) {
            // Reemplazar todas las ocurrencias del parámetro por el valor
            let expr = val.replace(new RegExp(`\\b${paramName}\\b`, 'g'), element);
            // Evaluar aritmética
            const arith = evaluateArithmetic(expr);
            if (!arith.error) return arith.value;
            // Si no es aritmética, devolver el string reemplazado
            return expr;
          }
          return val;
        });
        return [JSON.stringify(result)];
      }
      case "Filter": {
        const collectionName = node.collection;
        const paramName = node.param;
        const exprNode = node.expr;
        if (!(collectionName in variables)) {
          output.push(`Error: Variable '$${collectionName}' does not exist.`);
          break;
        }
        const collection = variables[collectionName];
        if (!Array.isArray(collection)) {
          output.push(`Error: Variable '$${collectionName}' is not a collection (array).`);
          break;
        }
        const result = collection.filter((element: any) => {
          const tempVars = { ...variables, [paramName]: element };
          let val = evaluateToPrimitive(exprNode, { ...context, variables: tempVars });
          if (typeof val === 'string' && val.includes(paramName)) {
            let expr = val.replace(new RegExp(`\\b${paramName}\\b`, 'g'), element);
            const arith = evaluateArithmetic(expr);
            if (!arith.error) return !!arith.value;
            return !!expr;
          }
          return !!val;
        });
        return [JSON.stringify(result)];
      }
      default:
        output.push(`Unexpected command type: ${(node as any).type}`);
        break;
    }
  } catch (error) {
    output.push(
      `\x1b[31mInternal interpreter error: ${
        error instanceof Error ? error.message : String(error)
      }\x1b[0m`
    );
  }

  return output;
};
