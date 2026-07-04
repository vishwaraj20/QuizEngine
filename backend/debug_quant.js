const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../data/tsc q 1.txt'), 'utf8');
const chunks = fileContent.split(/(?:^\d+\.|\n\d+\.)/m);

console.log("Total chunks: ", chunks.length);

chunks.forEach((chunk, index) => {
   if (chunk.trim().length > 10) {
      const lines = chunk.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 5) {
         console.log(`Chunk ${index} has less than 5 lines:`, lines.length);
         console.log(lines);
      }
   }
});
