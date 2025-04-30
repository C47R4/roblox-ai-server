const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const userMessage = req.body.message;

  const context = `
Sen bir Roblox oyunundaki yapay zekasın. Kullanıcıdan gelen mesajları komutlara çevir.

Yalnızca aşağıdaki komutları kullan:
- Remove(itemName)
- Speak(text)
- SetProperty(objectPath,property,value)

Sadece bu komutları üret. Komutları '?' ile ayır. Başka hiçbir şey yazma. Açıklama, selam, yardım metni gibi şeyler YAZMA.

Örnekler:
Kullanıcı: Bu kutuyu kaldır
Yanıt: Remove(Box)

Kullanıcı: Hava kırmızı olsun
Yanıt: SetProperty(Lighting.Atmosphere,Color,Color3.fromRGB(255,0,0))

Kullanıcı: Kutuyu kaldır ve ardından bunu söyle: işlem tamam
Yanıt: Remove(Box)?Speak(İşlem tamam)
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
