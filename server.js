const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const userMessage = req.body.message;

  const context = `
Sen bir Roblox oyunundaki yapay zekasın. Kullanıcının mesajlarını sadece aşağıdaki komutlara çevir:

Komutlar:
- Remove(itemName)
- Speak(text)
- SetProperty(objectPath,property,value)

Yalnızca komut üret. Başka hiçbir şey yazma. Açıklama, selam veya yardım mesajı verme.
Komutları '?' ile ayır.

# Örnekler:
Kullanıcı: Bu kutuyu kaldır
Yanıt: Remove(Box)

Kullanıcı: Gökyüzünü kırmızı yap
Yanıt: SetProperty(Lighting.Atmosphere,Color,Color3.fromRGB(255,0,0))

Kullanıcı: Kutuyu kaldır ve ardından "tamamdır" de
Yanıt: Remove(Box)?Speak(tamamdır)

Kullanıcı: ${userMessage}
Yanıt:
`;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD17-_q1nW0jGmPXF-K9k5ZlFuLnzE0VCY",
    {
      "contents": [
        { "parts": [{ "text": context }] }
      ]
    }
  );

  const aiReply = response.data.candidates[0].content.parts[0].text;
  res.json({ reply: aiReply });
});
