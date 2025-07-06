import React from 'react'; 
import { AstNode, TerminalContext, CommandHistory, SubCommandContext, SectionInfo } from './types';
import { evaluateArithmetic } from './utils';
import { COMMAND_DEFINITIONS, processEchoArg } from './command';

const SECTIONS: Record<string, SectionInfo> = {
  home: { path: "/", description: "Home page - About Tomás" },
  skills: { path: "/skills", description: "Technical skills and technologies" },
  projects: { path: "/projects", description: "Current and featured projects" },
  notes: { path: "/notes", description: "Mathematical notes and thoughts" },
  blog: { path: "/blog", description: "Latest blog posts and articles" },
  contact: { path: "/contact", description: "Contact information and links" },
};


const evaluateCondition = (condition: string, currentVariables: Record<string, any>): boolean => {
  if (condition.toLowerCase() === "true") return true;
  if (condition.toLowerCase() === "false") return false;

  const comparisonMatch = condition.match(/^(.+?)\s*([=!<>]=|<=|>=)\s*(.+)$/);
  if (comparisonMatch) {
    const leftExpr = comparisonMatch[1].trim();
    const operator = comparisonMatch[2];
    const rightExpr = comparisonMatch[3].trim();

    let leftValue: any;
    let rightValue: any;

    if (leftExpr.startsWith("$")) {
      const varName = leftExpr.substring(1);
      if (varName in currentVariables) {
        leftValue = currentVariables[varName];
      } else {
        throw new Error(`Undefined variable: '$${varName}' in condition`);
      }
    } else {
      const arithmeticResult = evaluateArithmetic(leftExpr);
      if (!arithmeticResult.error) {
        leftValue = arithmeticResult.value;
      } else {
        leftValue = leftExpr.replace(/^["']|["']$/g, "");
      }
    }

    if (rightExpr.startsWith("$")) {
      const varName = rightExpr.substring(1);
      if (varName in currentVariables) {
        rightValue = currentVariables[varName];
      } else {
        throw new Error(`Undefined variable: '$${varName}' in condition`);
      }
    } else {
      const arithmeticResult = evaluateArithmetic(rightExpr);
      if (!arithmeticResult.error) {
        rightValue = arithmeticResult.value;
      } else {
        rightValue = rightExpr.replace(/^["']|["']$/g, "");
      }
    }

    switch (operator) {
      case "==": return leftValue == rightValue;
      case "!=": return leftValue != rightValue;
      case "<": return leftValue < rightValue;
      case ">": return leftValue > rightValue;
      case "<=": return leftValue <= rightValue;
      case ">=": return leftValue >= rightValue;
      default: throw new Error(`Unsupported comparison operator: ${operator}`);
    }
  }

  if (condition.startsWith("$")) {
    const varName = condition.substring(1);
    if (varName in currentVariables) {
      const value = currentVariables[varName];
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value !== 0 && !isNaN(value);
      if (typeof value === "string") return value.length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return !!value;
    }
    return false;
  }

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

  // Handle variable assignment simulation within sub-commands
  if (trimmedSubCmd.includes("=") && trimmedSubCmd.startsWith("$")) {
    const cleanCmd = trimmedSubCmd.replace(/;+/g, "");
    const match = cleanCmd.match(/^\$(\w+)\s*=\s*(.+)$/);
    if (match) {
      const [, varName, varValue] = match;
      let displayValue: string;

      if (varValue.trim().startsWith("$")) {
        const rightVarName = varValue.trim().substring(1);
        const rightVarValue = context.variables[rightVarName];
        if (rightVarName in context.variables) {
          displayValue = Array.isArray(rightVarValue)
            ? `[${rightVarValue.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`
            : typeof rightVarValue === "string"
              ? `"${rightVarValue}"`
              : String(rightVarValue);
          return [`Would set variable '$${varName}' to: ${displayValue} (from '$${rightVarName}')`];
        } else {
          return [`Would set variable '$${varName}' to: (Error: Variable '$${rightVarName}' not found)`];
        }
      }

      try {
        let parsedValue: any;
        const arithmeticRegex = /^[\d\s+\-*/().]+$/;
        const hasArithmetic = /[+\-*/]/.test(varValue) && arithmeticRegex.test(varValue);

        if (hasArithmetic) {
          const result = evaluateArithmetic(varValue.trim());
          if (result.error) {
            return [`Would set variable '$${varName}' to: (Error: ${result.error})`];
          }
          parsedValue = result.value;
        } else if ((varValue.startsWith('"') && varValue.endsWith('"')) || (varValue.startsWith("'") && varValue.endsWith("'"))) {
          parsedValue = varValue.slice(1, -1);
        } else if (varValue.startsWith("[") && varValue.endsWith("]")) {
          const arrayContent = varValue.slice(1, -1).trim();
          parsedValue = arrayContent === "" ? [] : arrayContent.split(",").map((item) => {
            const trimmed = item.trim();
            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
            else if (/^-?\d+\.?\d*$/.test(trimmed)) return Number.parseFloat(trimmed);
            else if (trimmed === "true" || trimmed === "false") return trimmed === "true";
            else return trimmed;
          });
        } else if (/^-?\d+\.?\d*$/.test(varValue)) {
          parsedValue = Number.parseFloat(varValue);
        } else if (varValue === "true" || varValue === "false") {
          parsedValue = varValue === "true";
        } else {
          parsedValue = varValue;
        }

        displayValue = Array.isArray(parsedValue)
          ? `[${parsedValue.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`
          : typeof parsedValue === "string"
            ? `"${parsedValue}"`
            : String(parsedValue);
        return [`Would set variable '$${varName}' to: ${displayValue}`];
      } catch (error) {
        return [`Would set variable '$${varName}' to: (Error parsing value: ${varValue})`];
      }
    }
  }

  const [command, ...args] = trimmedSubCmd.split(" ");
  const arg = args.join(" ");
  let subOutput: string[] = [];

  switch (command.toLowerCase()) {
    case "echo":
      subOutput = [processEchoArg(arg, context.variables, context.evaluateArithmetic)];
      break;
    case "cd":
      if (!arg) {
        subOutput = ["Usage: cd <section>", "Available sections: " + Object.keys(context.sections).join(", ")];
      } else if (arg === "..") {
        subOutput = [`Would navigate to: ${context.sections.home.path}`];
      } else if (arg in context.sections) {
        subOutput = [`Would navigate to: ${context.sections[arg as keyof typeof context.sections].path}`];
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
      if (varName && /^[a-zA-Z]/.test(varName) && varName in context.variables) {
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
              displayValue = `[${value.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`;
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
      subOutput = [`Simulated command '${command}' is not directly supported in this context.`];
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
  const { currentSection, router, variables, setVariables, setHistory, commandHistory, setIsOpen } = context;

  // Context for SIMULATED commands (read-only for variables, no direct state changes)
  const simulatedContext: SubCommandContext = {
    currentSection,
    variables, // Pass current variables for read-only access
    sections: SECTIONS, // Pass sections config
    evaluateArithmetic: evaluateArithmetic,
  };

  try {
    switch (node.type) {
      case 'IfStatement':
        output.push(`--- Simulating: if [${node.condition}] ---`);
        let conditionResult = evaluateCondition(node.condition, variables);
        output.push(`Condition '${node.condition}' evaluated to: ${conditionResult}`);
        output.push("");

        if (conditionResult) {
          output.push(`-> Condition is TRUE, executing 'then' block: '${node.thenBranch}'`);
          const subOutput = executeSimulatedSubCommand(node.thenBranch, simulatedContext);
          subOutput.forEach(line => output.push(`    ${line}`)); // Indent sub-command output
        } else if (node.elseBranch) {
          output.push(`-> Condition is FALSE, executing 'else' block: '${node.elseBranch}'`);
          const subOutput = executeSimulatedSubCommand(node.elseBranch, simulatedContext);
          subOutput.forEach(line => output.push(`    ${line}`)); // Indent sub-command output
        } else {
          output.push(`-> Condition is FALSE, no 'else' block found.`);
        }
        output.push("--- End Simulation ---");
        break;

      case 'VariableAssignment':
        const varName = node.name;
        const varValueStr = node.value;

        if (!/^[a-zA-Z]/.test(varName)) {
          output.push(`Error: Variable name '$${varName}' must start with a letter`);
          break;
        }

        // Handle arithmetic assignment: $var = $var + 2
        const arithmeticAssignMatch = varValueStr.trim().match(/^\$(\w+)\s*([+\-*/])\s*(.+)$/);
        if (arithmeticAssignMatch && arithmeticAssignMatch[1] === varName) {
            const [, sameVarName, operator, operandStr] = arithmeticAssignMatch;

            if (!(sameVarName in variables)) {
                output.push(`Error: Variable '$${sameVarName}' does not exist`);
                break;
            }
            const currentValue = variables[sameVarName];
            if (typeof currentValue !== 'number') {
                output.push(`Error: Cannot perform arithmetic on ${typeof currentValue} variable '$${sameVarName}'`);
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
                case "+": newValue = currentValue + operandValue; break;
                case "-": newValue = currentValue - operandValue; break;
                case "*": newValue = currentValue * operandValue; break;
                case "/":
                    if (operandValue === 0) { output.push(`Error: Division by zero is not allowed`); return output; }
                    newValue = currentValue / operandValue;
                    break;
                default: output.push(`Error: Unknown operator '${operator}'`); return output;
            }
            setVariables((prev) => ({ ...prev, [varName]: newValue }));
            output.push(`Variable '$${varName}' updated: ${currentValue} ${operator} ${operandValue} = ${newValue}`);
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
                const leftType = Array.isArray(leftVarValue) ? "array" : typeof leftVarValue;
                const rightType = Array.isArray(rightVarValue) ? "array" : typeof rightVarValue;
                if (leftType !== rightType) {
                    output.push(`Error: Type mismatch! Variable '$${varName}' is ${leftType}, cannot assign ${rightType} value from '$${rightVarName}'`);
                    break;
                }
            }
            setVariables((prev) => ({ ...prev, [varName]: rightVarValue }));
            let displayValue: string;
            if (Array.isArray(rightVarValue)) {
              displayValue = `[${rightVarValue.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`;
            } else if (typeof rightVarValue === "string") {
              displayValue = `"${rightVarValue}"`;
            } else {
              displayValue = String(rightVarValue);
            }
            output.push(`Variable '$${varName}' set to: ${displayValue} (from '$${rightVarName}')`);
            break;
        }

        let parsedValue: any;
        try {
          const arithmeticRegex = /^[\d\s+\-*/().]+$/;
          const hasArithmetic = /[+\-*/]/.test(varValueStr) && arithmeticRegex.test(varValueStr);

          if (hasArithmetic) {
            const result = evaluateArithmetic(varValueStr.trim());
            if (result.error) {
              output.push(result.error);
              break;
            }
            parsedValue = result.value;
          } else if ((varValueStr.startsWith('"') && varValueStr.endsWith('"')) || (varValueStr.startsWith("'") && varValueStr.endsWith("'"))) {
            parsedValue = varValueStr.slice(1, -1);
          } else if (varValueStr.startsWith("[") && varValueStr.endsWith("]")) {
            const arrayContent = varValueStr.slice(1, -1).trim();
            if (arrayContent === "") {
              parsedValue = [];
            } else {
              const items = arrayContent.split(",").map((item) => {
                const trimmed = item.trim();
                if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
                else if (/^-?\d+\.?\d*$/.test(trimmed)) return Number.parseFloat(trimmed);
                else if (trimmed === "true" || trimmed === "false") return trimmed === "true";
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
            const existingType = Array.isArray(existingValue) ? "array" : typeof existingValue;
            const newType = Array.isArray(parsedValue) ? "array" : typeof parsedValue;

            if (existingType !== newType) {
              output.push(`Error: Type mismatch! Variable '$${varName}' is ${existingType}, cannot assign ${newType} value`);
              break;
            }
          }
          setVariables((prev) => ({ ...prev, [varName]: parsedValue }));
          let displayValue: string;
          if (Array.isArray(parsedValue)) {
            displayValue = `[${parsedValue.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`;
          } else if (typeof parsedValue === "string") {
            displayValue = `"${parsedValue}"`;
          } else {
            displayValue = String(parsedValue);
          }
          output.push(`Variable '$${varName}' set to: ${displayValue}`);
        } catch (error) {
          output.push(
            `Error parsing value: ${varValueStr}`,
            "Make sure to use proper syntax for arrays [1,2,3] or strings 'text'",
          );
        }
        break;

      case 'DoLoop':
        const collectionName = node.collection;
        const paramName = node.param;
        const commandTemplate = node.command;

        if (!(collectionName in variables)) {
          output.push(`Error: Variable '$${collectionName}' does not exist.`);
          break;
        }

        const collection = variables[collectionName];
        if (!Array.isArray(collection)) {
          output.push(`Error: Variable '$${collectionName}' is not a collection (array).`);
          break;
        }

        output.push(`--- Iterating on '$${collectionName}' (${collection.length} items) ---`);
        if (collection.length === 0) {
          output.push("Collection is empty, no commands executed.");
        }

        for (let i = 0; i < collection.length; i++) {
          const element = collection[i];
          const processedCommand = commandTemplate.replace(new RegExp(`\\b${paramName}\\b`, "g"), () => {
            if (typeof element === "string") {
              return `'${element}'`;
            } else if (typeof element === "number" || typeof element === "boolean") {
              return String(element);
            } else if (Array.isArray(element)) {
                return `[${element.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')}]`;
            } else {
              return JSON.stringify(element);
            }
          });

          output.push(`  [${i}] - Element: ${
            typeof element === 'string' ? `'${element}'` :
            Array.isArray(element) ? `[${element.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')}]` :
            String(element)
          }`);
          output.push(`    Simulating: ${processedCommand}`);

          const subOutput = executeSimulatedSubCommand(processedCommand, simulatedContext);
          subOutput.forEach(line => output.push(`      ${line}`));
          output.push("");
        }
        output.push("--- End Iteration ---");
        break;

      case 'Command':
        const commandDef = COMMAND_DEFINITIONS[node.name];
        if (commandDef) {
          const commandOutput = commandDef.execute(node.args, {
            currentSection, router, variables, setVariables, setHistory, commandHistory, setIsOpen
          });
          output.push(...commandOutput);
        } else {
          output.push(
            `Command '${node.name}' not found.`,
            "Type 'help' for available commands.",
            `Did you mean: ${Object.keys(COMMAND_DEFINITIONS)
              .filter((cmd) => cmd.includes(node.name.charAt(0)))
              .slice(0, 3)
              .join(", ")}?`,
          );
        }
        break;

      case 'Unknown':
        output.push(
          `Command '${node.raw.split(' ')[0]}' not recognized.`,
          "Type 'help' for available commands."
        );
        break;
      default:
        output.push(`Unexpected command type: ${node.type}`);
        break;
    }
  } catch (error) {
    output.push(`\x1b[31mInternal interpreter error: ${error instanceof Error ? error.message : String(error)}\x1b[0m`);
  }

  return output;
};