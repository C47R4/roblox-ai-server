const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.use(express.json());

const memoryMap = new Map();

app.post("/api/ai", async (req, res) => {
  const { userId, message, systemMessage } = req.body;

  if (!memoryMap.has(userId)) memoryMap.set(userId, []);

  const memory = memoryMap.get(userId);

  if (systemMessage && !memory.some(msg => msg.role === "system")) {
    memory.unshift({ role: "system", parts: [{ text: systemMessage }] });
  }

  memory.push({ role: "user", parts: [{ text: message }] });
  
  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD17-_q1nW0jGmPXF-K9k5ZlFuLnzE0VCY",
    {
      "contents": memory
    }
  );

  const aiReply = response.data.candidates[0].content.parts[0].text;

  memory.push({ role: "model", parts: [{ text: aiReply }] });
  
  res.json({ reply: aiReply });
});

app.listen(port, () => {
   console.log(`AI sunucusu çalışıyor! Port: ${port}`);
 });
