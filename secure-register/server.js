const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Google reCAPTCHA secret key buraya yazılacak
const SECRET_KEY = "6Ld66jQsAAAAAFTGeiT1BrI7PMzLcsrr2tcoRvK4";

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { email, password, "g-recaptcha-response": token } = req.body;

  if (!token) {
    return res.status(400).send("Lütfen reCAPTCHA doğrulamasını yapın.");
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
    );

    if (!response.data.success) {
      return res.status(400).send("reCAPTCHA doğrulaması başarısız.");
    }

    // Burada kullanıcı kaydı yapılabilir (şimdilik başarı mesajı gönderiyoruz)
    res.send("Kayıt başarılı! Hoşgeldiniz.");
  } catch (error) {
    console.error("reCAPTCHA doğrulama hatası:", error);
    res.status(500).send("Sunucu hatası.");
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
