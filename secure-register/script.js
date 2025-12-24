const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const recaptchaToken = grecaptcha.getResponse();

  if (password !== passwordConfirm) {
    alert("Şifreler eşleşmiyor!");
    return;
  }

  if (!recaptchaToken) {
    alert("Lütfen reCAPTCHA doğrulamasını tamamlayın!");
    return;
  }

  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, recaptchaToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
  } else {
    alert(data.message);
    form.reset();
    grecaptcha.reset();
  }
});
