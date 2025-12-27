const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "database.json");
const SECRET_KEY = "6Ld66jQsAAAAAFTGeiT1BrI7PMzLcsrr2tcoRvK4";

let pendingUsers = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'kayit.icin.dogrulama@gmail.com', pass: 'nkzy pecs xjjr tnwr' }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

app.post("/api/register", async (req, res) => {
    const { username, email, password, captchaToken } = req.body;
    try {
        const gRes = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`);
        if (!gRes.data.success) return res.status(400).json({ success: false, message: "reCAPTCHA geçersiz!" });

        const users = JSON.parse(fs.readFileSync(DB_FILE));
        if (users.find(u => u.username === username || u.email === email)) {
            return res.status(400).json({ success: false, message: "Kullanıcı zaten var!" });
        }

        const vCode = Math.floor(100000 + Math.random() * 900000).toString();
        pendingUsers[email] = { username, password, code: vCode };

        await transporter.sendMail({
            from: '"Premium Panel" <kayit.icin.dogrulama@gmail.com>',
            to: email,
            subject: 'Doğrulama Kodunuz',
            html: `<div style="background:#0d0e22; color:white; padding:30px; border-radius:10px; text-align:center;">
                   <h2>Kodunuz: ${vCode}</h2></div>`
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, message: "Sistem hatası!" }); }
});

app.post("/api/login", (req, res) => {
    const { loginUser, loginPass } = req.body;
    const users = JSON.parse(fs.readFileSync(DB_FILE));
    const user = users.find(u => (u.username === loginUser || u.email === loginUser) && u.password === loginPass);
    if (user) res.json({ success: true, username: user.username });
    else res.status(401).json({ success: false, message: "Giriş başarısız!" });
});

app.post("/api/verify", (req, res) => {
    const { email, code } = req.body;
    if (pendingUsers[email] && pendingUsers[email].code === code) {
        const users = JSON.parse(fs.readFileSync(DB_FILE));
        users.push({ ...pendingUsers[email], email });
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
        delete pendingUsers[email];
        res.json({ success: true });
    } else res.status(400).json({ success: false, message: "Kod hatalı!" });
});

app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor.`));