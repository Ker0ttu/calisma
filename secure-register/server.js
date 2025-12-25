const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;
const PUBLIC_PATH = path.join(__dirname, "../public");
const SECRET_KEY = "6Ld66jQsAAAAAFTGeiT1BrI7PMzLcsrr2tcoRvK4";

app.use(bodyParser.json());
app.use(express.static(PUBLIC_PATH));

app.post("/register", async (req, res) => {
    const { username, email, password, captchaToken } = req.body;
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`);
        if (response.data.success) res.json({ success: true });
        else res.status(400).json({ success: false });
    } catch (error) { res.status(500).json({ success: false }); }
});

app.get("*", (req, res) => res.sendFile(path.join(PUBLIC_PATH, "index.html")));
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));