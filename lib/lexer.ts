import { AstNode } from './types';

export const parseCommandToAstNode = (commandString: string): AstNode => {
  const trimmedCmd = commandString.trim();

  const ifRegex = /^(if)\s*\[([^\]]+)\]\s*then\s*([^;]+?)\s*(?:else\s*(.+))?$/i;
  const ifMatch = trimmedCmd.match(ifRegex);
  if (ifMatch) {
    return {
      type: 'IfStatement',
      condition: ifMatch[2].trim(),
      thenBranch: ifMatch[3].trim(),
      elseBranch: ifMatch[4]?.trim(),
    };
  }

  if (trimmedCmd.includes("=") && trimmedCmd.startsWith("$")) {
    const match = trimmedCmd.match(/^\$(\w+)\s*=\s*(.+)$/);
    if (match) {
      return { type: 'VariableAssignment', name: match[1], value: match[2] };
    }
  }

  const doMatch = trimmedCmd.match(/^\$(\w+)\.do\(\(([^)]+)\)\s*->\s*(.+)\)$/);
  if (doMatch) {
    return {
      type: 'DoLoop',
      collection: doMatch[1],
      param: doMatch[2],
      command: doMatch[3],
    };
  }

  const parts = trimmedCmd.split(" ");
  if (parts.length > 0) {
    return { type: 'Command', name: parts[0].toLowerCase(), args: parts.slice(1).join(" ") };
  }

  return { type: 'Unknown', raw: commandString };
};