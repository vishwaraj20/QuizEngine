const supabase = require('./database');

const answers = `
 a   
PDF

a   
PDF

d   
PDF

a   
PDF

a   
PDF

b   
PDF

d   
PDF

b   
PDF

b   
PDF

a   
PDF

b   
PDF

a   
PDF

c   
PDF

b   
PDF

c   
PDF

b   
PDF

a   
PDF

b   
PDF

d   
PDF

b   
PDF

a   
PDF

c   
PDF

b   
PDF

a   
PDF

b   
PDF

c   
PDF

c   
PDF

d   
PDF

a   
PDF

d   
PDF

a   
PDF

c   
PDF

c   
PDF

a   
PDF

c   
PDF

c   
PDF

c   
PDF

c   
PDF

b   
PDF

b   
PDF

c   
PDF

d   
PDF

c   
PDF

a   
PDF

d   
PDF

a   
PDF

a   
PDF

c   
PDF

c   
PDF

c   
PDF

c   
PDF

b   
PDF

a   
PDF

c   
PDF

b   
PDF

b   
PDF

d   
PDF

b   
PDF

a   
PDF

d   
PDF

d   
PDF

b   
PDF

b   
PDF

c   
PDF

b   
PDF

a   
PDF

a   
PDF

b   
PDF

c   
PDF

a   
PDF

d   
PDF

b   
PDF

c   
PDF

c   
PDF

d   
PDF

b   
PDF

b   
PDF

d   
PDF

b   
PDF

d   
PDF

b   
PDF

c   
PDF

c   
PDF

b   
PDF

a   
PDF

a   
PDF

b   
PDF

b   
PDF

b   
PDF

b   
PDF

c   
PDF

c   
PDF

b   
PDF

d   
PDF

b   
PDF

b   
PDF

b   
PDF

d   
PDF

c   
PDF

a   
PDF
`;

async function updateAnswers() {
    // parse answers
    const lines = answers.split('\n').map(l => l.trim()).filter(l => l.length === 1 && /^[a-d]$/i.test(l));
    console.log(`Parsed ${lines.length} answers.`);

    const { data: quiz, error: quizErr } = await supabase
        .from('quizzes')
        .select('id')
        .eq('title', 'TCS Aptitude Question Bank - Part 4')
        .single();
        
    if (quizErr) {
        console.error("Error finding quiz:", quizErr);
        return;
    }

    const { data: questions, error: qErr } = await supabase
        .from('questions')
        .select('id')
        .eq('quiz_id', quiz.id)
        .order('id', { ascending: true });
        
    if (qErr) {
        console.error("Error finding questions:", qErr);
        return;
    }

    console.log(`Found ${questions.length} questions for Part 4.`);
    
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
        const ans = lines[i];
        if (ans) {
            await supabase
                .from('questions')
                .update({ correct_option: ans.toUpperCase() })
                .eq('id', questions[i].id);
            updated++;
        }
    }
    console.log(`Successfully updated ${updated} questions with the provided answer key.`);
}

updateAnswers();
