require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });
const { createClient } = require('../backend/node_modules/@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runUpdate() {
  console.log("Updating status to Live for SSC CGL 2025 - 22...");

  const { data, error } = await supabase
    .from('quizzes')
    .update({
      status: "Live",
      year: "2025",
      phase: "Tier 1",
      quiz_mode: "PYQ Papers"
    })
    .eq('title', 'SSC CGL 2025 - 22')
    .select();

  if (error) {
    console.error("Error updating status:", error);
  } else {
    console.log("Updated status successfully:", data);
  }
}

runUpdate();
