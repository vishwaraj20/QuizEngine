const fs = require('fs');
const path = require('path');
const supabase = require('./database');

async function importQuestionBank() {
    const textPath = path.join(__dirname, "../frontend/public/materials/TCS_text/Tcs aptitude question bank (44pgs).txt");
    const text = fs.readFileSync(textPath, 'utf8');
    const lines = text.split('\n');

    const rawQuestions = [];
    let currentBlock = [];

    for (const line of lines) {
        const tline = line.trim();
        if (!tline) continue;
        if (tline.match(/^(?:COMPANY BASED QUESTION|COMPANY WISE QUESTION|TCS TOPICS|TCS QUESTION)/)) {
            continue;
        }

        // Detect start of new question: "1.", "1)", "133) (*)", "12."
        if (tline.match(/^\d+[\.\)]/)) {
            if (currentBlock.length > 0) {
                rawQuestions.push(currentBlock.join('\n'));
            }
            currentBlock = [tline];
        } else {
            if (currentBlock.length > 0) {
                currentBlock.push(tline);
            }
        }
    }
    if (currentBlock.length > 0) {
        rawQuestions.push(currentBlock.join('\n'));
    }

    console.log(`Parsed ${rawQuestions.length} raw question blocks.`);

    const questions = [];

    for (let raw of rawQuestions) {
        // Clean up the numbering at the start (e.g. "1. " or "133) ")
        let textWithoutNumber = raw.replace(/^\d+[\.\)]\s*(?:\(\*\)\s*)?/, '').trim();
        
        let qText = textWithoutNumber;
        let optA = 'Option A', optB = 'Option B', optC = 'Option C', optD = 'Option D';
        
        // Find options using regex
        // Options format: a., a), (a), A., A), (A)
        const optRegex = /(?:[aA][\.\)]|\([aA]\))\s*(.*?)\s*(?:[bB][\.\)]|\([bB]\))\s*(.*?)\s*(?:[cC][\.\)]|\([cC]\))\s*(.*?)\s*(?:[dD][\.\)]|\([dD]\))\s*(.*)/is;
        
        const match = qText.match(optRegex);
        if (match) {
            optA = match[1].trim();
            optB = match[2].trim();
            optC = match[3].trim();
            optD = match[4].trim();
            
            // Remove options from question text
            qText = qText.substring(0, match.index).trim();
        } else {
            // Fallback: look for just a. b. c. d. scattered around
             const aMatch = qText.match(/(?:[aA][\.\)]|\([aA]\))\s*(.*)/s);
             if (aMatch) {
                 const block = aMatch[0];
                 const parts = block.split(/(?:[a-d|A-D][\.\)]|\([a-d|A-D]\))\s*/).filter(Boolean);
                 if (parts.length >= 4) {
                     optA = parts[0].trim();
                     optB = parts[1].trim();
                     optC = parts[2].trim();
                     optD = parts[3].trim();
                 }
                 qText = qText.substring(0, aMatch.index).trim();
             }
        }

        // Clean up options if they contain e) none of these
        optD = optD.replace(/\s*(?:[eE][\.\)]|\([eE]\))\s*.*$/is, '').trim();

        questions.push({
            question_text: qText || 'Unknown Question',
            option_a: optA,
            option_b: optB,
            option_c: optC,
            option_d: optD,
            correct_option: 'A', // Default since no answers provided
            explanation: 'No explanation provided for this question bank.',
            difficulty: 'hard' // Based on the nature of the questions
        });
    }

    console.log(`Successfully formatted ${questions.length} questions.`);

    const numChunks = 6;
    
    console.log(`Splitting into exactly ${numChunks} mock tests...`);

    let totalInserted = 0;
    
    for (let i = 0; i < numChunks; i++) {
        let chunk;
        if (i === 5) {
            // Last chunk takes all remaining questions
            chunk = questions.slice(i * 100);
        } else {
            chunk = questions.slice(i * 100, (i + 1) * 100);
        }
        const title = `TCS Aptitude Question Bank - Part ${i + 1}`;
        
        console.log(`Inserting Quiz: ${title} (${chunk.length} questions)`);
        
        const d = new Date();
        const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
            title: title,
            category: 'TCS - TCS Question Bank',
            difficulty: 'hard',
            time_limit: chunk.length, // Not strictly used for material but good to have
            pass_percent: 60,
            show_explanation: 'after_quiz',
            status: 'Live',
            created_at: d.toISOString()
        }).select().single();
        
        if (quizErr) {
            console.error("Quiz Insert Error:", quizErr); 
            continue;
        }
        
        const toInsert = chunk.map(q => ({ ...q, quiz_id: quiz.id }));
        const { error: qsErr } = await supabase.from('questions').insert(toInsert);
        
        if (qsErr) {
            console.error(`Questions Insert Error (Part ${i+1}):`, qsErr);
        } else {
            totalInserted += toInsert.length;
        }
    }
    
    console.log(`Done! Successfully inserted a total of ${totalInserted} questions.`);
}

importQuestionBank();
