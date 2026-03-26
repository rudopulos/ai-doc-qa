require('dotenv').config();
const axios = require('axios');

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await axios.get(url);
    console.log("Models:", response.data.models.map(m => m.name));
  } catch (err) {
    console.error("Error listing models:", err.response?.data || err.message);
  }
}

listModels();
