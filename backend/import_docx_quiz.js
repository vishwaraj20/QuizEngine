const mammoth = require("mammoth");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');
const supabase = require('./database');

async function processDocx() {
   const imgDir = path.join(__dirname, '../frontend/public/materials/images');
   if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir, { recursive: true });
   }

   const options = {
      convertImage: mammoth.images.imgElement(function(image) {
         return image.read("base64").then(function(imageBuffer) {
               const ext = image.contentType.split('/')[1] || 'png';
               const filename = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
               const publicPath = path.join(imgDir, filename);
               const srcPath = `/materials/images/${filename}`;
               fs.writeFileSync(publicPath, imageBuffer, 'base64');
               return {
                  src: srcPath
               };
         });
      })
   };

   console.log("Parsing DOCX...");
   const result = await mammoth.convertToHtml({path: path.join(__dirname, "../data/verbal ability 1.docx")}, options);
   const html = result.value;
   
   console.log("Extracting questions...");
   const $ = cheerio.load(html);
   
   const questions = [];
   let currentQuestion = null;
   let mode = 'none';
   let pendingImages = [];
   
   $('p').each((i, el) => {
      let text = $(el).text().trim();
      let imgTag = $(el).find('img').first();
      let imgSrc = imgTag.length > 0 ? imgTag.attr('src') : null;
      
      if (text.length === 0 && !imgSrc) return;

      if (text.match(/^TEST CODE|^Total number|^Test duration|^Correct attempt|^Wrong attempt|^QUANTITATIVE APTITUDE|^VERBAL ABILITY/i)) {
          return;
      }

      if (/^\d+\./.test(text)) {
         if (currentQuestion) questions.push(currentQuestion);
         currentQuestion = {
            question_text: text,
            options_raw: [],
            correct_option: 'A',
            explanation: '',
            images: [...pendingImages]
         };
         pendingImages = [];
         mode = 'question';
         if (imgSrc) currentQuestion.images.push(imgSrc);
      } else if (currentQuestion) {
         if (/^Answer:\s*([A-D])/i.test(text)) {
            currentQuestion.correct_option = text.match(/^Answer:\s*([A-D])/i)[1].toUpperCase();
            mode = 'answer';
         } else if (/^Explanation:/i.test(text)) {
            currentQuestion.explanation = text.replace(/^Explanation:\s*/i, '').trim();
            mode = 'explanation';
         } else if (text.match(/^[a-d]\.\s/i)) {
            mode = 'options';
            currentQuestion.options_raw.push(text);
         } else {
            // continuation
            if (mode === 'question') {
               currentQuestion.question_text += '\n' + text;
            } else if (mode === 'options') {
               currentQuestion.options_raw.push(text);
            } else if (mode === 'explanation') {
               currentQuestion.explanation += (currentQuestion.explanation ? '\n' : '') + text;
            }
         }
         
         if (imgSrc) {
            if (mode === 'explanation') {
               pendingImages.push(imgSrc);
            } else {
               currentQuestion.images.push(imgSrc);
            }
         }
      } else {
         if (imgSrc) pendingImages.push(imgSrc);
      }
   });
   
   if (currentQuestion) questions.push(currentQuestion);
   
   console.log(`Found ${questions.length} questions.`);

   const formattedQs = questions.map(q => {
      let finalQuestionText = q.question_text;
      if (q.images.length > 0) {
         const imageTags = q.images.map(src => `<img src="${src}" class="max-w-full rounded-xl mb-4 mt-2 shadow-sm border border-gray-200 dark:border-slate-700" />`).join('<br/>');
         finalQuestionText = finalQuestionText + '<br/>' + imageTags;
      }
      
      let fullOptionsText = q.options_raw.join(' ');
      let optA = 'Option A', optB = 'Option B', optC = 'Option C', optD = 'Option D';
      
      let match = fullOptionsText.match(/a\.\s*(.*?)\s*b\.\s*(.*?)\s*c\.\s*(.*?)\s*d\.\s*(.*)/i);
      if (match) {
          optA = match[1]; optB = match[2]; optC = match[3]; optD = match[4];
      } else {
          if (q.options_raw.length >= 4) {
              optA = q.options_raw[0].replace(/^[a-d]\.\s*/i, '');
              optB = q.options_raw[1].replace(/^[a-d]\.\s*/i, '');
              optC = q.options_raw[2].replace(/^[a-d]\.\s*/i, '');
              optD = q.options_raw[3].replace(/^[a-d]\.\s*/i, '');
          }
      }
      
      return {
         question_text: finalQuestionText,
         option_a: optA,
         option_b: optB,
         option_c: optC,
         option_d: optD,
         correct_option: q.correct_option,
         explanation: q.explanation,
         difficulty: 'moderate'
      }
   });

   // Ensure the timestamp is in the future so it sorts to the top (first quiz)
   const d = new Date();
   d.setMinutes(d.getMinutes() - 30); // slightly less future so it goes under the previous one
   
   console.log("Inserting Quiz into DB...");
   const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
      title: 'Verbal Ability 1',
      category: 'TCS - Verbal Ability',
      difficulty: 'moderate',
      time_limit: 40,
      pass_percent: 60,
      show_explanation: 'after_quiz',
      status: 'Live',
      created_at: d.toISOString()
   }).select().single();
   
   if (quizErr) {
      console.error("Quiz Insert Error:", quizErr); 
      return;
   }
   
   console.log("Inserting Questions into DB...");
   const toInsert = formattedQs.map(q => ({ ...q, quiz_id: quiz.id }));
   const { error: qsErr } = await supabase.from('questions').insert(toInsert);
   
   if (qsErr) {
       console.error("Questions Insert Error:", qsErr);
   } else {
       console.log(`Successfully inserted ${toInsert.length} questions from DOCX!`);
   }
}

processDocx();
