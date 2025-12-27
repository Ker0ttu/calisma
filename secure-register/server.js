const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;
const PUBLIC_PATH = path.join(__dirname, "../public");
const DB_FILE = path.join(__dirname, "database.json");
const SECRET_KEY = "6Ld66jQsAAAAAFTGeiT1BrI7PMzLcsrr2tcoRvK4";

let pendingUsers = {};

// --- E-POSTA AYARLARI (GMAIL) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'kayit.icin.dogrulama@gmail.com', // Buraya kendi mailini yaz
        pass: 'nkzy pecs xjjr tnwr'        // Buraya 16 haneli uygulama şifresini yaz
    }
});

app.use(bodyParser.json());
app.use(express.static(PUBLIC_PATH));

if (!fs.existsSync(DB_FILE)) { fs.writeFileSync(DB_FILE, JSON.stringify([])); }

// KAYIT OLMA (E-posta gönderimi dahil)
app.post("/api/register", async (req, res) => {
    const { username, email, password, captchaToken } = req.body;
    try {
        const googleRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`);
        if (!googleRes.data.success) return res.status(400).json({ success: false, message: "reCAPTCHA başarısız!" });

        const users = JSON.parse(fs.readFileSync(DB_FILE));
        if (users.find(u => u.username === username || u.email === email)) {
            return res.status(400).json({ success: false, message: "Bu kullanıcı zaten mevcut!" });
        }

        const vCode = Math.floor(100000 + Math.random() * 900000).toString();
        pendingUsers[email] = { username, password, code: vCode };

        // E-posta Tasarımı (Tasarımına uygun renkler)
        const mailOptions = {
            from: '"Premium Panel" <GMAIL_ADRESIN@gmail.com>',
            to: email,
            subject: 'Doğrulama Kodunuz',
            html: `
                <div style="background-color: #0f0f1a; color: white; padding: 40px; font-family: 'Poppins', sans-serif; text-align: center; border-radius: 15px;">
                    <h2 style="color: #7289da; text-shadow: 0 0 10px rgba(114, 137, 218, 0.5);">Kayıt İçin Son Adım</h2>
                    <p style="color: #8a8ca0;">Merhaba <b>${username}</b>, hesabını doğrulamak için aşağıdaki kodu kullanabilirsin:</p>
                    <div style="background: #1a1a2e; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #fff; border: 1px solid #7289da; margin: 20px 0; display: inline-block;">
                        ${vCode}
                    </div>
                    <p style="font-size: 12px; color: #5865f2;">Eğer bu işlemi siz yapmadıysanız lütfen dikkate almayınız.</p>
                </div>
            `
        };

        // Mail göndermeyi dene
        await transporter.sendMail(mailOptions);
        console.log(`Kod gönderildi (${email}): ${vCode}`);
        res.json({ success: true });

    } catch (error) {
        console.error("Hata Detayı:", error);
        res.status(500).json({ success: false, message: "E-posta servisi şu an meşgul, lütfen tekrar deneyin!" });
    }
});

// DOĞRULAMA VE GİRİŞ (Değişmedi...)
app.post("/api/verify", (req, res) => {
    const { email, code } = req.body;
    const userData = pendingUsers[email];
    if (userData && userData.code === code) {
        const users = JSON.parse(fs.readFileSync(DB_FILE));
        users.push({ username: userData.username, email: email, password: userData.password });
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
        delete pendingUsers[email];
        res.json({ success: true });
    } else { res.status(400).json({ success: false, message: "Hatalı kod!" }); }
});

app.post("/api/login", (req, res) => {
    const { loginUser, loginPass } = req.body;
    const users = JSON.parse(fs.readFileSync(DB_FILE));
    const user = users.find(u => (u.username === loginUser || u.email === loginUser) && u.password === loginPass);
    if (user) res.json({ success: true, username: user.username });
    else res.status(401).json({ success: false, message: "Hatalı giriş!" });
});

app.listen(PORT, () => console.log(`Sunucu aktif: http://localhost:${PORT}`));