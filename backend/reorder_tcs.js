const supabase = require('./database');

async function reorder() {
   for (let i = 1; i <= 8; i++) {
      const title = `TCS Quant Test ${i}`;
      // To make Test 1 appear first (newest), it needs a later timestamp.
      // So Test i gets timestamp: now() minus i hours.
      const d = new Date();
      d.setHours(d.getHours() - i); 
      
      const { error } = await supabase.from('quizzes')
        .update({ created_at: d.toISOString() })
        .eq('title', title)
        .eq('category', 'TCS - Quantitative Aptitude');
        
      if (error) {
         console.error(`Error updating ${title}:`, error);
      } else {
         console.log(`Updated ${title} to ${d.toISOString()}`);
      }
   }
   console.log("Done reordering!");
}

reorder();
