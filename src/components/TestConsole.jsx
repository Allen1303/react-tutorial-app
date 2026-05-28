import React from "react";
import {
  Check,
  X,
  ShieldAlert,
  Sparkles,
  Terminal,
  BookOpen,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export default function TestConsole({
  testResults,
  isRunningTests,
  hasRunTests,
  onNextLesson,
  showNextButton,
}) {
  // Compute overall progress in the current lesson
  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.passed).length;
  const allPassed = totalTests > 0 && passedTests === totalTests;

  return (
    <div
      id="test-console-container"
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full font-sans select-none"
    >
      {/* Console Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 h-12">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-sans font-bold text-gray-800 uppercase tracking-widest">
            Assertions Console
          </span>
        </div>

        {/* Progress statistics pill */}
        {hasRunTests && (
          <div
            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
              allPassed
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {passedTests}/{totalTests} Checks Passed
          </div>
        )}
      </div>

      {/* Tests Results List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
        {!hasRunTests && !isRunningTests ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 font-sans">
            <HelpCircle className="w-10 h-10 text-gray-300 mb-2 stroke-[1.5]" />
            <p className="text-xs font-semibold text-gray-700">
              Ready to test your code?
            </p>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] leading-relaxed">
              Type your changes in the editor above and tap{" "}
              <strong className="text-blue-600 font-bold">
                Run Code & Tests
              </strong>
              .
            </p>
          </div>
        ) : isRunningTests ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs">
            <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
              {/* Spinning Ring */}
              <div className="absolute w-full h-full rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin"></div>
              <Terminal className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-gray-455 font-medium">
              Evaluating DOM Tree assertions...
            </span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {testResults.map((result) => {
              const hasFailure = !result.passed;
              return (
                <div
                  key={result.id}
                  className={`border rounded-lg p-3 transition-all duration-300 ${
                    result.passed
                      ? "bg-emerald-50/60 border-emerald-250/80 text-emerald-950 font-medium"
                      : "bg-red-50/60 border-red-200/80 text-red-955"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`shrink-0 mt-0.5 p-0.5 rounded ${
                        result.passed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {result.passed ? (
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      ) : (
                        <X className="w-3.5 h-3.5 stroke-[3.5]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 font-sans text-xs">
                      <p className="font-semibold leading-normal select-text">
                        {result.text}
                      </p>
                      {hasFailure && result.error && (
                        <div className="mt-1.5 p-2 bg-red-50 rounded border border-red-100 text-[10px] b-error-box font-mono text-red-700 break-words leading-relaxed select-text">
                          <span className="font-bold uppercase mr-1">
                            Assert Error:
                          </span>
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completion Banner with CTA button */}
      {hasRunTests && !isRunningTests && allPassed && (
        <div className="bg-emerald-50 border-t border-emerald-100 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 text-white rounded-full p-1 shadow-md">
              <Sparkles className="w-4 h-4 fill-white/10" />
            </div>
            <div className="text-left">
              <p className="text-emerald-900 font-bold text-xs">
                All requirements passed! 🎉
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">
                Amazing code, that's completely correct.
              </p>
            </div>
          </div>

          {showNextButton && onNextLesson && (
            <button
              onClick={onNextLesson}
              id="btn-next-lesson"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
