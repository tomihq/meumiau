import React from "react";
import {
  AstNode,
  TerminalContext,
  CommandHistory,
  SubCommandContext,
  SectionInfo,
} from "./types";
import { astNodeToString, cleanBranch, evaluateArithmetic, extractBlock } from "./utils";
import { COMMAND_DEFINITIONS, processEchoArg } from "./command";
import { ifRegex } from "./regex";

const SECTIONS: Record<string, SectionInfo> = {
  home: { path: "/", description: "Home page - About Tomás" },
  skills: { path: "/skills", description: "Technical skills and technologies" },
  projects: { path: "/projects", description: "Current and featured projects" },
  notes: { path: "/notes", description: "Mathematical notes and thoughts" },
  blog: { path: "/blog", description: "Latest blog posts and articles" },
  contact: { path: "/contact", description: "Contact information and links" },
};

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

      // Try to evaluate as arithmetic
      const arithmeticResult = evaluateArithmetic(expr);
      if (!arithmeticResult.error) return arithmeticResult.value;

      // Try parsing as string
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

// Helper for simulated command execution (no side effects on actual state)
export const executeSimulatedSubCommand = (
  subCmd: string,
  context: SubCommandContext
): string[] => {
  const trimmedSubCmd = subCmd.trim();
  if (!trimmedSubCmd) return [""];
  console.log(trimmedSubCmd)

  // 🌟 Handle IF THEN ELSE
  const match = trimmedSubCmd.match(ifRegex);
  if (match) {
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

    // Ejecuta recursivamente el contenido seleccionado
    return executeSimulatedSubCommand(selectedBlock, context);
  }

  // 🌟 Handle variable assignment simulation
  if (trimmedSubCmd.includes("=") && trimmedSubCmd.startsWith("$")) {
    // ... tu código existente para asignación de variables ...
    // (sin cambios aquí)
  }

  // 🌟 Base command execution — strip brackets if present
  const commandLine = trimmedSubCmd.replace(/^\[|\]$/g, "").trim();

  const [command, ...args] = commandLine.split(" ");
  const arg = args.join(" ");
  let subOutput: string[] = [];

  switch (command.toLowerCase()) {
    case "echo":
      subOutput = [
        processEchoArg(arg, context.variables, context.evaluateArithmetic),
      ];
      break;
    case "cd":
      if (!arg) {
        subOutput = [
          "Usage: cd <section>",
          "Available sections: " + Object.keys(context.sections).join(", "),
        ];
      } else if (arg === "..") {
        subOutput = [`Would navigate to: ${context.sections.home.path}`];
      } else if (arg in context.sections) {
        subOutput = [
          `Would navigate to: ${
            context.sections[arg as keyof typeof context.sections].path
          }`,
        ];
      } else {
        subOutput = [`cd: ${arg}: No such section (in simulation)`];
      }
      break;
    case "pwd":
      subOutput = [`Simulated current path: ${context.currentSection}`];
      break;
    case "date":
      subOutput = [`Simulated current date: ${new Date().toString()}`];
      break;
    case "unset":
      let varName = arg.replace(/;+/g, "").trim();
      if (varName.startsWith("$")) {
        varName = varName.substring(1);
      }
      if (
        varName &&
        /^[a-zA-Z]/.test(varName) &&
        varName in context.variables
      ) {
        subOutput = [`Would remove variable '$${varName}'.`];
      } else {
        subOutput = [`Variable '$${varName}' not found (in simulation).`];
      }
      break;
    case "vars":
      if (Object.keys(context.variables).length === 0) {
        subOutput = ["No variables defined in main scope."];
      } else {
        subOutput = [
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
      break;
    default:
      subOutput = [
        `Simulated command '${commandLine}' is not directly supported in this context.`,
      ];
  }

  return subOutput;
};

// Main interpreter function
export const interpretAstNode = (
  node: AstNode,
  context: {
    currentSection: string;
    router: any;
    variables: Record<string, any>;
    setVariables: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setHistory: React.Dispatch<React.SetStateAction<CommandHistory[]>>; // For 'clear' etc.
    commandHistory: string[]; // For 'history' command
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // For 'exit'
  }
): string[] => {
  const output: string[] = [];
  const {
    currentSection,
    router,
    variables,
    setVariables,
    setHistory,
    commandHistory,
    setIsOpen,
  } = context;
  console.log(node)
  

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
        return node.value
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
        const varValueStr = node.value;

        if (!/^[a-zA-Z]/.test(varName)) {
          output.push(
            `Error: Variable name '$${varName}' must start with a letter`
          );
          break;
        }

        // Handle arithmetic assignment: $var = $var + 2
        const arithmeticAssignMatch = varValueStr
          .trim()
          .match(/^\$(\w+)\s*([+\-*/])\s*(.+)$/);
        if (arithmeticAssignMatch && arithmeticAssignMatch[1] === varName) {
          const [, sameVarName, operator, operandStr] = arithmeticAssignMatch;

          if (!(sameVarName in variables)) {
            output.push(`Error: Variable '$${sameVarName}' does not exist`);
            break;
          }
          const currentValue = variables[sameVarName];
          if (typeof currentValue !== "number") {
            output.push(
              `Error: Cannot perform arithmetic on ${typeof currentValue} variable '$${sameVarName}'`
            );
            break;
          }

          let operandValue: number;
          const cleanOperand = operandStr.trim();
          if (/^-?\d+\.?\d*$/.test(cleanOperand)) {
            operandValue = Number.parseFloat(cleanOperand);
          } else {
            const result = evaluateArithmetic(cleanOperand);
            if (result.error) {
              output.push(`Error in operand: ${result.error}`);
              break;
            }
            operandValue = result.value!;
          }
          if (isNaN(operandValue)) {
            output.push(`Error: Invalid operand '${operandStr}'`);
            break;
          }

          let newValue: number;
          switch (operator) {
            case "+":
              newValue = currentValue + operandValue;
              break;
            case "-":
              newValue = currentValue - operandValue;
              break;
            case "*":
              newValue = currentValue * operandValue;
              break;
            case "/":
              if (operandValue === 0) {
                output.push(`Error: Division by zero is not allowed`);
                return output;
              }
              newValue = currentValue / operandValue;
              break;
            default:
              output.push(`Error: Unknown operator '${operator}'`);
              return output;
          }
          setVariables((prev) => ({ ...prev, [varName]: newValue }));
          output.push(
            `Variable '$${varName}' updated: ${currentValue} ${operator} ${operandValue} = ${newValue}`
          );
          break;
        }

        if (varValueStr.trim().startsWith("$")) {
          const rightVarName = varValueStr.trim().substring(1);
          if (!(rightVarName in variables)) {
            output.push(`Error: Variable '$${rightVarName}' does not exist`);
            break;
          }
          const rightVarValue = variables[rightVarName];
          if (varName in variables) {
            const leftVarValue = variables[varName];
            const leftType = Array.isArray(leftVarValue)
              ? "array"
              : typeof leftVarValue;
            const rightType = Array.isArray(rightVarValue)
              ? "array"
              : typeof rightVarValue;
            if (leftType !== rightType) {
              output.push(
                `Error: Type mismatch! Variable '$${varName}' is ${leftType}, cannot assign ${rightType} value from '$${rightVarName}'`
              );
              break;
            }
          }
          setVariables((prev) => ({ ...prev, [varName]: rightVarValue }));
          let displayValue: string;
          if (Array.isArray(rightVarValue)) {
            displayValue = `[${rightVarValue
              .map((v) => (typeof v === "string" ? `"${v}"` : v))
              .join(", ")}]`;
          } else if (typeof rightVarValue === "string") {
            displayValue = `"${rightVarValue}"`;
          } else {
            displayValue = String(rightVarValue);
          }
          output.push(
            `Variable '$${varName}' set to: ${displayValue} (from '$${rightVarName}')`
          );
          break;
        }

        let parsedValue: any;
        try {
          const arithmeticRegex = /^[\d\s+\-*/().]+$/;
          const hasArithmetic =
            /[+\-*/]/.test(varValueStr) && arithmeticRegex.test(varValueStr);

          if (hasArithmetic) {
            const result = evaluateArithmetic(varValueStr.trim());
            if (result.error) {
              output.push(result.error);
              break;
            }
            parsedValue = result.value;
          } else if (
            (varValueStr.startsWith('"') && varValueStr.endsWith('"')) ||
            (varValueStr.startsWith("'") && varValueStr.endsWith("'"))
          ) {
            parsedValue = varValueStr.slice(1, -1);
          } else if (varValueStr.startsWith("[") && varValueStr.endsWith("]")) {
            const arrayContent = varValueStr.slice(1, -1).trim();
            if (arrayContent === "") {
              parsedValue = [];
            } else {
              const items = arrayContent.split(",").map((item) => {
                const trimmed = item.trim();
                if (
                  (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                  (trimmed.startsWith("'") && trimmed.endsWith("'"))
                )
                  return trimmed.slice(1, -1);
                else if (/^-?\d+\.?\d*$/.test(trimmed))
                  return Number.parseFloat(trimmed);
                else if (trimmed === "true" || trimmed === "false")
                  return trimmed === "true";
                else return trimmed;
              });
              parsedValue = items;
            }
          } else if (/^-?\d+\.?\d*$/.test(varValueStr)) {
            parsedValue = Number.parseFloat(varValueStr);
          } else if (varValueStr === "true" || varValueStr === "false") {
            parsedValue = varValueStr === "true";
          } else {
            parsedValue = varValueStr;
          }

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
            `Error parsing value: ${varValueStr}`,
            "Make sure to use proper syntax for arrays [1,2,3] or strings 'text'"
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

          output.push(
            `  [${i}] - Element: ${
              typeof element === "string"
                ? `'${element}'`
                : Array.isArray(element)
                ? `[${element
                    .map((v) => (typeof v === "string" ? `'${v}'` : v))
                    .join(", ")}]`
                : String(element)
            }`
          );
          output.push(`    Simulating: ${processedCommand}`);

          const subOutput = executeSimulatedSubCommand(
            processedCommand,
            simulatedContext
          );
          subOutput.forEach((line) => output.push(`      ${line}`));
          output.push("");
        }
        output.push("--- End Iteration ---");
        break;

      case "Command":
        const commandDef = COMMAND_DEFINITIONS[node.name];
        if (commandDef) {
          const commandOutput = commandDef.execute(node.args, {
            currentSection,
            router,
            variables,
            setVariables,
            setHistory,
            commandHistory,
            setIsOpen,
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
      case "Literal":
          return   node.value;

      case "Unknown":
        output.push(
          `Command '${node.raw.split(" ")[0]}' not recognized.`,
          "Type 'help' for available commands."
        );
        break;
      default:
        output.push(`Unexpected command type: ${node.type}`);
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
