const mammoth = require("mammoth");
const path = require('path');
const cheerio = require('cheerio');

async function testDocx() {
   const result = await mammoth.convertToHtml({path: path.join(__dirname, "../data/TCS Ninja - Quantitative Aptitude_2.docx")});
   const html = result.value;
   const $ = cheerio.load(html);
   
   let count = 0;
   let insideTarget = false;
   $('p').each((i, el) => {
      let text = $(el).text().trim();
      let imgTag = $(el).find('img').first();
      
      if (text.startsWith("17.")) insideTarget = true;
      if (text.startsWith("19.")) insideTarget = false;
      
      if (insideTarget) {
         console.log("TEXT:", text);
         if (imgTag.length > 0) {
            console.log("IMAGE FOUND");
         }
      }
   });
}

testDocx();
