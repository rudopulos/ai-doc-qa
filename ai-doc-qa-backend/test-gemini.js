require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  try {
    const result = await geminiModel.generateContent("Spune-mi pe scurt un salut în română.");
    console.log("Răspuns succes:", result.response.text());
  } catch (error) {
    fs.writeFileSync('test-err.txt', error.toString());
    console.error("Savind eroare reală în test-err.txt");
  }
}

run();
