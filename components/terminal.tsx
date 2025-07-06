// src/components/Terminal.tsx
"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TerminalIcon, X, Minimize2, Maximize2 } from "lucide-react"

// Importar los módulos modularizados
import { CommandHistory, SectionInfo } from "@/lib/types"
import { parseCommandToAstNode } from "@/lib/lexer"
import { interpretAstNode } from "@/lib/interpreter"
import { COMMAND_DEFINITIONS } from "@/lib/command"
import { useRouter } from "next/navigation"

interface TerminalProps {
  currentSection: string
  onNavigate: (section: string) => void
}

// Mantenemos SECTIONS aquí para uso del componente (e.g. autocompletado)
const SECTIONS: Record<string, SectionInfo> = {
  home: { path: "/", description: "Home page - About Tomás" },
  skills: { path: "/skills", description: "Technical skills and technologies" },
  projects: { path: "/projects", description: "Current and featured projects" },
  notes: { path: "/notes", description: "Mathematical notes and thoughts" },
  blog: { path: "/blog", description: "Latest blog posts and articles" },
  contact: { path: "/contact", description: "Contact information and links" },
}

export default function Terminal({ currentSection, onNavigate = () => {} }: TerminalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandHistory[]>([]) // Output history
  const [commandHistory, setCommandHistory] = useState<string[]>([]) // Input command history for Arrows
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState("/") // This will be derived from currentSection
  const [variables, setVariables] = useState<Record<string, any>>({}) // User-defined variables

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Keyboard shortcuts (remain here as they affect terminal UI state)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Function to add command and output to display history
  const addToHistory = useCallback((command: string, output: string[]) => {
    const newEntry: CommandHistory = {
      command,
      output,
      timestamp: new Date(),
    }
    setHistory((prev) => [...prev, newEntry])
  }, [])

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim()
      if (!trimmedCmd) return
      console.log(trimmedCmd)
      setCommandHistory((prev) => [...prev, trimmedCmd])

      const astNode = parseCommandToAstNode(trimmedCmd); 

      const executionContext = {
        currentSection,
        router,
        variables,
        setVariables,
        setHistory, // Pass setHistory for 'clear'
        commandHistory, // Pass for 'history' command
        setIsOpen, // Pass for 'exit' command
      };
      const commandOutput = interpretAstNode(astNode, executionContext); // Interpret/Execute

      // Add the command and its output to the display history
      addToHistory(trimmedCmd, commandOutput);
    },
    [
      currentSection,
      router,
      variables,
      setVariables,
      addToHistory,
      commandHistory,
      setHistory,
      setIsOpen,
    ]
  );


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const [command, ...args] = input.split(" ")

      if (args.length === 0) {
        const matches = Object.keys(COMMAND_DEFINITIONS).filter((cmd) => cmd.startsWith(command))
        if (matches.length === 1) {
          setInput(matches[0] + " ")
        }
      } else if (command === "cd" || command === "cat") {
        const partial = args[args.length - 1]
        const matches = Object.keys(SECTIONS).filter((section) => section.startsWith(partial))
        if (matches.length === 1) {
          const newArgs = [...args.slice(0, -1), matches[0]]
          setInput(command + " " + newArgs.join(" "))
        }
      } else if (input.includes("$")) {
        const lastDollarIndex = input.lastIndexOf("$")
        const afterDollar = input.substring(lastDollarIndex + 1)
        const variableMatches = Object.keys(variables).filter((varName) => varName.startsWith(afterDollar))
        if (variableMatches.length === 1) {
          const newInput = input.substring(0, lastDollarIndex + 1) + variableMatches[0]
          setInput(newInput)
        }
      }
    }
  }

  const getPrompt = () => {
    const user = "tomas"
    const host = "portfolio"
    const path = currentPath === "/" ? "~" : `~${currentPath}`
    return `${user}@${host}:${path}$`
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-slate-800/80 md:bg-transparent hover:bg-black/90 border border-purple-500/50 text-purple-400 font-mono"
        size="sm"
      >
        <TerminalIcon className="w-4 h-4 mr-2" />
        Terminal
      </Button>
    )
  }

  return (
    <div className="fixed inset-4 z-50 flex items-center justify-center pointer-events-none">
      <Card
        className={`w-full max-w-4xl bg-slate-900/90 border-purple-500/50 font-mono text-sm pointer-events-auto transition-all duration-300  ${
          isMinimized ? "h-12" : "h-96"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400">tomas@portfolio: ~</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 p-0 hover:bg-gray-700/50"
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3 text-gray-400" />
              ) : (
                <Minimize2 className="w-3 h-3 text-gray-400" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 p-0 hover:bg-gray-700/50"
            >
              <X className="w-3 h-3 text-gray-400" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <CardContent className="p-0 h-full flex flex-col bg-slate-800/80">
            {/* Terminal Output */}
            <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-900/90">
              {history.length === 0 && (
                <div className="text-purple-400">
                  <div>Welcome to Tomás Portfolio Terminal v1.0.0</div>
                  <div>Type 'help' for available commands.</div>
                  <div>Use Ctrl+` to toggle terminal.</div>
                  <div></div>
                </div>
              )}

              {history.map((entry, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-purple-300">
                    <span className="text-blue-400">{getPrompt()}</span> {entry.command}
                  </div>
                 {(Array.isArray(entry.output) ? entry.output : [String(entry.output)]).map(
  (line, lineIndex) => (
    <div
      key={lineIndex}
      className={`pl-2 ${
        line.includes("\x1b[31m") ? "text-red-400" : "text-gray-300"
      }`}
      dangerouslySetInnerHTML={{
        __html: line
          .replace(/\x1b\[31m/g, "")
          .replace(/\x1b\[0m/g, ""),
      }}
    />
  )
)}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/90 border-t border-purple-500/20">
              <span className="text-blue-400 flex-shrink-0">{getPrompt()}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-purple-400 outline-none caret-purple-400 border-b border-purple-500/30 pb-1 placeholder:text-gray-500 placeholder:opacity-60 pl-1"
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}