/**
 * Atom One Dark syntax highlighter utility
 */
export function highlightReactCode(code) {
  // Handle HTML entities escaping
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Unified Regex for comments, strings, blue keywords (storage/declarations/hooks), purple keywords (control/module), booleans/integers, hmtl tags, attributes, and function invocations, plus custom punctuation (colons, semicolons, commas, backticks)
  const regex =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|class|extends|new|useState|useEffect|useContext|useRef|useMemo|useCallback)\b)|(\b(?:import|export|default|from|as|return|if|else|try|catch|finally|break|continue|switch|case)\b)|(\b(?:true|false|\d+)\b)|(&lt;\/?[a-zA-Z][a-zA-Z0-9-]*|&lt;\/?[a-zA-Z0-9-]*&gt;)|(\b[a-zA-Z-]+(?=\s*=))|(\b[a-zA-Z_0-9]+(?=\s*\())|(:|,|(?<!&[a-zA-Z0-9#]{2,6});|\`)/g;

  return escaped.replace(
    regex,
    (
      match,
      comment,
      str,
      blueKeyword,
      purpleKeyword,
      orangeConst,
      tag,
      attr,
      funcCall,
      punc,
    ) => {
      if (comment) return `<span class="text-[#5c6370] italic">${match}</span>`;
      if (str) {
        if (str.includes("`")) {
          const pieces = str.split("`");
          return pieces
            .map((piece, pIdx) => {
              const content = piece
                ? `<span class="text-[#98c379]">${piece}</span>`
                : "";
              const backtick =
                pIdx < pieces.length - 1
                  ? `<span class="text-[#e06c75]">\`</span>`
                  : "";
              return `${content}${backtick}`;
            })
            .join("");
        }
        return `<span class="text-[#98c379]">${match}</span>`;
      }
      if (blueKeyword)
        return `<span class="text-[#61afef]">${blueKeyword}</span>`;
      if (purpleKeyword)
        return `<span class="text-[#c678dd]">${purpleKeyword}</span>`;
      if (orangeConst)
        return `<span class="text-[#d19a66]">${orangeConst}</span>`;
      if (tag) {
        let angleOpen = "&lt;";
        let angleClose = "";
        let tagName = match;
        if (tagName.startsWith("&lt;/")) {
          angleOpen = "&lt;/";
          tagName = tagName.slice(5);
        } else if (tagName.startsWith("&lt;")) {
          angleOpen = "&lt;";
          tagName = tagName.slice(4);
        }
        if (tagName.endsWith("&gt;")) {
          angleClose = "&gt;";
          tagName = tagName.slice(0, -4);
        }
        const openSpan = `<span class="text-[#abb2bf]">${angleOpen}</span>`;
        const nameSpan = `<span class="text-[#e06c75]">${tagName}</span>`;
        const closeSpan = angleClose
          ? `<span class="text-[#abb2bf]">${angleClose}</span>`
          : "";
        return `${openSpan}${nameSpan}${closeSpan}`;
      }
      if (attr) return `<span class="text-[#d19a66] italic">${match}</span>`;
      if (funcCall) return `<span class="text-[#61afef]">${match}</span>`;
      if (punc) {
        if (punc === "`") {
          return `<span class="text-[#e06c75]">\`</span>`;
        }
        return `<span class="text-[#56b6c2]">${punc}</span>`;
      }
      return match;
    },
  );
}
