const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET_KEY = "6Ld66jQsAAAAAFTGeiT1BrI7PMzLcsrr2tcoRvK4"; // Google reCAPTCHA secret key

app.post("/register", async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    const googleRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      { params: { secret: SECRET_KEY, response: recaptchaToken } }
    );

    if (!googleRes.data.success) {
      return res.status(400).json({ error: "Captcha doğrulaması başarısız!" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Captcha servisi hatası" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Geçersiz e-posta adresi!" });
  }

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!passwordValid) {
    return res.status(400).json({ error: "Şifre kurallara uymuyor!" });
  }

  res.json({ success: true, message: "Kayıt başarılı!" });
});

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});
