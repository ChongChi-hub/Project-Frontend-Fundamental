function handleLoginSubmit() {
    const email = document.querySelector("#login-email");
    const password = document.querySelector("#login-password");

    const errorEmail = document.getElementById("email-login-error");
    const errorPassword = document.getElementById("password-login-error");

    // Reset lỗi
    [email, password].forEach(input => input.classList.remove("is-invalid"));
    [errorEmail, errorPassword].forEach(error => error.innerText = "");

    let isValidInput = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.value.trim()) {
        email.classList.add("is-invalid");
        errorEmail.innerText = "Email không được để trống";
        isValidInput = false;
    } else if (!emailRegex.test(email.value.trim())) {
        email.classList.add("is-invalid");
        errorEmail.innerText = "Email không hợp lệ";
        isValidInput = false;
    }

    if (!password.value.trim()) {
        password.classList.add("is-invalid");
        errorPassword.innerText = "Mật khẩu không được để trống";
        isValidInput = false;
    }

    if (isValidInput) {

        const validUser = users.find(user =>
            user.email === email.value.trim() && user.password === password.value.trim()
        );
        
        if (validUser) {
            if (validUser.role === "ADMIN") {
                location.href = "/pages/product-manager.html"
            } else {
                location.href = "/pages/product-manager.html"
            }
        } else {
            alert("Email hoặc mật khẩu không đúng!");
        }
    }
}
