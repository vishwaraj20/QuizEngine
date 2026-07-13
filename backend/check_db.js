const supabase = require('./database');
async function check() {
  const { data } = await supabase.from('quizzes').select('*').limit(1);
  console.log(data);
}
check();
