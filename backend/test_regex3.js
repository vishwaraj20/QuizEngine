function sanitize(str) {
  // First, fix unescaped set braces
  let sanitized = str.replace(/(?<!\\)\$\{/g, '$\\{').replace(/(?<!\\)\}\$/g, '\\}$');

  // Then, handle markdown code blocks
  sanitized = sanitized.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, content) => {
    if (lang && lang.trim() !== '') {
      // It has a language tag (e.g. c, sql), just return content (since we rely on whitespace-pre-wrap)
      return content;
    }
    // No language tag, might be math grammar
    const lines = content.split('\n');
    const mathLines = lines.map(line => {
      if (line.includes('\\to') || line.includes('\\frac') || line.includes('\\quad') || line.includes('\\times') || line.includes('\\le') || line.includes('\\ge')) {
        return `$${line}$`;
      }
      return line;
    });
    return mathLines.join('\n');
  });

  return sanitized;
}

const input = `
\`\`\`
N \\to I\\#F \\quad N.val = I.val + F.val
I \\to I_1 B \\quad I.val = (2 \\times I_1.val) + B.val
\`\`\`
`;
console.log(sanitize(input));
