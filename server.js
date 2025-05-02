const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.use(express.json());

const memoryMap = new Map();
const MAX_MEMORY_LENGTH = 60; // Örnek değer

app.post("/api/ai", async (req, res) => {
  const { serverId, userData, message, systemMessage, report } = req.body;

  if (!memoryMap.has(serverId)) memoryMap.set(serverId, []);

  let memory = memoryMap.get(serverId);

  // Sistem mesajını ve kullanıcı mesajını birleştir (sadece ilk mesaj için)
  let combinedMessage = ""
  if (memory.length === 0){
    if (report) {
      combinedMessage = systemMessage + "\n" + message + "\n" + report;
    } else {
      combinedMessage = systemMessage + "\n Data:" + userData + "\n\n" + message;
    }
  } else {
    if (report) {
      combinedMessage = message + "\n" + report;
    } else {
      combinedMessage = "Data:" + userData + "\n\n" + message;
    }
  }

  memory.push({ role: "user", parts: [{ text: combinedMessage }] });

  // Belleği kırp (token limitlerini aşmamak için)
  if (memory.length > MAX_MEMORY_LENGTH) {
    memory.splice(1, 1);
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=AIzaSyCH_Dbzr141pnqdZQPLm9E7ZghuSyA5LOw",
      {
        "contents": memory
      }
    );

    const aiReply = response.data.candidates[0].content.parts[0].text;

    memory.push({ role: "model", parts: [{ text: aiReply }] });

    await memoryMap.set(serverId, memory); // Gelecekteki asenkron işlemler için

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("API Hatası:", error);
    res.status(500).json({ error: "AI servisiyle iletişimde bir sorun oluştu." });
  }
});

app.listen(port, () => {
  console.log(`AI sunucusu çalışıyor! Port: ${port}`);
});
