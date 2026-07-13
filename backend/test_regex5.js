const supabase=require('./database');
async function test(){
  const {data}=await supabase.from('questions').select('*').eq('quiz_id', 886).like('question_text', '%Q.65%');
  const text = data[0].question_text;
  
  let sanitized = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, content) => {
    if (lang && lang.trim() !== '') {
      return `\n\n\`\`\`${lang}\n${content}\`\`\`\n\n`;
    }
    const lines = content.split('\n');
    const hasMath = lines.some(line => line.includes('\\to') || line.includes('\\frac') || line.includes('\\quad') || line.includes('\\times') || line.includes('\\le') || line.includes('\\ge') || line.includes('\\mid') || line.includes('\\cup') || line.includes('\\cap') || line.includes('\\alpha') || line.includes('\\beta') || line.includes('\\gamma'));
    
    if (hasMath) {
      const mathLines = lines.map(line => {
        if (line.trim().length > 0) return `$${line}$`;
        return line;
      });
      return `\n\n${mathLines.join('\n')}\n\n`;
    }
    
    return `\n\n\`\`\`\n${content}\`\`\`\n\n`;
  });
  
  console.log("MATCHED?");
  console.log(sanitized !== text);
  console.log("RESULT:");
  console.log(sanitized);
}
test();
