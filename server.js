const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.use(express.json());

const memoryMap = new Map();
const MAX_MEMORY_LENGTH = 20; // Örnek değer

app.post("/api/ai", async (req, res) => {
  const { userId, userData, message, systemMessage } = req.body;

  if (!memoryMap.has(userId)) memoryMap.set(userId, []);

  let memory = memoryMap.get(userId);

  // Sistem mesajını ve kullanıcı mesajını birleştir (sadece ilk mesaj için)
  let combinedMessage = "PlayerData:" + userData + "\n\n" + message;
  if (systemMessage && memory.length === 0) {
    combinedMessage = systemMessage + "\n PlayerData:" + userData + "\n\n" + message;
  }

  memory.push({ role: "user", parts: [{ text: combinedMessage }] });

  // Belleği kırp (token limitlerini aşmamak için)
  if (memory.length > MAX_MEMORY_LENGTH) {
    memory = memory.splice(1, 1);
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD17-_q1nW0jGmPXF-K9k5ZlFuLnzE0VCY",
      {
        "contents": memory
      }
    );

    const aiReply = response.data.candidates[0].content.parts[0].text;

    memory.push({ role: "model", parts: [{ text: aiReply }] });

    await memoryMap.set(userId, memory); // Gelecekteki asenkron işlemler için

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("API Hatası:", error);
    res.status(500).json({ error: "AI servisiyle iletişimde bir sorun oluştu." });
  }
});

app.listen(port, () => {
  console.log(`AI sunucusu çalışıyor! Port: ${port}`);
});
