require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Unfortunately getGenerativeModel doesn't list models. We can fetch them via REST.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(m => console.log(m.name));
    } catch (e) {
        console.error(e);
    }
}
listModels();
