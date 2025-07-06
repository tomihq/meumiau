import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AstNode } from "./types";
import { evaluateCondition } from "./interpreter";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const evaluateArithmetic = (expression: string): { value?: number; error?: string } => {
  try {
    const cleanExpr = expression.replace(/\s/g, "");

    if (!/^[\d+\-*/().]+$/.test(cleanExpr)) {
      return { error: "Invalid characters in arithmetic expression" };
    }

    const evaluateWithParentheses = (expr: string): number => {
      while (expr.includes("(")) {
        const lastOpen = expr.lastIndexOf("(");
        const firstClose = expr.indexOf(")", lastOpen);

        if (firstClose === -1) {
          throw new Error("Mismatched parentheses");
        }

        const innerExpr = expr.substring(lastOpen + 1, firstClose);
        const innerResult = evaluateLeftToRight(innerExpr);

        expr = expr.substring(0, lastOpen) + innerResult + expr.substring(firstClose + 1);
      }
      return evaluateLeftToRight(expr);
    };

    const evaluateLeftToRight = (expr: string): number => {
      const tokens = expr.split(/([+\-*/])/).filter((token) => token !== "");

      if (tokens.length === 1) {
        const num = Number.parseFloat(tokens[0]);
        if (isNaN(num)) {
          throw new Error("Invalid number in expression");
        }
        return num;
      }

      let result = Number.parseFloat(tokens[0]);
      if (isNaN(result)) {
        throw new Error("Invalid number in expression");
      }

      for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNum = Number.parseFloat(tokens[i + 1]);

        if (isNaN(nextNum)) {
          throw new Error("Invalid number in expression");
        }

        switch (operator) {
          case "+":
            result += nextNum;
            break;
          case "-":
            result -= nextNum;
            break
          case "*":
            result *= nextNum;
            break;
          case "/":
            if (nextNum === 0) {
              throw new Error("\x1b[31mError: Division by zero is not allowed\x1b[0m");
            }
            result /= nextNum;
            break;
          default:
            throw new Error(`Unknown operator: ${operator}`);
        }
      }
      return result;
    };

    const result = evaluateWithParentheses(cleanExpr);
    return { value: result };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Error evaluating arithmetic expression" };
  }
};

export const cleanBranch = (branch?: string | object): string | null => {
  if (!branch) return null;
  if (typeof branch === "string") {
    const trimmed = branch.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  }
  throw new Error("Branch must be a string to simulate");
};


export function astNodeToString(node: any): string {
  if (!node) return "";
  switch (node.type) {
    case "Command":
      return `${node.name} ${node.args || ""}`.trim();
    default:
      return "";
  }
}

export function extractBlock(input: string): { block: string; rest: string } | null {
  if (!input.startsWith("{")) return null;
  let depth = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "{") depth++;
    else if (input[i] === "}") depth--;
    if (depth === 0) {
      return { block: input.slice(1, i), rest: input.slice(i + 1) };
    }
  }
  return null; 
}

export function parseBranch(branchStr: string): AstNode {
  const trimmed = branchStr.trim();

  // Sacar paréntesis exteriores si hay
  let toParse = trimmed;
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    toParse = trimmed.slice(1, -1).trim();
  }

  // Intentar evaluar como expresión booleana
  const val = tryParseBooleanExpression(toParse);
  if (val !== null) {
    return { type: 'Literal', value: val };
  }

  // Si no es expresión, parsear como comando
  const parts = toParse.split(' ');
  return { type: 'Command', name: parts[0].toLowerCase(), args: parts.slice(1).join(' ') };
}


export function tryParseBooleanExpression(expr: string): boolean | null {
  const trimmed = expr.trim();

  const looksLikeBool =
    /^.+\s*[=!<>]=?\s*.+$/.test(trimmed) ||
    trimmed === "true" ||
    trimmed === "false" ||
    trimmed.startsWith("$");

  if (!looksLikeBool) return null;

  try {
    return evaluateCondition(trimmed, {}); 
  } catch {
    return null;
  }
}

export function findClosingParen(str: string, openIndex: number): number {
  let depth = 1;
  for (let i = openIndex + 1; i < str.length; i++) {
    if (str[i] === "(") depth++;
    else if (str[i] === ")") depth--;
    if (depth === 0) return i;
  }
  throw new Error("Unmatched parenthesis in: " + str);
}