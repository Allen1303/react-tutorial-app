import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Play,
  Monitor,
  AlertCircle,
  CircleAlert,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";

export default function PreviewArea({
  code,
  isBabelLoaded,
  babelError,
  onCompileStart,
  onCompileSuccess,
  onCompileError,
  sandboxKey,
}) {
  const [compiledOutput, setCompiledOutput] = useState(null);
  const [runtimeError, setRuntimeError] = useState(null);
  const [transpileError, setTranspileError] = useState(null);
  const mountRef = useRef(null);

  // Clear errors and re-compile whenever code or sandboxKey changes
  useEffect(() => {
    setRuntimeError(null);
    setTranspileError(null);

    if (!isBabelLoaded) {
      return;
    }

    try {
      if (onCompileStart) onCompileStart();

      // Ensure Babel is loaded in window
      if (!window.Babel) {
        throw new Error(
          "Transpilation engine is still active. Please wait a moment.",
        );
      }

      // Step 1: Strip import statements cleanly before transpile to avoid module errors
      let stripped = code.replace(
        /import\s+[-\w\s{},*]+\s+from\s+['"][^'"]+['"];?/g,
        "",
      );

      // Step 2: Utilize Babel.transform to transpile JSX to normal ES5/ES6
      const compiled = window.Babel.transform(stripped, {
        presets: ["react"],
        plugins: ["transform-modules-commonjs"], // Safe module mapping to CommonJS
      }).code;

      if (!compiled) {
        throw new Error("Transpiled output is empty.");
      }

      // Step 3: Evaluate within controlled sandbox wrapper containing React
      const exports = {};
      const require = (modName) => {
        if (modName === "react") return React;
        throw new Error(`Module '${modName}' is not available in sandbox.`);
      };

      const fn = new Function(
        "React",
        "useState",
        "useEffect",
        "useRef",
        "useMemo",
        "useCallback",
        "exports",
        "require",
        compiled,
      );

      fn(
        React,
        React.useState,
        React.useEffect,
        React.useRef,
        React.useMemo,
        React.useCallback,
        exports,
        require,
      );

      // Successfully resolved default export component OR exports.App
      const UserComponent = exports.default || exports.App;
      if (!UserComponent) {
        throw new Error(
          "Ensure your component is exported either as 'export default' or named 'App'.",
        );
      }

      setCompiledOutput(() => UserComponent);

      // Feed code to test harness once mounted
      if (onCompileSuccess && mountRef.current) {
        // Trigger verification slightly deferred to let React commit rendering
        setTimeout(() => {
          if (mountRef.current) {
            onCompileSuccess(UserComponent, mountRef.current);
          }
        }, 10);
      }
    } catch (err) {
      console.error("Transpilation failed:", err);
      const errMsg = err?.message || String(err);
      setTranspileError(errMsg);
      if (onCompileError) onCompileError(errMsg);
    }
  }, [code, isBabelLoaded, sandboxKey]);

  return (
    <div
      id="preview-panel"
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full relative"
    >
      {/* Browser bar layout */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0 h-11">
        <div className="flex items-center gap-1.5 grow max-w-md bg-white border border-gray-255 rounded-md px-3 py-1 text-gray-400 text-xs font-mono select-none">
          <Monitor className="w-3.5 h-3.5 shrink-0 text-gray-300" />
          <span className="truncate text-gray-500">
            https://react-sandbox.local/
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status indicators */}
          {isBabelLoaded ? (
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-sans font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sandbox
            </span>
          ) : (
            <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-sans font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Booting Compiler...
            </span>
          )}
        </div>
      </div>

      {/* Compiler / Error Output Panels */}
      <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        {!isBabelLoaded ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-700 font-medium text-sm">
              Downloading Transpilation Engine
            </p>
            <p className="text-[11px] text-gray-400 font-sans mt-1 w-64 leading-relaxed">
              Loading Babel from CDN to parse React JSX in the browser...
            </p>
          </div>
        ) : babelError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-gray-900 font-bold text-sm">
              Babel Loading Failure
            </p>
            <p className="text-xs text-red-650 mt-2 font-mono bg-white p-3 border border-red-100 rounded-lg shadow-inner">
              {babelError}
            </p>
          </div>
        ) : transpileError ? (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 font-mono text-xs overflow-auto flex-1 select-text">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-2 border-b border-red-200 pb-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>JSX TRANSPILE ERROR</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {transpileError}
            </pre>
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative h-full">
            {/* Live React mounting sandbox tree */}
            <div
              ref={mountRef}
              id="sandbox-mount"
              className="flex-1 p-6 overflow-auto bg-white"
            >
              <ErrorBoundary
                key={`${sandboxKey}-${code.length}`}
                fallback={(err) => (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-700 font-sans text-xs rounded-lg select-text h-full overflow-auto">
                    <div className="flex items-center gap-2 text-red-600 font-bold mb-2 pb-1 border-b border-red-200">
                      <CircleAlert className="w-4 h-4 shrink-0" />
                      <span>REACT RUNTIME EXCEPTION</span>
                    </div>
                    <p className="font-bold mb-2 text-sm">{err.message}</p>
                    <pre className="font-mono text-[10px] bg-white p-2.5 border border-red-105 rounded shadow-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed text-red-800">
                      {err.stack}
                    </pre>
                    <p className="mt-3 text-[10px] text-gray-500">
                      💡 Correct any syntax issues, bad loops, or uninitialized
                      variables and click "Run Code" to apply fixes.
                    </p>
                  </div>
                )}
              >
                {compiledOutput && React.createElement(compiledOutput)}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
