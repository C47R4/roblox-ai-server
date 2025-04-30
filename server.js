const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const userMessage = req.body.message;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD17-_q1nW0jGmPXF-K9k5ZlFuLnzE0VCY",
    {
      "contents": [
        { "parts": [{ "text": userMessage }] }
      ]
    }
  );

  const aiReply = response.data.candidates[0].content.parts[0].text;
  res.json({ reply: aiReply });
});

app.listen(port, () => {
   console.log(`AI sunucusu çalışıyor! Port: ${port}`);
 });
