const supabase = require('./database');

async function renameQuizzes() {
    console.log("Fetching quizzes in TCS Question Bank...");
    const { data: quizzes, error } = await supabase
        .from('quizzes')
        .select('id, title')
        .eq('category', 'TCS - TCS Question Bank');
        
    if (error) {
        console.error("Error fetching:", error);
        return;
    }
    
    // Sort by id to ensure we get them in insertion order
    quizzes.sort((a, b) => a.id - b.id);
    
    for (let i = 0; i < quizzes.length; i++) {
        const q = quizzes[i];
        const newTitle = `Question Bank ${i + 1}`;
        console.log(`Renaming "${q.title}" -> "${newTitle}"`);
        
        await supabase.from('quizzes').update({ title: newTitle }).eq('id', q.id);
    }
    
    console.log("Renaming complete!");
}

renameQuizzes();
