const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const formError = document.getElementById("formError");

const upperReq = document.getElementById("upperReq");
const lowerReq = document.getElementById("lowerReq");
const numberReq = document.getElementById("numberReq");

const validDomains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"];

// Anlık e-posta domain kontrolü
emailInput.addEventListener("input", () => {
  const email = emailInput.value.trim();
  const atIndex = email.indexOf("@");

  if (atIndex === -1) {
    emailInput.style.borderColor = "";
    return;
  }

  const domain = email.substring(atIndex + 1).toLowerCase();

  if (domain.length === 0) {
    emailInput.style.borderColor = "";
    return;
  }

  if (!validDomains.some(d => domain.startsWith(d))) {
    emailInput.style.borderColor = "red";
  } else {
    emailInput.style.borderColor = "";
  }
});

// Şifre gereksinimlerini güncelleme
function updatePasswordReq(password) {
  if (password.length >= 8) {
    passwordInput.style.borderColor = "";
  }

  if (/[A-Z]/.test(password)) {
    upperReq.style.color = "#63d66d"; // yeşil
  } else {
    upperReq.style.color = "#888aad"; // normal
  }

  if (/[a-z]/.test(password)) {
    lowerReq.style.color = "#63d66d";
  } else {
    lowerReq.style.color = "#888aad";
  }

  if (/\d/.test(password)) {
    numberReq.style.color = "#63d66d";
  } else {
    numberReq.style.color = "#888aad";
  }
}

passwordInput.addEventListener("input", () => {
  updatePasswordReq(passwordInput.value);
});

// Form doğrulama
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

function validateUsername(username) {
  return /^[a-zA-Z0-9]{4,}$/.test(username);
}

function validatePassword(password) {
  const lengthValid = password.length >= 8;
  const numberValid = /\d/.test(password);
  const upperValid = /[A-Z]/.test(password);
  const lowerValid = /[a-z]/.test(password);
  return lengthValid && numberValid && upperValid && lowerValid;
}

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let hasError = false;

  // Tüm borderları sıfırla
  emailInput.style.borderColor = "";
  usernameInput.style.borderColor = "";
  passwordInput.style.borderColor = "";
  confirmPasswordInput.style.borderColor = "";
  formError.style.display = "none";
  formError.textContent = "";

  // Kontroller
  if (!validateEmail(emailInput.value.trim())) {
    emailInput.style.borderColor = "red";
    hasError = true;
  }

  if (!validateUsername(usernameInput.value.trim())) {
    usernameInput.style.borderColor = "red";
    hasError = true;
  }

  if (!validatePassword(passwordInput.value)) {
    passwordInput.style.borderColor = "red";
    hasError = true;
  }

  if (passwordInput.value !== confirmPasswordInput.value || confirmPasswordInput.value === "") {
    confirmPasswordInput.style.borderColor = "red";
    hasError = true;
  }

  if (hasError) {
    formError.textContent = "Lütfen gerekli alanları doldurunuz!";
    formError.style.display = "block";
    return;
  }

  // reCAPTCHA kontrolü
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    formError.textContent = "Lütfen 'Ben robot değilim' doğrulamasını yapınız!";
    formError.style.display = "block";
    return;
  }

  formError.style.display = "none";

  alert("Kayıt başarılı!");
  this.reset();
  updatePasswordReq("");
  grecaptcha.reset();
});
