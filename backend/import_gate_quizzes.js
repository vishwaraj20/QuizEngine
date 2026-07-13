require('dotenv').config();
const fs = require('fs');
const path = require('path');
const supabase = require('./database');

function getPhaseFromFilename(filename) {
    const name = filename.toLowerCase();
    if (name.includes('cse') || name.includes('computer')) return 'Computer Science (CS)';
    if (name.includes('mech')) return 'Mechanical (ME)';
    if (name.includes('civil')) return 'Civil (CE)';
    if (name.includes('ee')) return 'Electrical (EE)';
    if (name.includes('electronics')) return 'Electronics (EC)';
    if (name.includes('instrumentation')) return 'Instrumentation (IN)';
    if (name.includes('agricultural')) return 'Agricultural (AG)';
    if (name.includes('architecture')) return 'Architecture and Planning (AR)';
    return 'Unknown Branch';
}

function getYearFromFilename(filename) {
    const match = filename.match(/\d{4}/);
    return match ? match[0] : 'Unknown Year';
}

async function importGateQuizzes() {
    const extractedDir = path.join(__dirname, 'gate_extracted_json');
    if (!fs.existsSync(extractedDir)) {
        console.log(`Directory ${extractedDir} does not exist. Run extraction script first.`);
        return;
    }

    const files = fs.readdirSync(extractedDir).filter(f => f.endsWith('.json'));
    
    // Get max quiz id to avoid sequence issues
    const { data: maxQuiz } = await supabase.from('quizzes').select('id').order('id', { ascending: false }).limit(1);
    let nextQuizId = maxQuiz && maxQuiz.length > 0 ? maxQuiz[0].id + 1 : 1;

    for (const file of files) {
        const filePath = path.join(extractedDir, file);
        console.log(`Importing ${file}...`);
        
        let questionsArray = [];
        try {
            let raw = fs.readFileSync(filePath, 'utf8');
            questionsArray = new Function('return ' + raw)();
        } catch (e) {
            console.error(`Failed to parse JSON for ${file}:`, e.message);
            continue;
        }

        const phase = getPhaseFromFilename(file);
        const year = getYearFromFilename(file);
        
        const title = `GATE ${phase.split(' ')[0]} ${year} Paper`;
        
        const { data: existing } = await supabase.from('quizzes').select('id').eq('title', title);
        if (existing && existing.length > 0) {
            console.log(`Skipping ${title}, already exists in DB.`);
            continue;
        }

        const quizId = nextQuizId++;
        
        // 1. Create Quiz Entry
        const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
            id: quizId,
            title: title,
            category: 'GATE',
            phase: phase,
            year: year,
            quiz_mode: 'PYQ Papers',
            difficulty: 'hard',
            time_limit: 180,
            pass_percent: 33,
            show_explanation: 'after_quiz',
            status: 'Live'
        }).select().single();
        
        if (quizErr) {
            console.error(`Error creating quiz for ${file}:`, quizErr.message);
            continue;
        }
        
        console.log(`Created Quiz ID: ${quiz.id}`);

        // 2. Insert Questions
        const questionsToInsert = questionsArray.map(q => ({
            quiz_id: quizId,
            question_text: `[${q.question_number || 'Q'}] ${q.question}`,
            option_a: q.options ? q.options.A || 'N/A' : 'NAT (No Option)',
            option_b: q.options ? q.options.B || 'N/A' : 'NAT (No Option)',
            option_c: q.options ? q.options.C || 'N/A' : 'NAT (No Option)',
            option_d: q.options ? q.options.D || 'N/A' : 'NAT (No Option)',
            correct_option: q.correct || 'A',
            explanation: q.explanation || `Question type: ${q.question_type || 'Unknown'}`,
            difficulty: 'hard'
        }));

        if (questionsToInsert.length > 0) {
            const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
            if (qErr) {
                console.error(`Error inserting questions for ${file}:`, qErr.message);
            } else {
                console.log(`Successfully inserted ${questionsToInsert.length} questions.`);
            }
        }
    }
    
    console.log("Finished importing GATE quizzes.");
}

importGateQuizzes();
