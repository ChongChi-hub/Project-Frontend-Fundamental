function handleRegister() {
  const name = document.querySelector('#regis-name');
  const email = document.querySelector('#regis-email');
  const password = document.querySelector('#regis-password');
  const confirmPassword = document.querySelector('#confirm-password');
  const registerAlert = document.querySelector('#register-alert');

  const errorName = document.querySelector('#name-regis-error');
  const errorEmail = document.querySelector('#email-regis-error');
  const errorPassword = document.querySelector('#password-regis-error');
  const errorConfirm = document.querySelector('#error-confirm-password');

  // Reset alert
  registerAlert.innerHTML = "";

  // Không reset lỗi khi vừa load, sẽ reset khi người dùng gõ

  let isValid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.value.trim()) {
      errorName.innerText = "Vui lòng nhập họ và tên";
      name.classList.add("is-invalid");
      isValid = false;
  }

  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      errorEmail.innerText = "Email không hợp lệ";
      email.classList.add("is-invalid");
      isValid = false;
  }

  if (password.value.trim().length < 8) {
      errorPassword.innerText = "Mật khẩu phải từ 8 ký tự";
      password.classList.add("is-invalid");
      isValid = false;
  }

  if (confirmPassword.value.trim() !== password.value.trim()) {
      errorConfirm.innerText = "Mật khẩu xác nhận không khớp";
      confirmPassword.classList.add("is-invalid");
      isValid = false;
  }

  if (!isValid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.email === email.value.trim())) {
      registerAlert.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Email đã được đăng ký!
        </div>
      `;
      return;
  }

  // Lưu người dùng mới
  users.push({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim()
  });
  localStorage.setItem("users", JSON.stringify(users));

  // Báo đăng ký thành công bằng Alert Bootstrap
  registerAlert.innerHTML = `
    <div id="success-alert" class="alert alert-success" role="alert">
      Đăng ký thành công!
    </div>
  `;

  // Fade out Alert sau 2.5s
  setTimeout(() => {
      const successAlert = document.getElementById("success-alert");
      if (successAlert) {
          successAlert.style.transition = "opacity 0.5s ease";
          successAlert.style.opacity = "0";
      }
  }, 2500);

  // Sau 1s thì chuyển trang
  setTimeout(() => {
      window.location.href = "login.html";
  }, 1000);
}


const inputConfigs = [
  { id: "regis-name", errorId: "name-regis-error" },
  { id: "regis-email", errorId: "email-regis-error" },
  { id: "regis-password", errorId: "password-regis-error" },
  { id: "confirm-password", errorId: "error-confirm-password" }
];

inputConfigs.forEach(config => {
  const input = document.getElementById(config.id);
  const error = document.getElementById(config.errorId);

  input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
      error.innerText = "";
      document.getElementById("register-alert").innerHTML = "";
  });
});
