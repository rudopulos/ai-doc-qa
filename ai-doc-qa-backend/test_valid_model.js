require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

async function testFirstModel() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await axios.get(url);
    const models = response.data.models;
    // Filter for models that support generateContent
    const validModels = models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
    if (validModels.length === 0) {
      console.log("No models support generateContent!");
      return;
    }
    
    // Pick the first one that looks like a flash/chat model
    const selectedModel = validModels.find(m => m.name.includes('flash')) || validModels[0];
    const modelName = selectedModel.name.replace('models/', '');
    
    console.log("Selected model name:", modelName);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Spune 'Salut'!");
    console.log("Success with", modelName, ":", result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testFirstModel();
