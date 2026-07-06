const supabase = require('./database');

async function listQuizzes() {
    const { data, error } = await supabase.from('quizzes').select('id, title').ilike('title', '%TCS%');
    if (error) {
        console.error(error);
        return;
    }
    console.log("Quizzes:", data);
}

listQuizzes();
