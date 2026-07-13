require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
    }
});

const SYSTEM_PROMPT = `
You are an expert data extractor parsing a GATE engineering exam PDF. 
Your task is to accurately extract all the questions from this exam paper into a structured JSON array.

The PDF has a complex two-column layout. Read the columns in the correct logical order.
Identify the question number (e.g., Q.1, Q.2) and extract the question text, options (if any), and any relevant context.

Format requirements for the output JSON array:
[
  {
    "question_number": "Q.1",
    "question": "Full text of the question. For mathematical formulas, use standard LaTeX syntax enclosed in single $ (e.g., $x^2 + y^2 = r^2$).",
    "question_type": "MCQ", // 'MCQ', 'MSQ', or 'NAT'
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    }, // Set to null if it's a NAT question
    "correct": null,
    "explanation": null
  }
]

IMPORTANT RULES:
1. ONLY return the JSON array.
2. Ensure you parse all questions in the paper. GATE papers usually have 65 questions.
3. For NAT questions, options should be null.
4. Preserve mathematical formatting using LaTeX enclosed in single $.
5. CRITICAL: When writing LaTeX sets with curly braces, you MUST escape the braces with backslashes (e.g., $\\{a, b\\}$ instead of \${a, b}).
6. CRITICAL: If a question contains a table, grammar rules, or code snippet, format it as a markdown code block (using triple backticks) and ensure there is a BLANK LINE before and after the code block.
`;

async function extractQuestions(filePath, outputPath) {
    if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${path.basename(filePath)}, already extracted.`);
        return true;
    }
    
    console.log(`\n--- Processing ${path.basename(filePath)} ---`);
    let retries = 5;
    let delay = 15000;
    
    while (retries > 0) {
        try {
            const uploadResult = await fileManager.uploadFile(filePath, {
                mimeType: "application/pdf",
                displayName: path.basename(filePath)
            });
            
            console.log(`Upload complete. Processing with Gemini...`);

            const result = await model.generateContent([
                { fileData: { mimeType: uploadResult.file.mimeType, fileUri: uploadResult.file.uri } },
                { text: SYSTEM_PROMPT }
            ]);

            const responseText = result.response.text();
            
            fs.writeFileSync(outputPath, responseText);
            console.log(`✅ Extraction successful! Saved to ${outputPath}`);
            
            await fileManager.deleteFile(uploadResult.file.name);
            console.log(`Cleaned up remote file.`);
            return false;
        } catch (err) {
            console.error(`❌ Error extracting ${filePath}:`, err.message);
            retries--;
            if (retries === 0) {
                console.error(`Skipping ${path.basename(filePath)} after maximum retries.`);
                return false; // Move on after max retries
            }
            console.log(`Rate limit hit or API error. Retrying in ${delay / 1000} seconds... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay += 15000; // Increase delay by 15s each time
        }
    }
}

function getAllPdfFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllPdfFiles(filePath, fileList);
        } else if (filePath.toLowerCase().endsWith('.pdf')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function processAll() {
    const inputDir = path.join(__dirname, '../data/gate_extracted');
    const outputDir = path.join(__dirname, 'gate_extracted_json');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    const pdfFiles = getAllPdfFiles(inputDir);
    console.log(`Found ${pdfFiles.length} PDF files to process.`);
    
    for (let i = 0; i < pdfFiles.length; i++) {
        const pdfPath = pdfFiles[i];
        const folderName = path.basename(path.dirname(pdfPath));
        const outputFilename = `${folderName}_${path.basename(pdfPath, '.pdf')}.json`.replace(/\s+/g, '_');
        const outputPath = path.join(outputDir, outputFilename);
        
        console.log(`[${i+1}/${pdfFiles.length}] Starting...`);
        const skipped = await extractQuestions(pdfPath, outputPath);
        
        // Wait 10 seconds between requests to avoid rate limits, unless skipped
        if (!skipped && i < pdfFiles.length - 1) {
            console.log("Waiting 10 seconds to avoid rate limits...");
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    
    console.log("\n🎉 All PDFs processed successfully!");
    console.log("Next, run 'node import_gate_quizzes.js' to insert them into the database.");
}

processAll();
