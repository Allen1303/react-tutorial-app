import React, { useMemo } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  GraduationCap,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

export default function Sidebar({
  chapters,
  currentLesson,
  onSelectLesson,
  completedLessons,
  isOpen,
  onToggle,
}) {
  // Count overall completion stats
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    chapters.forEach((ch) => {
      ch.lessons.forEach((les) => {
        total += 1;
        if (completedLessons.includes(les.slug)) {
          completed += 1;
        }
      });
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [chapters, completedLessons]);

  return (
    <aside
      id="sidebar-container"
      className={`${
        isOpen ? "w-80" : "w-0 md:w-16"
      } bg-white border-r border-gray-200 text-gray-700 flex flex-col transition-all duration-300 relative overflow-hidden h-full shrink-0`}
    >
      {/* Header Panel */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between h-16 min-w-[280px] md:min-w-0">
        {(isOpen || !isOpen) && (
          <div className={`flex items-center gap-2 ${!isOpen && "md:hidden"}`}>
            <div className="bg-blue-500 text-white p-1.5 rounded-lg shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-gray-900 font-sans leading-none">
                React Mastery
              </h1>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                Jad Joubran Inspired
              </p>
            </div>
          </div>
        )}

        <div
          className={`flex items-center justify-center ${!isOpen && "md:mx-auto"}`}
        >
          <button
            onClick={onToggle}
            id="toggle-sidebar"
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-650 hover:text-gray-900 transition-colors cursor-pointer"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Nav / Scrolling Lesson Lists */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 select-none">
        {/* Course Completion Progress Summary Widget */}
        {(isOpen || !isOpen) && (
          <div
            className={`bg-gray-50 border border-gray-200/80 p-3 rounded-xl mx-0.5 ${!isOpen && "md:hidden mb-2"}`}
          >
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold text-gray-550 header-progress-label">
              <span>Overall Progress</span>
              <span className="text-blue-600 font-bold">
                {stats.completed}/{stats.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span>{stats.percentage}% React Mastered</span>
            </div>
          </div>
        )}

        {/* Chapters and Sub-lessons List */}
        {chapters.map((chapter) => {
          const isSomeCompletedInChapter = chapter.lessons.some((l) =>
            completedLessons.includes(l.slug),
          );
          const isAllCompletedInChapter = chapter.lessons.every((l) =>
            completedLessons.includes(l.slug),
          );

          return (
            <div key={chapter.id} className="space-y-1.5">
              {isOpen ? (
                <h3 className="text-[10px] uppercase font-sans font-bold tracking-widest text-gray-400 px-2 flex items-center justify-between">
                  <span>{chapter.title}</span>
                  {isAllCompletedInChapter && (
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-medium">
                      Done
                    </span>
                  )}
                </h3>
              ) : (
                <div className="md:flex md:justify-center md:items-center py-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isAllCompletedInChapter
                        ? "bg-emerald-500"
                        : isSomeCompletedInChapter
                          ? "bg-blue-400"
                          : "bg-gray-200"
                    }`}
                    title={chapter.title}
                  />
                </div>
              )}

              <div className="space-y-1">
                {chapter.lessons.map((lesson) => {
                  const isCurrent = lesson.slug === currentLesson.slug;
                  const isCompleted = completedLessons.includes(lesson.slug);

                  if (!isOpen) {
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`w-10 h-10 mx-auto hidden md:flex items-center justify-center rounded-lg transition-colors cursor-pointer relative ${
                          isCurrent
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        title={lesson.title}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-550" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                        {isCurrent && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-l" />
                        )}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-semibold cursor-pointer transition-all ${
                        isCurrent
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500 rounded-l-none"
                          : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent hover:text-gray-900"
                      }`}
                    >
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-550 shadow-xs" />
                        ) : (
                          <Circle
                            className={`w-4 h-4 ${isCurrent ? "text-blue-500" : "text-gray-300"}`}
                          />
                        )}
                      </div>
                      <span className="truncate leading-tight">
                        {lesson.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote Badge */}
      {isOpen && (
        <div className="p-3 border-t border-gray-100 bg-gray-55/40 text-center text-[10px] font-mono text-gray-400 select-none">
          Click "Run Code" to assess.
        </div>
      )}
    </aside>
  );
}
