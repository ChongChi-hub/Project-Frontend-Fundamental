//hàm hiển thị alert boostrap
function showAlert(message, type = "danger") {
  const alertBox = document.getElementById("register-alert");
  alertBox.innerHTML = `
    <div class="alert alert-${type} fade show" role="alert">
      ${message}
    </div>
  `;
}

//hàm reset thông báo lỗi và alert
function resetRegisterErrors(inputs) {
  inputs.forEach(i => i.classList.remove("is-invalid"));
  document.getElementById("register-alert").innerHTML = "";
}

function handleRegisterSubmit() {
  const fullnameInput = document.getElementById("register-fullname");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmInput = document.getElementById("register-confirm-password");

  resetRegisterErrors([fullnameInput, emailInput, passwordInput, confirmInput]);

  const fullname = fullnameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmInput.value.trim();

  let isValid = true;

  if (!fullname) {
      fullnameInput.classList.add("is-invalid"); //nếu rỗng thông báo lỗi
      isValid = false;
    }
    if (!email) {
      emailInput.classList.add("is-invalid"); //nếu rỗng thông báo lỗi
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      emailInput.classList.add("is-invalid");
      showAlert("Email không hợp lệ. Vui lòng nhập đúng định dạng!", "danger");
      return;
    }
    if (!password) {
      passwordInput.classList.add("is-invalid"); //nếu rỗng thông báo lỗi
      isValid = false;
    } else if (password.length < 8) {
      passwordInput.classList.add("is-invalid"); //nếu mật khẩu không đủ độ dài tối thiểu hoặc rỗng thông báo lỗi và alert
      showAlert("Mật khẩu phải có ít nhất 8 ký tự!", "danger");
      return;
    } //kiểm tra mật khẩu trùng khớp
    if (!confirmPassword || confirmPassword !== password) {
      confirmInput.classList.add("is-invalid");
      showAlert("Mật khẩu xác nhận chưa trùng khớp!", "danger");
      return;
    }
    
    if (!isValid) {
      showAlert("Vui lòng điền đầy đủ thông tin hợp lệ!", "danger"); //nếu rỗng 1 trong 4 ô input alert lỗi
      return;
    }
  
    //lấy dữ liệu users từ local storage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = users.some(user => user.email === email); //Kiểm tra xem có email trong mảng đã tồn tại hay chưa, nếu không có trả về false.
  if (emailExists) { //nếu email đã tồn tại
    emailInput.classList.add("is-invalid"); //hiển thị thông báo lỗi
    showAlert("Email đã tồn tại. Vui lòng chọn email khác!", "danger");
    return;
  }

  const newUser = {
    id: Date.now(),
    fullname,
    email,
    password,
  };
//thêm newUser và users
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  showAlert("Đăng ký thành công!", "success");

  //set thời gian khi đăng kí thành công trở về trang login
  setTimeout(() => {
    window.location.href = "../pages/login.html";
  }, 2000);
}

// Xoá lỗi khi người dùng gõ lại
["register-fullname", "register-email", "register-password", "register-confirm-password"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    document.getElementById(id).classList.remove("is-invalid");
    document.getElementById("register-alert").innerHTML = "";
  });
});
