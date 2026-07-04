const supabase = require('./database');

async function run() {
    console.log("Fetching all TCS Ninja quizzes...");
    const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('category', 'TCS - TCS Ninja');
        
    if (error) {
        console.error("Error fetching quizzes:", error);
        return;
    }
    
    console.log(`Found ${quizzes.length} quizzes. Updating categories...`);
    
    for (const quiz of quizzes) {
        let newCategory = null;
        if (quiz.title.toLowerCase().includes('quantitative')) {
            newCategory = 'TCS - TCS Ninja - Quantitative';
        } else if (quiz.title.toLowerCase().includes('verbal')) {
            newCategory = 'TCS - TCS Ninja - Verbal';
        }
        
        if (newCategory) {
            console.log(`Updating '${quiz.title}' -> '${newCategory}'`);
            const { error: updateErr } = await supabase
                .from('quizzes')
                .update({ category: newCategory })
                .eq('id', quiz.id);
                
            if (updateErr) {
                console.error(`Failed to update ${quiz.title}:`, updateErr);
            }
        } else {
            console.log(`Skipping '${quiz.title}' - no matching keyword.`);
        }
    }
    
    console.log("Done!");
}

run();
