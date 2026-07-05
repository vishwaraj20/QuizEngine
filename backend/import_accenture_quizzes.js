const fs = require('fs');
const path = require('path');
const supabase = require('./database');

async function importAccenture() {
  const materialsDir = path.join(__dirname, '../frontend/public/materials/ACCENTURE_text');
  
  function parseQuestions(text) {
     const questions = [];
     // Split by numbered question patterns like "1.", "1)", "Q1.", "Q1)"
     const chunks = text.split(/(?:^|\n)\s*(?:Q?\d+[\.\)])\s*/i);
     
     if (chunks.length > 1) {
       chunks.forEach((chunk, idx) => {
         if (idx === 0 && chunk.trim().length < 20) return; // Skip title header before Q1
         if (chunk.trim().length > 20) {
            let qText = chunk.trim();
            let optA = 'Option A', optB = 'Option B', optC = 'Option C', optD = 'Option D';
            let correctOpt = 'A';
            let explanation = 'Refer to Accenture practice guidelines.';

            // Try to extract options: a), b), c), d) or A., B., C., D. or (a), (b), etc.
            const optRegex = /(?:^|\n|\s)(?:[aA][\.\)]|\([aA]\))\s*(.*?)\s*(?:[bB][\.\)]|\([bB]\))\s*(.*?)\s*(?:[cC][\.\)]|\([cC]\))\s*(.*?)\s*(?:[dD][\.\)]|\([dD]\))\s*(.*)/is;
            const match = qText.match(optRegex);
            
            if (match) {
               optA = match[1].split(/\n\s*(?:[a-d|A-D][\.\)]|\([a-d|A-D]\)|Answer|Explanation)/i)[0].trim().substring(0, 200);
               optB = match[2].split(/\n\s*(?:[a-d|A-D][\.\)]|\([a-d|A-D]\)|Answer|Explanation)/i)[0].trim().substring(0, 200);
               optC = match[3].split(/\n\s*(?:[a-d|A-D][\.\)]|\([a-d|A-D]\)|Answer|Explanation)/i)[0].trim().substring(0, 200);
               optD = match[4].split(/\n\s*(?:Answer|Explanation|Ans)/i)[0].trim().substring(0, 200);
               
               qText = qText.substring(0, match.index).trim();
            } else {
               // Try simple option splitting
               const parts = qText.split(/\s+(?:[A-D]\)|\([A-D]\)|[A-D]\.)\s+/);
               if (parts.length >= 5) {
                 qText = parts[0].trim();
                 optA = parts[1].trim().substring(0, 150);
                 optB = parts[2].trim().substring(0, 150);
                 optC = parts[3].trim().substring(0, 150);
                 optD = parts[4].trim().substring(0, 150);
               }
            }

            // Extract answer if present
            const ansMatch = chunk.match(/(?:Answer|Ans|Correct Option)\s*:?\s*([A-D])/i);
            if (ansMatch) {
               correctOpt = ansMatch[1].toUpperCase();
            }

            // Extract explanation if present
            const expMatch = chunk.match(/(?:Explanation|Sol|Solution)\s*:?\s*(.*)/is);
            if (expMatch) {
               explanation = expMatch[1].trim().substring(0, 500);
            }

            questions.push({
              question_text: (qText || 'Practice Question').substring(0, 1000),
              option_a: optA || 'Option A',
              option_b: optB || 'Option B',
              option_c: optC || 'Option C',
              option_d: optD || 'Option D',
              correct_option: correctOpt,
              explanation: explanation,
              difficulty: 'moderate'
            });
         }
       });
     }
     
     if (questions.length === 0 && text.trim().length > 20) {
        // If no structured questions found, split text into paragraphs for study material reading
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 30);
        paragraphs.forEach((para, idx) => {
           questions.push({
              question_text: para.trim().substring(0, 1000),
              option_a: 'Reviewed',
              option_b: 'Understood',
              option_c: 'Needs Practice',
              option_d: 'Skip',
              correct_option: 'A',
              explanation: 'Study note / reading material concept.',
              difficulty: 'moderate'
           });
        });
     }
     
     return questions.slice(0, 30); // Limit to top 30 questions/paragraphs per paper
  }
  
  async function processDir(currentPath) {
     if (!fs.existsSync(currentPath)) {
        console.error("Directory not found:", currentPath);
        return;
     }
     const entries = fs.readdirSync(currentPath, { withFileTypes: true });
     let paperCounter = 1;

     for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
           await processDir(fullPath);
        } else if (entry.name.endsWith('.txt')) {
           const content = fs.readFileSync(fullPath, 'utf8');
           if (content.trim().length === 0) continue;
           
           let category = 'Accenture - Accenture Papers';
           let title = entry.name.replace('.txt', '');
           
           if (title.toLowerCase().includes('aptitude') && !title.toLowerCase().includes('question bank')) {
              category = 'Accenture - Quantitative Aptitude';
              title = 'Accenture Aptitude Practice Set';
           } else if (title.toLowerCase().includes('logical') || title.toLowerCase().includes('reasoning')) {
              category = 'Accenture - Logical Reasoning';
              title = 'Accenture Logical Reasoning Test';
           } else if (title.toLowerCase().includes('question') || title.toLowerCase().includes('answer') || title.toLowerCase().includes('idc') || title.toLowerCase().includes('overview')) {
              category = 'Accenture - Accenture Question Bank';
              if (title.includes('with answers .txt') || title === 'Accenture questions with answers ') title = 'Accenture Question Bank Set 1';
              else if (title.includes('with answers 2')) title = 'Accenture Question Bank Set 2';
              else if (title.includes('IDC')) title = 'Accenture IDC Placement Guide';
              else if (title.includes('Complete')) title = 'Accenture Complete Placement Overview';
              else title = `Accenture Question Bank - ${title}`;
           } else if (/^5_\d+/.test(title)) {
              category = 'Accenture - Accenture Papers';
              title = `Accenture Placement Paper Series (Part ${paperCounter++})`;
           } else if (title.toLowerCase() === 'accenture' || title.toLowerCase() === 'accenture paper' || title.toLowerCase() === 'accenture paperr') {
              category = 'Accenture - Accenture Papers';
              if (title.toLowerCase() === 'accenture paper') title = 'Accenture Placement Paper I';
              else if (title.toLowerCase() === 'accenture paperr') title = 'Accenture Placement Paper II';
              else title = 'Accenture General Practice Test';
           }
           
           console.log(`Importing [${title}] into category [${category}]...`);
           
           const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
              title: title,
              category: category,
              difficulty: 'moderate',
              time_limit: 30,
              pass_percent: 60,
              show_explanation: 'after_quiz',
              status: 'Live'
           }).select().single();
           
           if (quizErr) {
              console.error(`Quiz Insert Error for ${title}:`, quizErr);
              continue;
           }
           
           const questions = parseQuestions(content);
           if (questions.length > 0) {
              const qsToInsert = questions.map(q => ({ ...q, quiz_id: quiz.id }));
              const { error: qErr } = await supabase.from('questions').insert(qsToInsert);
              if (qErr) console.error(`Questions Insert Error for ${title}:`, qErr);
              else console.log(` -> Inserted ${questions.length} questions for ${title}`);
           } else {
              console.log(` -> No questions parsed for ${title}`);
           }
        }
     }
  }
  
  console.log('Starting Accenture database import...');
  await processDir(materialsDir);
  console.log('Finished Accenture database import!');
}

importAccenture();
