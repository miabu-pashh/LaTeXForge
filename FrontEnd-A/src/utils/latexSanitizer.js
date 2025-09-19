export function sanitizeLatexContent(content) {
  if (!content) return "";

  // //console.log("🔍 Original content:\n", content);

  // Step 1: Convert Markdown bold with % → \textbf{45\%}
  content = content.replace(/\*\*(\d+(\.\d+)?)\%?\*\*/g, (_, num) => {
    //console.log(`✨ Markdown bold: **${num}%** → \\textbf{${num}\\%}`);
    return `\\textbf{${num}\\%}`;
  });

  // Step 2: Escape unescaped % (if not already escaped)
  content = content.replace(/(^|[^\\])%/g, (match, p1) => {
    const fixed = `${p1}\\%`;
    //console.log(`🚫 Escaped % → ${fixed}`);
    return fixed;
  });

  // Step 3: Escape unescaped &
  content = content.replace(/(^|[^\\])&/g, (match, p1) => {
    const fixed = `${p1}\\&`;
    //console.log(`🚫 Escaped & → ${fixed}`);
    return fixed;
  });

  // Step 4: Wrap raw 45\% with \textbf{} if not already wrapped
  content = content.replace(/(?<!\\textbf{)(\d+(\.\d+)?)\\%/g, (_, num) => {
    const bolded = `\\textbf{${num}\\%}`;
    //console.log(`💪 Bold % → ${bolded}`);
    return bolded;
  });

  // Step 5: Remove double \textbf nesting
  content = content.replace(
    /\\textbf\{(\d+)\\textbf\{(\d+)\\%\}\}/g,
    (_, a, b) => {
      const combined = `\\textbf{${a}${b}\\%}`;
      //console.log(`🧽 Cleaned nested bold → ${combined}`);
      return combined;
    }
  );

  // Step 6: Remove trailing backslashes (even on blank lines or spacing lines)
  content = content.replace(/\\\s*$/gm, (match) => {
    //console.log("🧹 Removed bad trailing slash:", match);
    return "";
  });

  //console.log("✅ Final sanitized content:\n", content);
  return content;
}
export function sanitizeSkillsLatex(rawSkills) {
  //console.log("🔧 Raw skills input:\n", rawSkills);

  const lines = rawSkills.split("\n").map((line, index) => {
    line = line.trim();
    if (!line) return "";

    // Log the line being processed
    //console.log(`🔹 Line ${index + 1} before fix:`, line);

    // Step 1: Fix the issue with escaped \& used where only one & should be
    const ampSplit = line.split(" & ");
    if (ampSplit.length >= 2) {
      const firstColumn = ampSplit[0].replace(/\\&/g, "&").trim();
      const secondColumn = ampSplit[1].replace(/\\&/g, "&").trim();
      const restColumns = ampSplit.slice(2).map((col) => col.trim());

      let formatted = `${firstColumn} \\& ${secondColumn}`;
      if (restColumns.length > 0) {
        formatted += " & " + restColumns.join(" & ");
      }
      if (!formatted.trim().endsWith("\\\\")) {
        formatted += " \\\\";
      }

      //console.log(`✅ Line ${index + 1} after fix:`, formatted);
      return formatted;
    } else {
      // Log improperly formatted lines
      console.warn(`⚠️ Line ${index + 1} does not contain '&':`, line);
      return line;
    }
  });

  const finalResult = lines.join("\n");
  //console.log("✅ Final sanitized skills:\n", finalResult);
  return finalResult;
}
