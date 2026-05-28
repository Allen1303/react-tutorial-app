/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  Trophy,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  ListRestart,
  GraduationCap,
  Play,
  RotateCcw,
  BookMarked,
  Layers,
  Sparkle,
  X,
  Search,
  CheckCircle,
  HelpCircle,
  Info,
} from "lucide-react";

import { CURRICULUM } from "./data/lessons";
import Sidebar from "./components/Sidebar";
import CodeEditor from "./components/CodeEditor";
import PreviewArea from "./components/PreviewArea";
import TestConsole from "./components/TestConsole";
import Markdown from "./components/Markdown";
import { highlightReactCode } from "./utils/highlight";

// Definitive Cheat Sheets for developer reference
const CHEAT_SHEETS = [
  {
    title: "1. JSX (JavaScript XML)",
    content:
      "Allows writing HTML markup inside JS dynamically. Single root element required. Attributes use camelCase (e.g. `className` instead of `class`, `onClick` instead of `onclick`). Use tags `<>` and `</>` (React Fragment) to avoid nested wrappers.",
    example: 'const element = <h1 className="title">Hello {name}!</h1>;',
  },
  {
    title: "2. Components",
    content:
      "Reusable functions producing user interfaces. MUST begin with a Capital letter (e.g., `WelcomeMessage` instead of `welcomeMessage`). Can be rendered as standard XML tags like `<WelcomeMessage />`.",
    example: "function Header() {\n  return <header>My App</header>;\n}",
  },
  {
    title: "3. Props (Properties)",
    content:
      "Input parameters passed into components, packed into a single object. Props are read-only. Clean up variable accesses using bracket destructuring directly inside the functional argument parameters list.",
    example: "function User({ name }) {\n  return <p>User: {name}</p>;\n}",
  },
  {
    title: "4. useState Hook",
    content:
      "Hook that registers react-reactive state inside elements. Returns an array containing: [currentState, setterFunction]. Updating state forces component redraw to sync UI displays.",
    example:
      "const [count, setCount] = useState(0);\n// Trigger via:\nsetCount(count + 1);",
  },
  {
    title: "5. List Rendering & Keys",
    content:
      "Looping over arrays using `.map()` and outputting sibling tags. Requires standard unique `key={item.id}` attributes on outer returned nodes so React can manage re-ordering and updates efficiently.",
    example: "items.map(todo => <li key={todo.id}>{todo.title}</li>);",
  },
  {
    title: "6. Controlled Inputs",
    content:
      "Forms inputs controlled by React. Bind `value` prop to local state variables and capture edits with corresponding `onChange` handlers.",
    example: "<input value={text} onChange={(e) => setText(e.target.value)} />",
  },
];

export default function App() {
  // Course State declarations
  const chapters = CURRICULUM;
  const flatLessons = useMemo(
    () => chapters.flatMap((c) => c.lessons),
    [chapters],
  );

  const [currentLesson, setCurrentLesson] = useState(() => {
    // Restore lesson or use first
    const saved = localStorage.getItem("react_tutorial_current_slug");
    if (saved) {
      const found = flatLessons.find((l) => l.slug === saved);
      if (found) return found;
    }
    return flatLessons[0];
  });

  // Track completed lesson slugs
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem("react_tutorial_completed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep progress record of user edits for each lesson
  const [userCode, setUserCode] = useState(() => {
    try {
      const saved = localStorage.getItem("react_tutorial_code");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Transpilation Babel state
  const [isBabelLoaded, setIsBabelLoaded] = useState(false);
  const [babelError, setBabelError] = useState(null);

  // Active editor / assessment states
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [hasRunTests, setHasRunTests] = useState(false);

  // Shell & Layout controller states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sandboxKey, setSandboxKey] = useState(0);
  const [activeMobileTab, setActiveMobileTab] = useState("learn");
  const [showProgressResetModal, setShowProgressResetModal] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [cheatQuery, setCheatQuery] = useState("");

  // Track completion celebrations
  const [showCelebration, setShowCelebration] = useState(false);

  // Current working code inside editor
  const activeCode = useMemo(() => {
    if (userCode[currentLesson.slug] !== undefined) {
      return userCode[currentLesson.slug];
    }
    return currentLesson.initialCode;
  }, [userCode, currentLesson]);

  // Load Babel dynamically via CDN
  useEffect(() => {
    // Check if babel-standalone is already present
    if (window.Babel) {
      setIsBabelLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.0/babel.min.js";
    script.async = true;
    script.onload = () => {
      setIsBabelLoaded(true);
    };
    script.onerror = () => {
      setBabelError(
        "Failed to fetch compilers from public CDN. Check your network configuration and reload.",
      );
    };
    document.head.appendChild(script);

    return () => {
      // Small cleanups
      try {
        document.head.removeChild(script);
      } catch {
        // Safe to ignore
      }
    };
  }, []);

  // Update current lesson
  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    localStorage.setItem("react_tutorial_current_slug", lesson.slug);
    setTestResults([]);
    setHasRunTests(false);
    // Auto-focus appropriate view on smaller viewports
    setActiveMobileTab("learn");
  };

  // Input code updater
  const handleCodeChange = (newCode) => {
    const nextCodes = { ...userCode, [currentLesson.slug]: newCode };
    setUserCode(nextCodes);
    localStorage.setItem("react_tutorial_code", JSON.stringify(nextCodes));
    setHasRunTests(false);
  };

  // Reset current coding challenge
  const handleResetLessonCode = () => {
    const nextCodes = { ...userCode };
    delete nextCodes[currentLesson.slug];
    setUserCode(nextCodes);
    localStorage.setItem("react_tutorial_code", JSON.stringify(nextCodes));
    setTestResults([]);
    setHasRunTests(false);
    setSandboxKey((prev) => prev + 1); // trigger preview reset
  };

  // Suggest hints
  const handleShowHint = () => {
    alert(`💡 Lesson Hint:\n\n${currentLesson.hint}`);
  };

  // Overwrite challenge with official solution code
  const handleRevealSolution = () => {
    const confirmReveal = window.confirm(
      "Are you sure you want to reveal the solution? This will overwrite your current progress.",
    );
    if (confirmReveal) {
      handleCodeChange(currentLesson.solutionCode);
      setSandboxKey((prev) => prev + 1);
    }
  };

  // Multi-tier progress reset
  const handleClearAllProgress = () => {
    const confirmClear = window.confirm(
      "This will permanently wipe all your lessons progress, scores, and saved codes. This cannot be undone.",
    );
    if (confirmClear) {
      localStorage.removeItem("react_tutorial_completed");
      localStorage.removeItem("react_tutorial_code");
      localStorage.removeItem("react_tutorial_current_slug");
      setCompletedLessons([]);
      setUserCode({});
      setCurrentLesson(flatLessons[0]);
      setTestResults([]);
      setHasRunTests(false);
      setShowProgressResetModal(false);
      setSandboxKey((prev) => prev + 1);
      setActiveMobileTab("learn");
      alert("Lesson progress has been re-initialized successfully!");
    }
  };

  // Navigation trackers
  const currentIndex = flatLessons.findIndex(
    (l) => l.slug === currentLesson.slug,
  );
  const previousLesson =
    currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]
      : null;

  // Triggers compiled assertions
  const runAssessments = async () => {
    setIsRunningTests(true);
    setHasRunTests(true);

    // Make code change flush to DOM and allow compilers to settle animation
    await new Promise((resolve) => setTimeout(resolve, 550));

    const mountContainer = document.getElementById("sandbox-mount");
    if (!mountContainer) {
      setIsRunningTests(false);
      alert("Error: Rendering sandbox is missing from view. Try reloading.");
      return;
    }

    const results = [];
    let passedAll = true;

    // Evaluate each requirement
    for (const req of currentLesson.requirements) {
      try {
        const actHelper = async (callback) => {
          callback();
          // Let React sync state to the DOM
          await new Promise((resolve) => setTimeout(resolve, 60));
        };

        const passed = await req.test({
          container: mountContainer,
          component: null,
          act: actHelper,
        });

        results.push({
          id: req.id,
          text: req.text,
          passed: passed !== false,
        });
      } catch (err) {
        passedAll = false;
        results.push({
          id: req.id,
          text: req.text,
          passed: false,
          error: err?.message || String(err),
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);

    if (passedAll) {
      const isAlreadyCompleted = completedLessons.includes(currentLesson.slug);
      if (!isAlreadyCompleted) {
        const nextCompleted = [...completedLessons, currentLesson.slug];
        setCompletedLessons(nextCompleted);
        localStorage.setItem(
          "react_tutorial_completed",
          JSON.stringify(nextCompleted),
        );

        // Celebrate!
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4500);
      }
    }
  };

  // Filtered Cheat Sheets list
  const filteredCheatSheets = useMemo(() => {
    if (!cheatQuery.trim()) return CHEAT_SHEETS;
    return CHEAT_SHEETS.filter(
      (sheet) =>
        sheet.title.toLowerCase().includes(cheatQuery.toLowerCase()) ||
        sheet.content.toLowerCase().includes(cheatQuery.toLowerCase()),
    );
  }, [cheatQuery]);

  return (
    <div
      id="main-learning-workspace"
      className="flex flex-col h-screen bg-[#F9FAFB] text-gray-850 font-sans antialiased overflow-hidden select-text"
    >
      {/* Header Panel */}
      <header className="bg-white border-b border-gray-200 text-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 h-16 select-none shadow-xs z-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500 text-white p-2 rounded-xl shadow-xs font-black">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight sm:text-base text-gray-900">
              React Mastery Interactive
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium font-sans">
              Progress:{" "}
              <strong className="text-blue-600 font-bold">
                {completedLessons.length}
              </strong>{" "}
              of <strong className="text-gray-700">{flatLessons.length}</strong>{" "}
              Completed
            </p>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {/* Searchable Quick Reference cheat sheet */}
          <button
            onClick={() => setShowCheatSheet(true)}
            id="toolbar-cheat-sheet"
            className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200 shadow-xs"
          >
            <BookMarked className="w-4 h-4 text-blue-500" />
            <span className="hidden md:inline">Docs & Cheat Sheet</span>
          </button>

          {/* Wipe Progress reset button */}
          <button
            onClick={handleClearAllProgress}
            id="toolbar-reset-progress"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-gray-50/50 hover:bg-red-50 text-xs font-semibold text-gray-550 hover:text-red-600 transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200 shadow-xs hover:border-red-200"
            title="Reset course progress"
          >
            <ListRestart className="w-4 h-4 text-gray-400 hover:text-red-500" />
            <span className="hidden md:inline">Reset Progress</span>
          </button>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          chapters={chapters}
          currentLesson={currentLesson}
          onSelectLesson={handleSelectLesson}
          completedLessons={completedLessons}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Learning Space Columns */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* COLUMN 1: Explanation / Lesson instructions (Scrollable) */}
          <section
            id="explanation-pane"
            className={`${
              activeMobileTab === "learn" ? "flex" : "hidden"
            } lg:flex lg:w-[460px] xl:w-[480px] shrink-0 border-r border-gray-200 bg-white flex-col h-full`}
          >
            {/* Tab/Lesson Title Bar */}
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 shrink-0 h-14 flex items-center justify-between select-none">
              <span className="text-[10px] uppercase font-sans font-bold text-gray-400 tracking-widest text-[9.5px]">
                MODULE INSTRUCTIONS
              </span>

              {completedLessons.includes(currentLesson.slug) && (
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 rounded-full px-2 py-0.5 inline-flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 fill-emerald-50 text-emerald-600" />{" "}
                  Fully Completed
                </span>
              )}
            </div>

            {/* Instruction markup */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">
                {currentLesson.title}
              </h2>

              <Markdown content={currentLesson.description} />

              {/* Progress visual footer card */}
              {completedLessons.includes(currentLesson.slug) && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-6 flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                    <Trophy className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-900">
                      Good job, challenge solved!
                    </h4>
                    <p className="text-[11px] text-emerald-750 mt-0.5 leading-relaxed font-sans">
                      You have met all test parameters. Advance to the next task
                      in the course whenever you are ready.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Syllabus Arrow Navigation Footer */}
            <footer className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3 shrink-0 select-none">
              <button
                onClick={() =>
                  previousLesson && handleSelectLesson(previousLesson)
                }
                id="lesson-prev"
                disabled={!previousLesson}
                className="grow text-center text-xs font-bold py-2 px-3 border border-gray-200 hover:border-gray-300 rounded-lg bg-white shadow-xs text-gray-655 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 leading-none flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                id="lesson-next"
                disabled={!nextLesson}
                className="grow text-center text-xs font-bold py-2 px-3 border border-gray-200 hover:border-gray-300 rounded-lg bg-white shadow-xs text-gray-655 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 leading-none flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          </section>

          {/* COLUMN 2 & 3: Dev terminal, Sandbox Frame, and Assert Console */}
          <section className="flex-1 flex flex-col overflow-hidden bg-[#F3F4F6] p-3 sm:p-4 gap-3 sm:gap-4 h-full relative">
            {/* Visual Header/Navigation Panel for Portable screens */}
            <div className="lg:hidden flex border border-gray-200 bg-white rounded-xl p-1 shrink-0 select-none shadow-xs">
              <button
                onClick={() => setActiveMobileTab("learn")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeMobileTab === "learn"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Lessons
              </button>
              <button
                onClick={() => setActiveMobileTab("code")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeMobileTab === "code"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveMobileTab("preview")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeMobileTab === "preview"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveMobileTab("tests")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer relative ${
                  activeMobileTab === "tests"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-850"
                }`}
              >
                Asserts
                {testResults.length > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
                )}
              </button>
            </div>

            {/* Top Workspace Grid Box */}
            <div
              className={`flex-1 flex overflow-hidden min-h-0 ${
                activeMobileTab === "code" ? "block" : "hidden"
              } lg:block`}
            >
              <CodeEditor
                key={currentLesson.slug}
                code={activeCode}
                onChange={handleCodeChange}
                onReset={handleResetLessonCode}
                onShowHint={handleShowHint}
                onRevealSolution={handleRevealSolution}
                onRunCode={() => {
                  runAssessments();
                  // Shift tab on portable items so they immediately see the assertions testing logs and preview
                  if (window.innerWidth < 1024) {
                    setActiveMobileTab("tests");
                  }
                }}
              />
            </div>

            {/* Bottom Workspace Split Grid Box (Browser & Terminal logger) */}
            <div
              className={`flex-1 lg:flex flex-col sm:flex-row min-h-0 gap-3 sm:gap-4 ${
                activeMobileTab === "preview" || activeMobileTab === "tests"
                  ? "flex"
                  : "hidden"
              }`}
            >
              {/* Live Preview Emulator */}
              <div
                className={`flex-1 h-full ${
                  activeMobileTab === "preview" || activeMobileTab === "tests"
                    ? activeMobileTab === "preview"
                      ? "block"
                      : "hidden"
                    : "block"
                } lg:block`}
              >
                <PreviewArea
                  code={activeCode}
                  isBabelLoaded={isBabelLoaded}
                  babelError={babelError}
                  sandboxKey={sandboxKey}
                  onCompileSuccess={() => {
                    // console hook for updates
                  }}
                />
              </div>

              {/* Requirements Terminal Tester */}
              <div
                className={`flex-1 h-full ${
                  activeMobileTab === "preview" || activeMobileTab === "tests"
                    ? activeMobileTab === "tests"
                      ? "block"
                      : "hidden"
                    : "block"
                } lg:block`}
              >
                <TestConsole
                  testResults={testResults}
                  isRunningTests={isRunningTests}
                  hasRunTests={hasRunTests}
                  showNextButton={!!nextLesson}
                  onNextLesson={() =>
                    nextLesson && handleSelectLesson(nextLesson)
                  }
                />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Cheat Sheet Sidebar Modal Drawer */}
      {showCheatSheet && (
        <div className="fixed inset-0 bg-gray-955/45 flex justify-end z-50 animate-fade-in select-text">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in justify-between">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-gray-900 text-sm tracking-tight sm:text-base">
                  React Cheat Sheet & Reference
                </h3>
              </div>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick search input filter bar */}
            <div className="p-4 border-b border-gray-100 bg-white shrink-0 select-none">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Isolate reference (e.g. state, props, key)..."
                  value={cheatQuery}
                  onChange={(e) => setCheatQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Chevron-scrolled cards body list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/40">
              {filteredCheatSheets.length > 0 ? (
                filteredCheatSheets.map((sheet, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2.5"
                  >
                    <h4 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {sheet.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans select-text">
                      {sheet.content}
                    </p>
                    <div className="bg-[#282c34] rounded-lg p-3 overflow-x-auto font-mono [font-family:Consolas,ui-monospace,monospace] text-[11px] leading-relaxed border border-[#181a1f]">
                      <pre
                        className="text-[#abb2bf] font-normal [font-variant-ligatures:none]"
                        dangerouslySetInnerHTML={{
                          __html: highlightReactCode(sheet.example),
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs font-sans">
                  No matching references found. Try searching for "useState",
                  "JSX", or "Props".
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/55 text-center text-[10px] font-mono text-gray-400 select-none shrink-0">
              💡 Always capitalize your Component names (e.g. `App`).
            </div>
          </div>
        </div>
      )}

      {/* Chapter Completed Sparkling Trophy Overlay Overlay Pop-up banner */}
      {showCelebration && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 z-50 animate-bounce cursor-default border border-gray-800 select-none">
          <div className="bg-blue-500 text-white rounded-full p-1.5 shadow-md">
            <Trophy className="w-5 h-5 fill-white/14" />
          </div>
          <div>
            <span className="text-xs font-sans text-blue-400 font-bold tracking-wide uppercase block">
              Challenge Mastered!
            </span>
            <span className="text-[11px] text-gray-300 font-medium mt-0.5 block">
              You solved the exercise successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
