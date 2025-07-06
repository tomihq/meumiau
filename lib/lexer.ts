import { ifRegex } from './regex';
import { AstNode } from './types';
import { findClosingParen, tryParseBooleanExpression } from './utils';

export const parseCommandToAstNode = (commandString: string): AstNode => {
  const trimmedCmd = commandString.trim();
  

  // ✅ Parse IF de forma estructural, no con regex
 if (trimmedCmd.startsWith("if (")) {
  const openIndex = 3; // posición del '(' luego de 'if '
  const conditionEnd = findClosingParen(trimmedCmd, openIndex);
  const condition = trimmedCmd.slice(openIndex + 1, conditionEnd).trim();

  const afterCond = trimmedCmd.slice(conditionEnd + 1).trim();
  if (!afterCond.toLowerCase().startsWith("then")) {
    throw new Error("Expected 'then' after if condition");
  }

  const thenStart = afterCond.indexOf("(");
  const thenEnd = findClosingParen(afterCond, thenStart);
  const thenBlock = afterCond.slice(thenStart + 1, thenEnd).trim();

  const afterThen = afterCond.slice(thenEnd + 1).trim();
  let elseBranch: AstNode | undefined = undefined;

  if (afterThen.toLowerCase().startsWith("else")) {
    const elseStart = afterThen.indexOf("(");
    const elseEnd = findClosingParen(afterThen, elseStart);
    const elseBlock = afterThen.slice(elseStart + 1, elseEnd).trim();
    elseBranch = parseCommandToAstNode(elseBlock);
  }

  return {
    type: "IfStatement",
    condition,
    thenBranch: parseCommandToAstNode(thenBlock),
    elseBranch,
  };
}

  // ✅ Variable assignment: $x = 5
  if (trimmedCmd.includes("=") && trimmedCmd.startsWith("$")) {
    const match = trimmedCmd.match(/^\$(\w+)\s*=\s*(.+)$/);
    if (match) {
      return { type: 'VariableAssignment', name: match[1], value: match[2] };
    }
  }

  // ✅ Do-loop: $list.do((x) -> ...)
  const doMatch = trimmedCmd.match(/^\$(\w+)\.do\(\(([^)]+)\)\s*->\s*(.+)\)$/);
  if (doMatch) {
    return {
      type: 'DoLoop',
      collection: doMatch[1],
      param: doMatch[2],
      command: doMatch[3],
    };
  }

  let cmdToParse = trimmedCmd;
  if (cmdToParse.startsWith('(') && cmdToParse.endsWith(')')) {
    cmdToParse = cmdToParse.slice(1, -1).trim();
  }

  const logicalValue = tryParseBooleanExpression(cmdToParse);
  if (logicalValue !== null) {
    return { type: 'Literal', value: logicalValue };
  }

  // ✅ Fallback: comando normal
  const parts = cmdToParse.split(" ");
  if (parts.length > 0) {
    return {
      type: 'Command',
      name: parts[0].toLowerCase(),
      args: parts.slice(1).join(" ")
    };
  }

  return { type: 'Unknown', raw: commandString };
};