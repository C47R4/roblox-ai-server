const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

const MEMORY_LIMIT = 20;
const memoryMap = new Map(); // userId -> memory listesi

app.post("/api/ai", async (req, res) => {
  const { userId, message, systemMessage } = req.body;

  if (!userId || !message) return res.status(400).json({ error: "userId ve message zorunlu!" });

  if (!memoryMap.has(userId)) memoryMap.set(userId, []);

  const memory = memoryMap.get(userId);

  // Eğer sistem mesajı varsa en başa koy (sadece 1 kere)
  if (systemMessage && !memory.some(msg => msg.role === "system")) {
    memory.unshift({ role: "system", parts: [{ text: systemMessage }] });
  }

  memory.push({ role: "user", parts: [{ text: message }] });

  while (memory.length > MEMORY_LIMIT) memory.splice(1, 1); // sistem mesajını koru

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD17-_q1nW0jGmPXF-K9k5ZlFuLnzE0VCY",
      { contents: memory }
    );

    const aiReply = response.data.candidates[0].content.parts[0].text;

    memory.push({ role: "model", parts: [{ text: aiReply }] });

    while (memory.length > MEMORY_LIMIT) memory.splice(1, 1); // sistem mesajı yine kalsın

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("AI Hatası:", err.response?.data || err.message);
    res.status(500).json({ error: "AI cevap veremedi." });
  }
});

// Belirli kullanıcıya ait geçici hafızayı temizle
app.post("/api/clearMemory", (req, res) => {
  const { userId } = req.body;
  if (userId && memoryMap.has(userId)) {
    memoryMap.set(userId, []);
    res.json({ message: `Kullanıcı ${userId} için hafıza temizlendi.` });
  } else {
    res.status(400).json({ error: "Geçerli userId verin." });
  }
});

app.listen(port, () => {
  console.log(`🎭 Çok kullanıcılı AI sunucusu aktif! Port: ${port}`);
});
