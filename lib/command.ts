import { SectionInfo, CommandHistory, CommandDefinition } from './types';
import { evaluateArithmetic } from './utils';

export const processEchoArg = (
  arg: string,
  variables: Record<string, any>,
  evalArithmetic: typeof evaluateArithmetic
): string => {
  if (!arg) return "";

  const cleanArg = arg.replace(/;+/g, "");

  if (cleanArg.includes("{") && cleanArg.includes("}")) {
    let processedString = cleanArg;
    const templateRegex = /\{([^}]+)\}/g;
    let match;

    while ((match = templateRegex.exec(cleanArg)) !== null) {
      const fullMatch = match[0];
      const expression = match[1].trim();
      let replacementValue = "";

      try {
        if (expression.startsWith("$")) {
          const varName = expression.substring(1);
          if (varName in variables) {
            const value = variables[varName];
            replacementValue = Array.isArray(value)
              ? `[${value.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`
              : typeof value === "string"
                ? value
                : String(value);
          } else {
            replacementValue = `{undefined variable: ${varName}}`;
          }
        } else if (/^[\d\s+\-*/().]+$/.test(expression)) {
          const result = evalArithmetic(expression);
          if (result.error) {
            replacementValue = `{error: ${result.error}}`;
          } else {
            replacementValue = result.value!.toString();
          }
        } else if (expression in variables) { 
          const value = variables[expression];
          replacementValue = Array.isArray(value)
            ? `[${value.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`
            : typeof value === "string"
              ? value
              : String(value);
        } else {
          replacementValue = expression;
        }
        processedString = processedString.replace(fullMatch, replacementValue);
      } catch (error) {
        processedString = processedString.replace(fullMatch, `{error: ${error}}`);
      }
    }

    if (
      (processedString.startsWith('"') && processedString.endsWith('"')) ||
      (processedString.startsWith("'") && processedString.endsWith("'"))
    ) {
      processedString = processedString.slice(1, -1);
    }
    return processedString;
  } else if (cleanArg.startsWith("$")) {
    const varName = cleanArg.substring(1);
    if (varName && !/^[a-zA-Z]/.test(varName)) {
      return `Error: Variable name '$${varName}' must start with a letter`;
    } else if (varName in variables) {
      const value = variables[varName];
      return Array.isArray(value)
        ? `[${value.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`
        : typeof value === "string"
          ? value
          : String(value);
    } else {
      return `Variable '${varName}' not found. Use 'vars' to see all variables.`;
    }
  } else if (cleanArg in variables) { 
    const value = variables[cleanArg];
    return Array.isArray(value)
      ? `[${value.map((v) => (typeof v === "string" ? `"${v}"` : v)).join(", ")}]`
      : typeof value === "string"
        ? value
        : String(value);
  } else {
    return cleanArg;
  }
};


export const COMMAND_DEFINITIONS: Record<string, CommandDefinition> = {
  help: {
    description: "Show available commands",
    execute: (args, { currentSection, variables, setVariables, setHistory }) => [
      "Available commands:",
      "",
      ...Object.entries(COMMAND_DEFINITIONS).map(([cmd, def]) => `  ${cmd.padEnd(12)} - ${def.description}`),
      "",
      "Navigation:",
      "  cd <section>   - Navigate to: home, skills, projects, notes, blog, contact",
      "  cd ..          - Go back to home",
      "",
      "Variables:",
      "  $name = 'John'         - Define string variable",
      "  $age = 25              - Define number variable",
      "  $list = [1,2,3]        - Define array variable",
      "  echo $name             - Display variable value",
      "  vars                   - List all variables",
      "  unset $name            - Remove variable",
      "",
      "Template Strings:",
      "  echo 'Hello, {$name}'      - Use {$var} for variable interpolation",
      "  echo 'Result: {2 + 3}'     - Use {expression} for arithmetic",
      "  echo 'Mix: {$age} + {5}'   - Combine variables and expressions",
      "",
      "Iteration:",
      "  $list.do((:item) -> echo :item)  - Execute command for each element",
      "  $nums.do((:n) -> echo Number: :n) - Custom command with parameter",
      "",
      "Conditional Simulation (does NOT modify state):",
      "  if [condition] then command [else command]",
      "  Examples:",
      "    if [true] then echo 'Hello World'",
      "    if [$x > 10] then echo 'X is large' else echo 'X is small'",
      "    if [$name == 'Tom'] then cd contact",
      "",
      "Shortcuts:",
      "  Ctrl+`         - Toggle terminal",
      "  ↑/↓            - Command history",
      "  Tab            - Autocomplete",
      "  Esc            - Close terminal",
    ],
  },
  ls: {
    description: "List available sections",
    execute: (args, { currentSection }) => {
      const SECTIONS: Record<string, SectionInfo> = { // Defined here or imported from config
        home: { path: "/", description: "Home page - About Tomás" },
        skills: { path: "/skills", description: "Technical skills and technologies" },
        projects: { path: "/projects", description: "Current and featured projects" },
        notes: { path: "/notes", description: "Mathematical notes and thoughts" },
        blog: { path: "/blog", description: "Latest blog posts and articles" },
        contact: { path: "/contact", description: "Contact information and links" },
      };
      return [
        "Available sections:",
        "",
        ...Object.entries(SECTIONS).map(([section, info]) => {
          const current = section === currentSection ? " (current)" : "";
          return `  ${section.padEnd(12)} - ${info.description}${current}`;
        }),
      ];
    },
  },
  cd: {
    description: "Change directory (navigate to section)",
    execute: (arg, { router }) => {
      const SECTIONS: Record<string, SectionInfo> = {
        home: { path: "/", description: "Home page - About Tomás" },
        skills: { path: "/skills", description: "Technical skills and technologies" },
        projects: { path: "/projects", description: "Current and featured projects" },
        notes: { path: "/notes", description: "Mathematical notes and thoughts" },
        blog: { path: "/blog", description: "Latest blog posts and articles" },
        contact: { path: "/contact", description: "Contact information and links" },
      };

      if (!arg) {
        return ["Usage: cd <section>", "Available sections: " + Object.keys(SECTIONS).join(", ")];
      } else if (arg === ".." || arg === "home") {
        router.push("/");
        return [`Changed directory to: ${SECTIONS.home.path}`];
      } else if (arg in SECTIONS) {
        router.push(`${arg}`);
        return [`Changed directory to: ${SECTIONS[arg as keyof typeof SECTIONS].path}`];
      } else {
        return [`cd: ${arg}: No such section`, "Available sections: " + Object.keys(SECTIONS).join(", ")];
      }
    },
  },
  pwd: {
    description: "Print working directory (current section)",
    execute: (args, { currentSection }) => {
      const SECTIONS: Record<string, SectionInfo> = { // Defined here or imported from config
        home: { path: "/", description: "Home page - About Tomás" },
        skills: { path: "/skills", description: "Technical skills and technologies" },
        projects: { path: "/projects", description: "Current and featured projects" },
        notes: { path: "/notes", description: "Mathematical notes and thoughts" },
        blog: { path: "/blog", description: "Latest blog posts and articles" },
        contact: { path: "/contact", description: "Contact information and links" },
      };
      return [SECTIONS[currentSection as keyof typeof SECTIONS]?.path || "/"];
    },
  },
  clear: {
    description: "Clear terminal screen",
    execute: (args, { setHistory }) => {
      setHistory([]);
      return []; // Return empty as it clears the screen directly
    },
  },
  whoami: {
    description: "Display current user info",
    execute: () => [
      "tomas@portfolio",
      "",
      "Full-stack Developer & Entrepreneur",
      "Passionate about React, Next.js, and Mathematics",
      "Anime lover 🎌 | Coffee addict ☕ | Tech enthusiast 🚀",
    ],
  },
  date: {
    description: "Show current date and time",
    execute: () => [new Date().toString()],
  },
  echo: {
    description: "Display a line of text or variable value",
    execute: (arg, { variables }) => [processEchoArg(arg, variables, evaluateArithmetic)],
  },
  cat: {
    description: "Display section information",
    execute: (arg) => {
      const SECTIONS: Record<string, SectionInfo> = { // Defined here or imported from config
        home: { path: "/", description: "Home page - About Tomás" },
        skills: { path: "/skills", description: "Technical skills and technologies" },
        projects: { path: "/projects", description: "Current and featured projects" },
        notes: { path: "/notes", description: "Mathematical notes and thoughts" },
        blog: { path: "/blog", description: "Latest blog posts and articles" },
        contact: { path: "/contact", description: "Contact information and links" },
      };

      if (!arg) {
        return ["Usage: cat <section>", "Available sections: " + Object.keys(SECTIONS).join(", ")];
      } else if (arg in SECTIONS) {
        const section = SECTIONS[arg as keyof typeof SECTIONS];
        return [`Section: ${arg}`, `Path: ${section.path}`, `Description: ${section.description}`];
      } else {
        return [`cat: ${arg}: No such section`];
      }
    },
  },
  tree: {
    description: "Show site structure",
    execute: () => [
      "portfolio/",
      "├── home/           # About Tomás",
      "├── skills/         # Technical expertise",
      "├── projects/       # Featured work",
      "├── notes/          # Math & code notes",
      "├── blog/           # Latest articles",
      "└── contact/        # Get in touch",
      "",
      "6 directories, ∞ possibilities",
    ],
  },
  history: {
    description: "Show command history",
    execute: (args, { commandHistory }) => [ // Needs commandHistory from outer scope
      "Command history:",
      "",
      ...commandHistory.map((cmd, index) => `  ${(index + 1).toString().padStart(3)}: ${cmd}`),
    ],
  },
  exit: {
    description: "Close terminal",

    execute: (args, { setIsOpen }) => { // Needs setIsOpen from outer scope
      setIsOpen(false);
      return ["Terminal closed."];
    },
  },
  vars: {
    description: "List all defined variables",
    execute: (args, { variables }) => {
      if (Object.keys(variables).length === 0) {
        return ["No variables defined."];
      } else {
        return [
          "Defined variables:",
          "",
          ...Object.entries(variables).map(([name, value]) => {
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
    },
  },
  unset: {
    description: "Remove a variable (unset $name)",
    execute: (arg, { variables, setVariables }) => {
      if (!arg) {
        return ["Usage: unset $variable_name", "Example: unset $name"];
      } else {
        let varName = arg.replace(/;+/g, "").trim();
        if (varName.startsWith("$")) {
          varName = varName.substring(1);
        }

        if (varName && !/^[a-zA-Z]/.test(varName)) {
          return [`Error: Variable name '$${varName}' must start with a letter`];
        } else if (varName in variables) {
          setVariables((prev) => {
            const newVars = { ...prev };
            delete newVars[varName];
            return newVars;
          });
          return [`Variable '$${varName}' removed.`];
        } else {
          return [`Variable '$${varName}' not found.`];
        }
      }
    },
  },
};