const fs = require('fs');
const path = require('path');
const supabase = require('./database');

async function importTCS() {
  const materialsDir = path.join(__dirname, '../frontend/public/materials/TCS_text');
  
  function parseQuestions(text) {
     const questions = [];
     const chunks = text.split(/(?:Q\d+\.|\b\d+\.)/i);
     if (chunks.length > 1) {
       chunks.forEach(chunk => {
         if (chunk.trim().length > 50) {
            const options = chunk.split(/[A-D]\)/i);
            const qText = options[0].trim();
            if (options.length >= 5) {
               questions.push({
                 question_text: qText.substring(0, 500),
                 option_a: options[1].trim().substring(0, 100),
                 option_b: options[2].trim().substring(0, 100),
                 option_c: options[3].trim().substring(0, 100),
                 option_d: options[4].trim().substring(0, 100),
                 correct_option: 'A',
                 explanation: 'Answer extraction from raw text is limited.',
                 difficulty: 'moderate'
               });
            } else {
               questions.push({
                 question_text: chunk.trim().substring(0, 500),
                 option_a: 'Option A',
                 option_b: 'Option B',
                 option_c: 'Option C',
                 option_d: 'Option D',
                 correct_option: 'A',
                 explanation: '',
                 difficulty: 'moderate'
               });
            }
         }
       });
     }
     
     if (questions.length === 0 && text.trim().length > 10) {
        questions.push({
           question_text: text.trim().substring(0, 1000) + '...',
           option_a: 'True',
           option_b: 'False',
           option_c: 'Not Given',
           option_d: 'None',
           correct_option: 'A',
           explanation: 'This is a mock question representing a raw text document.',
           difficulty: 'moderate'
        });
     }
     // Limit to 20 questions so we don't spam the DB
     return questions.slice(0, 20);
  }
  
  async function processDir(currentPath) {
     const entries = fs.readdirSync(currentPath, { withFileTypes: true });
     for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
           await processDir(fullPath);
        } else if (entry.name.endsWith('.txt')) {
           const content = fs.readFileSync(fullPath, 'utf8');
           if (content.trim().length === 0) continue;
           
           let category = 'TCS - TCS Premium';
           if (fullPath.toLowerCase().includes('ninja')) category = 'TCS - TCS Ninja';
           if (fullPath.toLowerCase().includes('technical') || fullPath.toLowerCase().includes('coding') || fullPath.toLowerCase().includes('program')) category = 'TCS - Technical Round';
           
           console.log(`Processing ${entry.name} for category ${category}`);
           
           const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
              title: entry.name.replace('.txt', ''),
              category: category,
              difficulty: 'moderate',
              time_limit: 30,
              pass_percent: 60,
              show_explanation: 'after_quiz',
              status: 'Published'
           }).select().single();
           
           if (quizErr) {
              console.error(`Quiz Insert Error for ${entry.name}:`, quizErr);
              continue;
           }
           
           const questions = parseQuestions(content);
           if (questions.length > 0) {
              const qsToInsert = questions.map(q => ({ ...q, quiz_id: quiz.id }));
              const { error: qErr } = await supabase.from('questions').insert(qsToInsert);
              if (qErr) console.error('Questions Insert Error:', qErr);
           }
        }
     }
  }
  
  console.log('Starting TCS import...');
  await processDir(materialsDir);
  console.log('Done importing TCS Quizzes!');
}

importTCS();
