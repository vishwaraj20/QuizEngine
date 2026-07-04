const supabase = require('./database');

async function cleanup() {
    console.log("Fetching quizzes in TCS Question Bank...");
    const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('id, title')
        .eq('category', 'TCS - TCS Question Bank');
        
    if (error) {
        console.error("Error fetching:", error);
        return;
    }
    
    console.log(`Found ${quizzes.length} quizzes to delete.`);
    
    for (const q of quizzes) {
        console.log(`Deleting questions for ${q.title}...`);
        await supabase.from('questions').delete().eq('quiz_id', q.id);
        
        console.log(`Deleting quiz ${q.title}...`);
        await supabase.from('quizzes').delete().eq('id', q.id);
    }
    
    console.log("Cleanup complete!");
}

cleanup();
