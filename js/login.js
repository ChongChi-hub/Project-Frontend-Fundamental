let users = JSON.parse(localStorage.getItem("users"));
if (!users || !Array.isArray(users)) {
  users = [
    { id: 1, fullName: "Trọng Trí", email: "admin@gmail.com", password: "123123123" },
    { id: 2, fullName: "Thầy Bốp", email: "bopbop@gmail.com", password: "123123123" },
    { id: 3, fullName: "Trần Bình", email: "tranbinh@gmail.com", password: "123123123" },
  ];
  localStorage.setItem("users", JSON.stringify(users));
}
  
  
  //hàm hiển thị alert boostrap
  function showAlert(message, type = "danger") {
    const alertBox = document.getElementById("login-alert");
    alertBox.innerHTML = `
      <div class="alert alert-${type} fade show" role="alert">
        ${message}
      </div>
    `;
  }
  
  // hàm reset thông báo lỗi và alert
  function resetLoginErrors(emailInput, passwordInput) {
    [emailInput, passwordInput].forEach(i => i.classList.remove("is-invalid")); //xóa class is-invalid ra khỏi input
    document.getElementById("login-alert").innerHTML = "";
  }
  
  function handleLoginSubmit() {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
  
    resetLoginErrors(emailInput, passwordInput);
  
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
  
    let isValid = true;
  
    if (!email) {
      emailInput.classList.add("is-invalid"); //thêm class is-invalid nếu email rỗng hoặc toàn khoảng trắng vì đã .trim ở phía trên
      isValid = false;
    }
  
    if (!password) {
      passwordInput.classList.add("is-invalid"); //thêm class is-invalid nếu password rỗng hoặc toàn khoảng trắng vì đã .trim ở phía trên
      isValid = false;
    }
  
    if (!isValid) {
      showAlert("Vui lòng nhập đầy đủ email và mật khẩu", "danger"); // alert nếu thiếu input
      return; //nếu form ko hợp lệ dừng hàm tại đây
    }
  
    // nếu form hợp lệ thực hiện các bước sau
    const users = JSON.parse(localStorage.getItem("users")) || []; //lấy dữ liệu từ local storage
    const matchedUser = users.find(user => user.email === email && user.password === password); 
    //find tìm phần tử đầu tiên trong mảng users thỏa điều kiện email và password
    //nếu tìm được trả về đối tượng người dùng, nếu không tả về undefined
  
    if (!matchedUser) {
      // Gán lỗi vào email để hiển thị ở input thay vì alert
      emailInput.classList.add("is-invalid");
      passwordInput.classList.add("is-invalid");
      showAlert("Email hoặc mật khẩu không đúng", "danger");
      return; //dừng hàm tại đây ko tiếp tục xử lý đăng nhập
    }
    
    // Thành công → chuyển trang
    showAlert("Đăng nhập thành công!", "success");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUserId", matchedUser.id); //GÁN ID NGƯỜI DÙNG SAU KHI ĐĂNG NHẬP
    
    //set thời gian chuyển sang trang quản lý dự án khi đăng nhập thành công
    setTimeout(() => {
      window.location.href = "../pages/project-manager.html";
    }, 2000);
  }
  //Khi người dùng bắt đầu gõ, xóa viền đỏ và alert
  document.getElementById("login-email").addEventListener("input", () => {
    document.getElementById("login-email").classList.remove("is-invalid");
    document.getElementById("login-alert").innerHTML = "";
  });
  
  document.getElementById("login-password").addEventListener("input", () => {
    document.getElementById("login-password").classList.remove("is-invalid");
    document.getElementById("login-alert").innerHTML = "";
  });
  