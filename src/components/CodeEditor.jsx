import React, { useRef, useEffect } from "react";
import { RotateCcw, Lightbulb, CheckSquare, Code2 } from "lucide-react";
import { highlightReactCode } from "../utils/highlight";

export default function CodeEditor({
  code,
  onChange,
  onReset,
  onShowHint,
  onRevealSolution,
  onRunCode,
  title = "App.jsx",
}) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  // Generate arrays for line numbers
  const lineCount = code.split("\n").length || 1;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Synchronize scroll offsets between textarea and highlighter background
  const handleScroll = () => {
    const textarea = textareaRef.current;
    const pre = preRef.current;
    if (textarea && pre) {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [code]);

  // Handle Tab key insertion inside custom textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert two spaces for tab indentation
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      onChange(newValue);

      // Re-position cursor right after our indentation spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        handleScroll();
      }, 0);
    }
  };

  return (
    <div
      id="editor-container"
      className="bg-[#282c34] border border-[#181a1f] rounded-xl overflow-hidden flex flex-col h-full shadow-lg relative"
    >
      {/* Tab bar header */}
      <div className="bg-[#21252b] border-b border-[#181a1f] px-4 py-2 flex items-center justify-between shrink-0 h-11 select-none">
        <div className="flex items-center gap-2">
          {/* Mock Red, Yellow, Green Window Dots */}
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
          </div>

          <div className="bg-[#282c34] border-t-2 border-t-blue-500 text-slate-100 px-3 py-1 text-xs font-mono rounded-t-md flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{title}</span>
          </div>
        </div>

        {/* Action Widgets panel */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            id="editor-reset"
            className="p-1 px-2.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-455 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset to boilerplate template"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onShowHint}
            id="editor-hint"
            className="p-1 px-2.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-blue-455 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            title="Get learning hint"
          >
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">Hint</span>
          </button>

          <button
            onClick={onRevealSolution}
            id="editor-solution"
            className="p-1 px-2.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-emerald-455 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            title="Reveal solution key"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Solution</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden p-2 font-mono text-sm leading-6">
        {/* Line Numbers Column */}
        <div className="text-slate-600 text-right pr-3 pl-1 select-none border-r border-[#181a1f] flex flex-col pt-1.5 w-10">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Double-layered Editor Container */}
        <div className="flex-1 relative h-full">
          {/* Layer 1: Background Highlighted Code (Atom One Dark Theme styled) */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none w-full h-full px-4 pt-1.5 font-mono [font-family:Consolas,ui-monospace,monospace] text-sm leading-6 tracking-wide text-[#abb2bf] overflow-hidden whitespace-pre select-none [font-variant-ligatures:none]"
            dangerouslySetInnerHTML={{
              __html: highlightReactCode(code) + "\n",
            }}
          />

          {/* Layer 2: Transparent Textarea for User Interaction */}
          <textarea
            ref={textareaRef}
            id="code-textarea"
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white outline-none resize-none px-4 pt-1.5 font-mono [font-family:Consolas,ui-monospace,monospace] text-sm leading-6 tracking-wide whitespace-pre overflow-auto focus:ring-0 focus:outline-none focus:border-y-0 focus:border-x-0 border-transparent [font-variant-ligatures:none]"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck="false"
            placeholder="// Write React code here..."
          />
        </div>
      </div>

      {/* Bottom Button Panel */}
      <div className="bg-[#21252b]/95 border-t border-[#181a1f] p-3 flex items-center justify-between shrink-0 h-14 select-none">
        <span className="text-[11px] font-mono text-slate-500 font-medium">
          Lines: {lineCount} | Chars: {code.length}
        </span>

        <button
          onClick={onRunCode}
          id="btn-run-tests"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wide transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer grow-0 hover:scale-[1.01] active:scale-[0.98]"
        >
          <CheckSquare className="w-4 h-4 fill-white/10" />
          <span>RUN CODE & TESTS</span>
        </button>
      </div>
    </div>
  );
}
