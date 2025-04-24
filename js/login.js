function handleLoginSubmit() {
    const emailInput = document.querySelector("#login-email");
    const passwordInput = document.querySelector("#login-password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const errorEmail = document.querySelector("#email-login-error");
    const errorPassword = document.querySelector("#password-login-error");

    [errorEmail, errorPassword].forEach(e => e.innerText = "");
    [emailInput, passwordInput].forEach(i => i.classList.remove("is-invalid"));

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
      alert("Email hoặc mật khẩu không đúng!");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "product-manager.html";
  }