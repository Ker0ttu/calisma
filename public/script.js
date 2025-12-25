// 1. Şifre Göster/Gizle (Kayıt ve Giriş Sayfaları İçin)
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.type = input.type === 'password' ? 'text' : 'password';
        this.classList.toggle('active');
    });
});

// 2. Kayıt Sayfası Kontrolleri (signup.html)
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const uInput = document.getElementById("username"), eInput = document.getElementById("email");
    const pInput = document.getElementById("password"), cpInput = document.getElementById("confirmPassword");
    const fError = document.getElementById("formError"), cWrap = document.getElementById("captchaWrapper");

    // Şifre kuralları anlık takip
    pInput.addEventListener("input", () => {
        const val = pInput.value;
        document.getElementById("lengthReq").classList.toggle("valid-line", val.length >= 8);
        document.getElementById("numberReq").classList.toggle("valid-line", /\d/.test(val));
        document.getElementById("caseReq").classList.toggle("valid-line", /[A-Z]/.test(val) && /[a-z]/.test(val));
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        fError.style.display = "none";

        // Gmail Kontrolü
        if (!eInput.value.toLowerCase().endsWith("@gmail.com")) {
            fError.textContent = "Sadece @gmail.com adresleri kabul edilmektedir!";
            fError.style.display = "block";
            return;
        }

        // Şifre Eşleşme Kontrolü
        if (pInput.value !== cpInput.value) {
            fError.textContent = "Şifreler uyuşmuyor!";
            fError.style.display = "block";
            return;
        }

        // Robot Kontrolü
        if (!grecaptcha.getResponse()) {
            fError.textContent = "Lütfen robot olduğunuzu doğrulayın!";
            fError.style.display = "block";
            return;
        }

        // BAŞARILI: Kod sayfasına yönlendir
        window.location.href = "verify.html";
    });
}

// 3. E-posta Doğrulama Sayfası Kontrolleri (verify.html)
const verifyForm = document.getElementById("verifyForm");
if (verifyForm) {
    verifyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("verifyCode").value;
        const err = document.getElementById("verifyError");

        // Simülasyon Kodu: 123456
        if (code === "123456") {
            alert("Doğrulama başarılı!");
            window.location.href = "login.html";
        } else {
            err.textContent = "Hatalı kod girdiniz!";
            err.style.display = "block";
        }
    });
}