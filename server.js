const express = require("express");
 const app = express();
 const port = 3000;
 const axios = require("axios");
 
 app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const userMessage = req.body.message;

  const context = `
Sen bir Roblox oyununu yöneten yapay zekasın.
Komutlar dışında hiçbir şey yazma.
Komut formatları:
- Remove(itemName)
- Speak(text)
- SetProperty(objectPath,property,value)
Komutları '?' ile ayır.
Mesela: SetProperty(Lighting,ClockTime,18)?Speak(Hava karardı!)
`;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD17-_q1nW0jGmPXF-K9k5ZlFuLnzE0VCY",
    {
      "contents": [
        { "parts": [{ "text": context }] },
        { "parts": [{ "text": userMessage }] }
      ]
    }
  );

  const aiReply = response.data.candidates[0].content.parts[0].text;
  res.json({ reply: aiReply });
});
