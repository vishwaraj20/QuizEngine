require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1, // Low temp for deterministic extraction
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
    "question_type": "MCQ", // Can be 'MCQ' (Multiple Choice), 'MSQ' (Multiple Select), or 'NAT' (Numerical Answer Type)
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    }, // Set to null if it's a NAT question
    "correct": null, // If an answer key is present at the end of the PDF, put the correct answer here. Otherwise null.
    "explanation": null
  }
]

IMPORTANT RULES:
1. ONLY return the JSON array.
2. Ensure you parse all questions in the paper. GATE papers usually have 65 questions.
3. For NAT questions, options should be null.
4. Preserve mathematical formatting using LaTeX.
`;

async function extractQuestions(filePath, outputPath) {
    console.log(`Uploading ${filePath} to Gemini...`);
    try {
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: "application/pdf",
            displayName: path.basename(filePath)
        });
        
        console.log(`Upload complete. File URI: ${uploadResult.file.uri}`);
        console.log(`Processing with Gemini-1.5-Pro... (This may take 1-3 minutes)`);

        const result = await model.generateContent([
            { fileData: { mimeType: uploadResult.file.mimeType, fileUri: uploadResult.file.uri } },
            { text: SYSTEM_PROMPT }
        ]);

        const responseText = result.response.text();
        
        fs.writeFileSync(outputPath, responseText);
        console.log(`✅ Extraction successful! Saved to ${outputPath}`);
        
        // Cleanup file from Gemini servers
        await fileManager.deleteFile(uploadResult.file.name);
        console.log(`Cleaned up remote file.`);
    } catch (err) {
        console.error(`❌ Error extracting ${filePath}:`, err.message);
    }
}

// Test on single paper first
const testFile = path.join(__dirname, '../data/gate_extracted/cse 2023.pdf');
const outputFile = path.join(__dirname, 'cse_2023_extracted.json');

extractQuestions(testFile, outputFile);
