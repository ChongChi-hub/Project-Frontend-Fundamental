function handleRegister() {
    const name = document.querySelector('#regis-name');
    const email = document.querySelector('#regis-email');
    const password = document.querySelector('#regis-password');
    const confirmPassword = document.querySelector('#confirm-password');

    const errorName = document.querySelector('#name-regis-error');
    const errorEmail = document.querySelector('#email-regis-error');
    const errorPassword = document.querySelector('#password-regis-error');
    const errorConfirm = document.querySelector('#error-confirm-password');

    // Reset lỗi
    [errorName, errorEmail, errorPassword, errorConfirm].forEach(e => e.innerText = "");
    [name, email, password, confirmPassword].forEach(input => input.classList.remove("is-invalid"));

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
      errorEmail.innerText = "Email đã được đăng ký";
      email.classList.add("is-invalid");
      return;
    }

    users.push({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim()
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Đăng ký thành công!");
    window.location.href = "login.html";
  }