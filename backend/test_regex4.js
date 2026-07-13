const supabase=require('./database');
async function test(){
  const {data}=await supabase.from('questions').select('*').eq('quiz_id', 886).like('question_text', '%Q.62%');
  const text = data[0].question_text;
  const match = text.match(/\$([^\$]+)\$/g);
  console.log(match);
  if (match) {
    match.forEach(m => console.log(JSON.stringify(m)));
  }
}
test();
