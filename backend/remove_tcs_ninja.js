const supabase = require('./database');

async function removeTcsNinja() {
    const { data, error } = await supabase
        .from('quizzes')
        .delete()
        .eq('category', 'TCS - TCS Ninja');
        
    if (error) {
        console.error("Error deleting:", error);
    } else {
        console.log("Successfully removed all quizzes from TCS Ninja category!");
    }
}

removeTcsNinja();
