import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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