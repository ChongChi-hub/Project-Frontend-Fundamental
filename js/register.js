function handleRegister() {
    const name = document.querySelector('#regis-name');
    const email = document.querySelector('#regis-email');
    const password = document.querySelector('#regis-password');
    const confirmPassword = document.querySelector('#confirm-password-regis-error');

    const errorName = document.querySelector('#name-regis-error');
    const errorEmail = document.querySelector('#email-regis-error');
    const errorPassword = document.querySelector('#password-regis-error');
    const errorConfirm = document.querySelector('#error-confirm-password');

    // Reset lỗi
    [errorName, errorEmail, errorPassword, errorConfirm].forEach(e => e.innerHTML = "");
    [name, email, password, confirmPassword].forEach(input => input.classList.remove("is-invalid"));

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra họ tên
    if (!name.value.trim()) {
        errorName.innerHTML = "Vui lòng nhập họ và tên";
        name.classList.add("is-invalid");
        isValid = false;
    }

    // Kiểm tra email
    if (!email.value.trim()) {
        errorEmail.innerHTML = "Vui lòng nhập email";
        email.classList.add("is-invalid");
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        errorEmail.innerHTML = "Email không hợp lệ";
        email.classList.add("is-invalid");
        isValid = false;
    }

    // Kiểm tra mật khẩu
    if (!password.value.trim()) {
        errorPassword.innerHTML = "Vui lòng nhập mật khẩu";
        password.classList.add("is-invalid");
        isValid = false;
    } else if (password.value.trim().length < 8) {
        errorPassword.innerHTML = "Mật khẩu phải từ 8 ký tự trở lên";
        password.classList.add("is-invalid");
        isValid = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (!confirmPassword.value.trim()) {
        errorConfirm.innerHTML = "Vui lòng xác nhận mật khẩu";
        confirmPassword.classList.add("is-invalid");
        isValid = false;
    } else if (confirmPassword.value.trim() !== password.value.trim()) {
        errorConfirm.innerHTML = "Mật khẩu xác nhận không khớp";
        confirmPassword.classList.add("is-invalid");
        isValid = false;
    }

    // Nếu dữ liệu hợp lệ, thực hiện lưu tài khoản mới
    if (isValid) {
        const newUser = {
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
            role: "CLIENT"
        };

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const isEmailExists = users.some(user => user.email === newUser.email);
        if (isEmailExists) {
            errorEmail.innerHTML = "Email đã được đăng ký";
            email.classList.add("is-invalid");
            return;
        }

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Đăng ký thành công!");
        window.location.href = "../pages/login.html";  // Chuyển hướng đến trang đăng nhập
    }
}
