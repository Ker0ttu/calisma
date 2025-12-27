// 1. Şifre Göster/Gizle (Dokunulmadı)
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.add('active');
        } else {
            input.type = 'password';
            this.classList.remove('active');
        }
    });
});

// 2. Kayıt Sayfası Mantığı (Dokunulmadı)
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const uInput = document.getElementById("username"), eInput = document.getElementById("email"),
          eHint = document.getElementById("emailHint"), pInput = document.getElementById("password"),
          cpInput = document.getElementById("confirmPassword"), fError = document.getElementById("formError");

    pInput.addEventListener("input", () => {
        const val = pInput.value;
        const hasUpper = /[A-Z]/.test(val); const hasLower = /[a-z]/.test(val); const hasNumber = /\d/.test(val);
        document.getElementById("lengthReq").classList.toggle("valid-line", val.length >= 8);
        document.getElementById("numberReq").classList.toggle("valid-line", hasNumber);
        document.getElementById("upperReq").classList.toggle("valid-text", hasUpper);
        document.getElementById("lowerReq").classList.toggle("valid-text", hasLower);
        document.getElementById("caseReq").classList.toggle("valid-line", hasUpper && hasLower);
        checkConfirmMatch();
    });

    function checkConfirmMatch() {
        if (cpInput.value.length > 0 && !pInput.value.startsWith(cpInput.value)) cpInput.classList.add("error-border");
        else cpInput.classList.remove("error-border");
    }
    cpInput.addEventListener("input", checkConfirmMatch);

    eInput.addEventListener("input", () => {
        const val = eInput.value;
        if (val.includes("@")) {
            const domain = val.split("@")[1];
            if (domain.length > 0 && !"gmail.com".startsWith(domain)) {
                eInput.classList.add("error-border");
                eHint.textContent = "Lütfen e-postayı '@gmail.com' olarak düzeltin.";
                eHint.style.display = "block";
            } else { eInput.classList.remove("error-border"); eHint.style.display = "none"; }
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        fError.style.display = "none";
        const captchaToken = grecaptcha.getResponse();

        if (!uInput.value.trim() || !eInput.value.trim() || !pInput.value.trim() || !cpInput.value.trim()) {
            fError.textContent = "Lütfen tüm alanları doldurun!"; fError.style.display = "block"; return;
        }
        if (!captchaToken) { fError.textContent = "reCAPTCHA doğrulayın!"; fError.style.display = "block"; return; }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: uInput.value, email: eInput.value, password: pInput.value, captchaToken: captchaToken })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("pendingEmail", eInput.value); 
                window.location.href = "verify.html";
            } else { fError.textContent = data.message; fError.style.display = "block"; }
        } catch (err) { fError.textContent = "Bağlantı hatası!"; fError.style.display = "block"; }
    });
}

// 3. Giriş Sayfası Mantığı (Yeni Eklendi)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = document.getElementById("loginUser").value;
        const pass = document.getElementById("loginPass").value;
        const lError = document.getElementById("loginError");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginUser: user, loginPass: pass })
            });
            const data = await res.json();
            if (data.success) { 
                window.location.href = "dashboard.html"; 
            } else { 
                lError.textContent = data.message; 
                lError.style.display = "block"; 
            }
        } catch (err) { 
            lError.textContent = "Giriş başarısız!"; 
            lError.style.display = "block"; 
        }
    });
}

// 4. Doğrulama Sayfası Mantığı (Yeni Eklendi)
const verifyForm = document.getElementById("verifyForm");
if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const code = document.getElementById("verifyCode").value;
        const vError = document.getElementById("verifyError");
        
        // Kayıt sırasında kaydedilen e-postayı al
        const email = localStorage.getItem("pendingEmail");

        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, code: code })
            });
            const data = await res.json();
            if (data.success) {
                alert("Hesabınız başarıyla doğrulandı!");
                window.location.href = "login.html";
            } else {
                vError.textContent = data.message;
                vError.style.display = "block";
            }
        } catch (err) {
            vError.textContent = "Bağlantı hatası!";
            vError.style.display = "block";
        }
    });
}