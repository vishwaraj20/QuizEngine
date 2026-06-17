require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const desc = fs.readFileSync('C:\\Users\\Vinit Shinde\\Downloads\\Programming-Aptitude-Interview-Prep-main\\Programming-Aptitude-Interview-Prep-main\\TCS\\Que 1\\Problem Statement.txt', 'utf8');
  const code = fs.readFileSync('C:\\Users\\Vinit Shinde\\Downloads\\Programming-Aptitude-Interview-Prep-main\\Programming-Aptitude-Interview-Prep-main\\TCS\\Que 1\\Solution.java', 'utf8');

  const { data, error } = await supabase.from('coding_problems').insert([{
    company: 'TCS',
    title: 'Two Wheeler and Four Wheeler Production',
    description: desc,
    difficulty: 'medium',
    starter_code: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        \n    }\n}'
  }]);

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Successfully inserted TCS coding problem!");
  }
}

main();
