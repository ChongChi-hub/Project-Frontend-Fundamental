function handleLoginSubmit() {
  const emailInput = document.querySelector("#login-email");
  const passwordInput = document.querySelector("#login-password");
  const loginAlert = document.querySelector("#login-alert");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const errorEmail = document.querySelector("#email-login-error");
  const errorPassword = document.querySelector("#password-login-error");

  // Reset lỗi
  [errorEmail, errorPassword].forEach(e => e.innerText = "");
  [emailInput, passwordInput].forEach(i => i.classList.remove("is-invalid"));
  loginAlert.innerHTML = "";

  let isValid = true;

  if (!email) {
      errorEmail.innerText = "Vui lòng nhập email";
      emailInput.classList.add("is-invalid");
      isValid = false;
  }

  if (!password) {
      errorPassword.innerText = "Vui lòng nhập mật khẩu";
      passwordInput.classList.add("is-invalid");
      isValid = false;
  }

  if (!isValid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(u => u.email === email && u.password === password);

  if (!matchedUser) {
      // Dùng alert Bootstrap cho lỗi sai
      loginAlert.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Email hoặc mật khẩu không đúng!
        </div>
      `;
      return;
  }

  // Nếu đăng nhập thành công
  localStorage.setItem("isLoggedIn", "true");

  // Hiện alert thành công
  loginAlert.innerHTML = `
    <div id="success-alert" class="alert alert-success" role="alert">
      Đăng nhập thành công!<span id="dot">.</span>
    </div>
  `;

  // Loading dấu chấm ...
  let dot = document.getElementById("dot");
  let count = 0;
  const dotInterval = setInterval(() => {
      count = (count + 1) % 4;
      dot.innerText = '.'.repeat(count || 1);
  }, 500);

  // Fade out alert sau 2.5s
  setTimeout(() => {
      const successAlert = document.getElementById("success-alert");
      if (successAlert) {
          successAlert.style.transition = "opacity 0.5s ease";
          successAlert.style.opacity = "0";
      }
  }, 2500);

  // Chuyển trang sau 1s
  setTimeout(() => {
      clearInterval(dotInterval); 
      window.location.href = "product-manager.html";
  }, 1000);
}

// ====== THÊM PHẦN NÀY ======
const passwordInput = document.getElementById("login-password");
passwordInput.addEventListener("input", () => {
  const loginAlert = document.getElementById("login-alert");
  loginAlert.innerHTML = ""; // Xóa alert ngay khi gõ lại mật khẩu
});
