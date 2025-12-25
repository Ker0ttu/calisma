const passwordInput = document.getElementById("password");
const upperReq = document.getElementById("upperReq");
const lowerReq = document.getElementById("lowerReq");
const passwordRequirementDiv = document.querySelector(".password-requirements");

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  // Önce tüm işaretleri kaldır
  upperReq.classList.remove("valid");
  lowerReq.classList.remove("valid");
  passwordRequirementDiv.classList.remove("all-valid");

  // Büyük harf varsa "1 büyük" yeşil
  if (hasUpper) {
    upperReq.classList.add("valid");
  }

  // Küçük harf varsa "1 küçük" yeşil
  if (hasLower) {
    lowerReq.classList.add("valid");
  }

  // Eğer ikisi birden varsa tüm cümle yeşil
  if (hasUpper && hasLower) {
    passwordRequirementDiv.classList.add("all-valid");
  }
});
