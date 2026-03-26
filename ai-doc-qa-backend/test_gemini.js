require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Note: The SDK doesn't have a direct listModels method, we have to use the REST API or try a known one.
  // Actually, let's just try gemini-pro which almost always works.
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hi");
      console.log("Gemini-pro works:", result.response.text());
  } catch (e) {
      console.log("Gemini-pro failed:", e.message);
  }
}

listModels();
