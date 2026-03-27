require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
  try {
      console.log("Fetching available models...");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      const data = await response.json();
      console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch(e) {
      console.error(e);
  }
}

checkModels();
