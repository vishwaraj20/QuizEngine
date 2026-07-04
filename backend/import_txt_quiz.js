const fs = require('fs');
const path = require('path');
const supabase = require('./database');

async function importTxt() {
    const textPath = path.join(__dirname, "../frontend/public/materials/TCS_text/FACE tcs verbal ability 10 q.txt");
    const text = fs.readFileSync(textPath, 'utf8');
    const lines = text.split('\n').map(l => l.trim());

    const questions = [];
    let currentQuestion = null;
    let mode = 'none';

    for (const line of lines) {
        if (!line) continue;
        if (line.match(/^TEST CODE|^Total number|^Test duration|^Correct attempt|^Wrong attempt|^QUANTITATIVE APTITUDE|^VERBAL ABILITY|^Focus Academy/i)) {
            continue;
        }

        if (/^\d+\./.test(line) && !line.includes('Questions 1 to 2')) {
            if (currentQuestion) questions.push(currentQuestion);
            currentQuestion = {
                question_text: line,
                options_raw: [],
                correct_option: 'A',
                explanation: '',
            };
            mode = 'question';
        } else if (currentQuestion) {
            if (/^Answer:\s*([A-D])/i.test(line)) {
                currentQuestion.correct_option = line.match(/^Answer:\s*([A-D])/i)[1].toUpperCase();
                mode = 'answer';
            } else if (/^Explanation:/i.test(line)) {
                currentQuestion.explanation = line.replace(/^Explanation:\s*/i, '').trim();
                mode = 'explanation';
            } else if (line.match(/^[a-d]\.\s/i)) {
                mode = 'options';
                currentQuestion.options_raw.push(line);
            } else {
                if (mode === 'question') {
                    currentQuestion.question_text += '\n' + line;
                } else if (mode === 'options') {
                    currentQuestion.options_raw.push(line);
                } else if (mode === 'explanation') {
                    currentQuestion.explanation += (currentQuestion.explanation ? '\n' : '') + line;
                }
            }
        }
    }
    if (currentQuestion) questions.push(currentQuestion);

    console.log(`Found ${questions.length} questions.`);

    const formattedQs = questions.map(q => {
        let fullOptionsText = q.options_raw.join(' ');
        let optA = 'Option A', optB = 'Option B', optC = 'Option C', optD = 'Option D';
        
        let match = fullOptionsText.match(/a\.\s*(.*?)\s*b\.\s*(.*?)\s*c\.\s*(.*?)\s*d\.\s*(.*)/i);
        if (match) {
            optA = match[1]; optB = match[2]; optC = match[3]; optD = match[4];
        } else if (q.options_raw.length >= 4) {
            optA = q.options_raw[0].replace(/^[a-d]\.\s*/i, '');
            optB = q.options_raw[1].replace(/^[a-d]\.\s*/i, '');
            optC = q.options_raw[2].replace(/^[a-d]\.\s*/i, '');
            optD = q.options_raw[3].replace(/^[a-d]\.\s*/i, '');
        } else {
            // Try matching in parts
            const optsMatch = fullOptionsText.split(/(?:[a-d]\.\s*)/i).filter(Boolean);
            if (optsMatch.length >= 4) {
                 optA = optsMatch[0]; optB = optsMatch[1]; optC = optsMatch[2]; optD = optsMatch[3];
            }
        }

        return {
            question_text: q.question_text,
            option_a: optA,
            option_b: optB,
            option_c: optC,
            option_d: optD,
            correct_option: q.correct_option,
            explanation: q.explanation,
            difficulty: 'moderate'
        };
    });

    const d = new Date();
    
    console.log("Inserting Quiz into DB...");
    const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
        title: 'FACE TCS Verbal Ability 10 Qs',
        category: 'TCS - Verbal Ability',
        difficulty: 'moderate',
        time_limit: 10,
        pass_percent: 60,
        show_explanation: 'after_quiz',
        status: 'Live',
        created_at: d.toISOString()
    }).select().single();
    
    if (quizErr) {
        console.error("Quiz Insert Error:", quizErr); 
        return;
    }
    
    const toInsert = formattedQs.map(q => ({ ...q, quiz_id: quiz.id }));
    const { error: qsErr } = await supabase.from('questions').insert(toInsert);
    
    if (qsErr) {
        console.error("Questions Insert Error:", qsErr);
    } else {
        console.log(`Successfully inserted ${toInsert.length} questions from TXT!`);
    }
}

importTxt();
