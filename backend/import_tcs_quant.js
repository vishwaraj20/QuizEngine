const fs = require('fs');
const path = require('path');
const supabase = require('./database');

async function importSingle() {
  // Fix the old ones just in case
  await supabase.from('quizzes').update({ status: 'Live' }).eq('status', 'Published');

  // Delete previous inserts of this test if any
  await supabase.from('quizzes').delete().eq('title', 'TCS Quant Test 8');

  let fileContent = fs.readFileSync(path.join(__dirname, '../data/tcs q 8.txt'), 'utf8');
  
  // Fix inline questions by adding a newline if there's multiple spaces before a number dot space
  fileContent = fileContent.replace(/(\s{2,})(\d+\.\s)/g, '\n$2');

  // Split by number followed by dot and space at start of line, allowing leading whitespace
  const chunks = fileContent.split(/(?:^\s*\d+\.\s|\n\s*\d+\.\s)/m);
  const questions = [];
  
  chunks.forEach(chunk => {
     if (chunk.trim().length > 10) {
        // split by new lines
        const lines = chunk.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length >= 5) {
           const qText = lines[0]; // first line is question
           const optionA = lines[1];
           const optionB = lines[2];
           const optionC = lines[3];
           const optionD = lines[4];
           questions.push({
             question_text: qText,
             option_a: optionA,
             option_b: optionB,
             option_c: optionC,
             option_d: optionD,
             correct_option: 'A', // placeholder
             difficulty: 'moderate'
           });
        }
     }
  });

  const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
     title: 'TCS Quant Test 8',
     category: 'TCS - Quantitative Aptitude',
     difficulty: 'moderate',
     time_limit: 30,
     pass_percent: 60,
     show_explanation: 'after_quiz',
     status: 'Live'
  }).select().single();
  
  if (quizErr) {
     console.error('Error inserting quiz:', quizErr);
     return;
  }
  
  if (questions.length > 0) {
     const qsToInsert = questions.map(q => ({ ...q, quiz_id: quiz.id }));
     const { error: qErr } = await supabase.from('questions').insert(qsToInsert);
     if (qErr) {
        console.error('Error inserting questions:', qErr);
     } else {
        console.log('Successfully inserted ' + questions.length + ' questions!');
     }
  } else {
     console.log('No questions parsed.');
  }
}

importSingle();
