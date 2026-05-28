import React from "react";
import { highlightReactCode } from "../utils/highlight";

export default function Markdown({ content }) {
  // Parse content by segments (code blocks vs text blocks)
  const segments = content.split("```");

  return (
    <div className="space-y-4 font-sans text-slate-700 leading-relaxed text-sm antialiased">
      {segments.map((segment, index) => {
        const isCodeBlock = index % 2 === 1;

        if (isCodeBlock) {
          // Extract language and code lines
          const lines = segment.split("\n");
          const firstLine = lines[0].trim();
          const isLanguageHeader = [
            "javascript",
            "js",
            "jsx",
            "typescript",
            "ts",
            "html",
            "css",
          ].includes(firstLine.toLowerCase());

          const codeString = isLanguageHeader
            ? lines.slice(1).join("\n")
            : lines.join("\n");

          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-[#181a1f] shadow-lg bg-[#282c34]"
            >
              {isLanguageHeader ? (
                <div className="bg-[#21252b] border-[#181a1f] border-b px-3 py-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
                    <span className="ml-1.5 font-semibold text-slate-300">
                      {firstLine} Snippet
                    </span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                </div>
              ) : (
                <div className="bg-[#21252b] border-[#181a1f] border-b px-3 py-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
                    <span className="ml-1.5 font-semibold text-slate-300">
                      Code Snippet
                    </span>
                  </div>
                </div>
              )}
              <pre
                className="bg-[#282c34] text-[#abb2bf] p-4 overflow-x-auto font-mono [font-family:Consolas,ui-monospace,monospace] text-[11.5px] leading-relaxed [font-variant-ligatures:none] select-text"
                dangerouslySetInnerHTML={{
                  __html: highlightReactCode(codeString.trim()),
                }}
              />
            </div>
          );
        }

        // Parse headers, lists and paragraphs properly line-by-line
        const parseSegmentToBlocks = (textSegment) => {
          const lines = textSegment.split("\n");
          const blocks = [];
          let currentGroup = null;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (!trimmed) {
              if (currentGroup) {
                blocks.push(currentGroup);
                currentGroup = null;
              }
              continue;
            }

            // Is it a header? (## or ###)
            if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
              if (currentGroup) {
                blocks.push(currentGroup);
                currentGroup = null;
              }
              const type = trimmed.startsWith("###") ? "h3" : "h2";
              const cleanText = trimmed.replace(/^###\s+|^##\s+/, "");
              blocks.push({ type, text: cleanText });
              continue;
            }

            // Is it a bullet point?
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              if (currentGroup && currentGroup.type !== "ul") {
                blocks.push(currentGroup);
                currentGroup = null;
              }
              if (!currentGroup) {
                currentGroup = { type: "ul", items: [] };
              }
              currentGroup.items.push(trimmed.replace(/^[-*]\s+/, ""));
              continue;
            }

            // Is it a numbered list?
            if (/^\d+\.\s+/.test(trimmed)) {
              if (currentGroup && currentGroup.type !== "ol") {
                blocks.push(currentGroup);
                currentGroup = null;
              }
              if (!currentGroup) {
                currentGroup = { type: "ol", items: [] };
              }
              currentGroup.items.push(trimmed.replace(/^\d+\.\s+/, ""));
              continue;
            }

            // Otherwise, it is a standard paragraph line
            if (currentGroup && currentGroup.type !== "p") {
              blocks.push(currentGroup);
              currentGroup = null;
            }

            if (!currentGroup) {
              currentGroup = { type: "p", lines: [] };
            }
            currentGroup.lines.push(line);
          }

          if (currentGroup) {
            blocks.push(currentGroup);
          }

          return blocks;
        };

        const blocks = parseSegmentToBlocks(segment);

        return (
          <div key={index} className="space-y-3.5">
            {blocks.map((block, bIdx) => {
              if (block.type === "h3") {
                return (
                  <h3
                    key={bIdx}
                    className="text-[14.5px] font-bold text-slate-900 tracking-normal mt-6 pb-2 border-b border-slate-100 font-sans block leading-relaxed"
                  >
                    <span className="inline-block w-1.5 h-3.5 rounded bg-amber-500 mr-2 align-middle -mt-0.5 shrink-0"></span>
                    <span className="align-middle">
                      {parseInline(block.text)}
                    </span>
                  </h3>
                );
              }

              if (block.type === "h2") {
                return (
                  <h2
                    key={bIdx}
                    className="text-[16px] font-bold text-slate-900 tracking-normal mt-6 pb-2 border-b border-slate-100 font-sans block leading-relaxed"
                  >
                    <span className="inline-block w-2 h-4 rounded bg-slate-800 mr-2 align-middle -mt-0.5 shrink-0"></span>
                    <span className="align-middle">
                      {parseInline(block.text)}
                    </span>
                  </h2>
                );
              }

              if (block.type === "ul") {
                return (
                  <ul
                    key={bIdx}
                    className="space-y-1.5 pl-5 list-disc text-slate-650 my-2"
                  >
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-[13.5px] leading-relaxed">
                        {parseInline(item)}
                      </li>
                    ))}
                  </ul>
                );
              }

              if (block.type === "ol") {
                return (
                  <ol
                    key={bIdx}
                    className="space-y-1.5 pl-5 list-decimal text-slate-650 my-2"
                  >
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-[13.5px] leading-relaxed">
                        {parseInline(item)}
                      </li>
                    ))}
                  </ol>
                );
              }

              if (block.type === "p") {
                const combinedText = block.lines.join(" ");
                return (
                  <p
                    key={bIdx}
                    className="text-[13.5px] text-slate-600 font-sans leading-relaxed tracking-normal"
                  >
                    {parseInline(combinedText)}
                  </p>
                );
              }

              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}

// Simple inline regex formatting engine (Bold, code blocks, links)
function parseInline(text) {
  // Regex mapping pattern matching code, bold stars, italic underscores
  // Format: bold (**), code (`)
  const tokens = [];
  let currentWord = "";
  let idx = 0;

  while (idx < text.length) {
    // 1. Code tokens
    if (text[idx] === "`") {
      if (currentWord) {
        tokens.push(currentWord);
        currentWord = "";
      }
      let closeIdx = text.indexOf("`", idx + 1);
      if (closeIdx !== -1) {
        const codeText = text.substring(idx + 1, closeIdx);
        tokens.push(
          <code
            key={`code-${idx}`}
            className="inline px-1 py-0.5 bg-[#282c34] text-[#abb2bf] rounded border border-[#181a1f] font-mono text-[12px] [font-family:Consolas,ui-monospace,monospace] select-text tracking-wide whitespace-nowrap"
            dangerouslySetInnerHTML={{ __html: highlightReactCode(codeText) }}
          />,
        );
        idx = closeIdx + 1;
        continue;
      }
    }

    // 2. Bold tokens
    if (text.startsWith("**", idx)) {
      if (currentWord) {
        tokens.push(currentWord);
        currentWord = "";
      }
      let closeIdx = text.indexOf("**", idx + 2);
      if (closeIdx !== -1) {
        const boldText = text.substring(idx + 2, closeIdx);
        tokens.push(
          <strong
            key={`bold-${idx}`}
            className="font-bold text-slate-900 tracking-normal font-sans"
          >
            {parseInline(boldText)}
          </strong>,
        );
        idx = closeIdx + 2;
        continue;
      }
    }

    currentWord += text[idx];
    idx++;
  }

  if (currentWord) {
    tokens.push(currentWord);
  }

  return tokens;
}
