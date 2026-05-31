const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  try {
    const { apiKey, message, history } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API Key is required.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are an HTML game developer assistant. Your task is to help the user create HTML/JS games. Always provide full, runnable HTML code in a single markdown block (```html ... ```) when giving game code. The code should include CSS and JS in the same file. Be concise and focus on writing clean, working game code."
    });

    // Format history for Gemini API
    const formattedHistory = history.map(item => ({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini API. Please check your API key and try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
