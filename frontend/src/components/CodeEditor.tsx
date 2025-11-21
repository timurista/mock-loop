"use client";

import { useState, useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "python",
  placeholder,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  // Update line count when code changes
  useEffect(() => {
    const lines = value.split("\n").length;
    setLineCount(lines);
  }, [value]);

  // Handle tab key and auto-indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Bracket matching disabled to prevent syntax errors in comments
    // TODO: Implement smarter bracket matching that respects context

    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) {
        // Shift+Tab: Remove indentation
        const lines = value.split("\n");
        const startLine = value.substring(0, start).split("\n").length - 1;
        const endLine = value.substring(0, end).split("\n").length - 1;

        let newValue = lines
          .map((line, index) => {
            if (
              index >= startLine &&
              index <= endLine &&
              line.startsWith("    ")
            ) {
              return line.substring(4);
            }
            return line;
          })
          .join("\n");

        onChange(newValue);
      } else {
        // Tab: Add indentation
        const newValue =
          value.substring(0, start) + "    " + value.substring(end);
        onChange(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
    } else if (e.key === "Enter") {
      // Auto-indent on new line
      e.preventDefault();
      const currentLine = value.substring(0, start).split("\n").pop() || "";
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : "";

      // Add extra indent after colons (for Python)
      const extraIndent = currentLine.trim().endsWith(":") ? "    " : "";

      const newValue =
        value.substring(0, start) +
        "\n" +
        currentIndent +
        extraIndent +
        value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        const newCursorPos =
          start + 1 + currentIndent.length + extraIndent.length;
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      }, 0);
    } else if (e.key === "Backspace" && start === end) {
      // Smart backspace for indentation
      const beforeCursor = value.substring(0, start);
      const currentLine = beforeCursor.split("\n").pop() || "";

      if (currentLine.match(/^\s+$/) && currentLine.length >= 4) {
        e.preventDefault();
        const newValue = value.substring(0, start - 4) + value.substring(end);
        onChange(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 4;
        }, 0);
      }
    }
  };

  // Syntax highlighting for Python (basic)
  const highlightSyntax = (code: string) => {
    if (language !== "python") return code;

    return code
      .replace(
        /(def|class|if|else|elif|for|while|try|except|finally|with|import|from|return|yield|pass|break|continue|and|or|not|in|is|lambda|global|nonlocal)\b/g,
        '<span style="color: #569cd6;">$1</span>'
      )
      .replace(
        /(True|False|None)\b/g,
        '<span style="color: #4fc1ff;">$1</span>'
      )
      .replace(/(".*?"|\'.*?\')/g, '<span style="color: #ce9178;">$1</span>')
      .replace(/(#.*$)/gm, '<span style="color: #6a9955;">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>');
  };

  return (
    <div className="flex h-full bg-neutral-900 text-neutral-100 font-mono text-sm">
      {/* Line Numbers */}
      <div className="flex-shrink-0 bg-neutral-800 border-r border-neutral-700 px-3 py-4 text-right text-neutral-500 select-none min-w-[50px]">
        {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
          <div
            key={i + 1}
            style={{
              lineHeight: "1.5rem",
              fontSize: "12px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code Input Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Syntax Highlighted Background */}
        <div
          className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words overflow-hidden text-transparent select-none"
          dangerouslySetInnerHTML={{ __html: highlightSyntax(value || "") }}
          style={{
            lineHeight: "1.5rem",
            fontSize: "14px",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            letterSpacing: "0",
            wordSpacing: "0",
          }}
        />

        {/* Actual Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 bg-transparent text-neutral-100 resize-none focus:outline-none relative z-10 whitespace-pre-wrap break-words"
          placeholder={placeholder}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            lineHeight: "1.5rem",
            fontSize: "14px",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            caretColor: "#ffffff",
            letterSpacing: "0",
            wordSpacing: "0",
          }}
        />
      </div>
    </div>
  );
}
