// Kiểm tra đăng nhập nếu ở trạng thái chưa đăng nhập thì duy chuyển về trang đăng nhập
if (localStorage.getItem("isLoggedIn") !== "true") {
  location.href = "../pages/login.html";
}

//----------Khởi tạo dữ liệu mẫu nếu chưa có----------//
let projects = JSON.parse(localStorage.getItem("projects"));
const currentUserId = parseInt(localStorage.getItem("currentUserId"));

// Tạo dữ liệu mẫu cho users nếu chưa có
let users = JSON.parse(localStorage.getItem("users"));
if (!users || !Array.isArray(users)) {
users = [
  { id: 1, 
    fullName: "Trọng Trí",
    email: "admin@gmail.com", 
    password: "123123123" 
  },
  { id: 2, 
    fullName: "Thầy Bốp", 
    email: "bopbop@gmail.com", 
    password: "123123123" 
  },
  { id: 3, 
    fullName: "Trần Bình", 
    email: "tranbinh@gmail.com", 
    password: "123123123" },
];
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("userIdCounter", "4");
}

// Tạo dữ liệu mẫu cho tasks nếu chưa có
let tasks = JSON.parse(localStorage.getItem("tasks"));
if (!tasks || !Array.isArray(tasks)) {
tasks = [
  {
    id: 1,
    taskName: "Soạn thảo đề cương dự án",
    assigneeId: 1,
    projectId: 1,
    assignDate: "2025-03-24",
    dueDate: "2025-03-26",
    priority: "Thấp",
    progress: "Đúng tiến độ",
    status: "To do"
  },
  
];
localStorage.setItem("tasks", JSON.stringify(tasks));
localStorage.setItem("taskIdCounter", "2");
}

if (!projects || !Array.isArray(projects)) {
  projects = [
    {
      id: 1,
      projectName: "Xây dựng website thương mại điện tử",
      description:
        "Dự án xây dựng nền tảng thương mại điện tử với chức năng giỏ hàng, thanh toán và quản lý sản phẩm.",
      members: [{ userId: currentUserId, role: "Project owner" }],
    },
    {
      id: 2,
      projectName: "Quản lý nhân sự",
      description:
        "Dự án xây dựng hệ thống quản lý nhân sự cho doanh nghiệp.",
      members: [{ userId: currentUserId, role: "Project owner" }],
    },
    {
      id: 3,
      projectName: "Ứng dụng học trực tuyến",
      description:
        "Nền tảng học tập trực tuyến hỗ trợ giáo viên và học sinh.",
      members: [{ userId: currentUserId, role: "Project owner" }],
    },
    {
      id: 4,
      projectName: "Hệ thống đặt lịch khám bệnh",
      description:
        "Ứng dụng cho phép người dùng đặt lịch hẹn khám và nhận thông báo.",
      members: [{ userId: currentUserId, role: "Project owner" }],
    },
    {
      id: 5,
      projectName: "Ứng dụng quản lý tài chính cá nhân",
      description:
        "Công cụ giúp người dùng theo dõi chi tiêu và quản lý ngân sách.",
      members: [{ userId: currentUserId, role: "Project owner" }],
    },
    {
      id: 6,
      projectName: "Trang web chia sẻ công thức nấu ăn",
      description:
        "Nơi người dùng có thể đăng, tìm kiếm và chia sẻ công thức nấu ăn.",
      members: [{ userId: currentUserId, role: "Project owner" }],
    }
  ];
  localStorage.setItem("projects", JSON.stringify(projects));
  localStorage.setItem("projectIdCounter", "7"); // Khởi tạo projectIdCounter nếu chưa có
}

//lưu dữ liệu projects lên local storage
// → BỎ đoạn này đi nếu không muốn ghi đè dữ liệu sau mỗi lần load
// localStorage.setItem("projects", JSON.stringify(projects)); <-- Dòng này gây lỗi ghi đè, đã bỏ

//lấy dữ liệu projects từ local storage
projects = JSON.parse(localStorage.getItem("projects")) || [];

//----------Phân trang----------//
let projectIdCounter = parseInt(localStorage.getItem("projectIdCounter")) || 7; //biến ID tự tăng do mỗi dự án mới, vì đã có sẵn 6 project nên ID sẽ tự tăng từ 7

let currentPage = 1; //xác định trang sẽ hiển thị
const projectsPerPage = 5; //giới hạn số project sẽ hiển thị trên một trang

function renderProjects() {
const tbody = document.getElementById("projectTableBody"); //chèn dữ liệu từng dòng vào tbody(hiển thị dữ liệu từng dòng)
const keyword = document.getElementById("searchInput").value.toLowerCase(); //lấy giá trị từ o input để tìm kiểm nếu nhập chữ hoa thì chuyển về chữ thường
const filtered = projects.filter((project) =>
  project.projectName.toLowerCase().includes(keyword)
); //lọc dữ liệu dự án theo tên dự án trả về một mảng mới
const start = (currentPage - 1) * projectsPerPage; //tính chỉ số bắt đầu của trang hiện tại
const current = filtered.slice(start, start + projectsPerPage); //lấy dữ liệu từ mảng filtered theo chỉ số bắt đầu và số lượng dự án trên một trang
const totalItems = filtered.length; //tổng số dự án trong mảng filtered

tbody.innerHTML = ""; //xóa dữ liêu cũ trong tbody trước khi thêm dữ liệu mới vào
current.forEach((project) => {
  tbody.innerHTML += `
      <tr>
      <td>${project.id}</td>
      <td class="text-start">${project.projectName}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="openAddModal(${project.id})">Sửa</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Xóa</button>
        <button class="btn btn-primary btn-sm" onclick="openProjectDetail(${project.id}, '${project.projectName}', '${project.description}')">Chi tiết</button>
      </td>
    </tr>
      `;
});
renderPagination(totalItems); //gọi hàm phân trang
}

//----------Hàm phân trang----------//
function renderPagination(totalItems) {
const totalPages = Math.ceil(totalItems / projectsPerPage);
const pagination = document.getElementById("pagination");
let pageHTML = "";

// Nút Prev
pageHTML += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">`;
pageHTML += `<a class="page-link" href="#" onclick="goToPage(${
  currentPage - 1
})">Prev</a>`;
pageHTML += `</li>`;

// Các nút số trang
for (let i = 1; i <= totalPages; i++) {
  pageHTML += `<li class="page-item ${currentPage === i ? "active" : ""}">`;
  pageHTML += `<a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>`;
  pageHTML += `</li>`;
}

// Nút Next
pageHTML += `<li class="page-item ${
  currentPage === totalPages ? "disabled" : ""
}">`;
pageHTML += `<a class="page-link" href="#" onclick="goToPage(${
  currentPage + 1
})">Next</a>`;
pageHTML += `</li>`;

pagination.innerHTML = pageHTML;
}

//----------Hàm di chuyển trang----------//
function goToPage(page) {
currentPage = page;
renderProjects();
}

//----------Hàm lưu dự án----------//
function saveProject() {
const nameInput = document.getElementById("projectName");
const descriptionInput = document.getElementById("projectDescription");
const nameError = document.getElementById("projectNameError");
const descriptionError = document.getElementById("projectDescriptionError");

const name = nameInput.value.trim(); //lấy giá trị từ ô input và loại bỏ khoảng trắng đầu và cuối
const description = descriptionInput.value.trim(); //lấy giá trị từ ô input và loại bỏ khoảng trắng đầu và cuối

nameError.innerHTML = ""; //xóa thông báo lỗi nếu có
descriptionError.innerHTML = ""; //xóa thông báo lỗi nếu có

let valid = true; //biến kiểm tra tính hợp lệ của dữ liệu nhập vào

if (name.length < 5) {
  nameError.textContent = "Tên dự án phải từ 5 ký tự trở lên";
  valid = false;
}

if (description.length < 10) {
  descriptionError.textContent = "Mô tả phải từ 10 ký tự trở lên";
  valid = false;
}

if (!valid) return; //nếu không hợp lệ thì dừng hàm tại đây

//tiếp theo kiểm tra tên dự án có bị trùng hay không
const isDuplicate = projects.some((project) =>
  project.projectName.toLowerCase() === name.toLowerCase() &&
  (!nameInput.dataset.editId || project.id != nameInput.dataset.editId)
);

if (isDuplicate) {
  nameError.textContent = "Tên dự án đã tồn tại.";
  return;
}

const currentUserId = parseInt(localStorage.getItem("currentUserId")); // ← Lấy ID người dùng đang đăng nhập

if (nameInput.dataset.editId) {
  const project = projects.find((project) => project.id == nameInput.dataset.editId);
  project.projectName = name;
  project.description = description;
} else {
  projects.push({
    id: projectIdCounter++,
    projectName: name,
    description,
    members: [
      { userId: currentUserId, role: "Project owner" } // ← Gán đúng người đang đăng nhập làm chủ dự án
    ]
  });
  localStorage.setItem("projectIdCounter", projectIdCounter.toString());
}

localStorage.setItem("projects", JSON.stringify(projects));
bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).hide();

renderProjects();
}


//----------Hàm reset----------//
function resetFormInputs() {
  const nameInput = document.getElementById("projectName");
  const descriptionInput = document.getElementById("projectDescription");
  nameInput.value = "";
  descriptionInput.value = "";
  delete nameInput.dataset.editId;
}

//----------Hàm mở modal thêm mới / sửa dự án----------//
function openAddModal(id) {
  resetFormInputs();
  const label = document.getElementById("projectModalLabel");
  const nameInput = document.getElementById("projectName");
  const descriptionInput = document.getElementById("projectDescription");

  const project = projects.find(project => project.id === id);

  if (project) {
    label.textContent = "Sửa Dự Án";
    nameInput.value = project.projectName;
    descriptionInput.value = project.description;
    nameInput.dataset.editId = project.id;
  } else {
    label.textContent = "Thêm Dự Án Mới";
    delete nameInput.dataset.editId;
  }

  bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).show();
}

//----------Hàm hiển thị modal xác nhận xóa dự án----------//
let deleteProjectId = null;

function deleteProject(id) {
deleteProjectId = id;
const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal"));
modal.show(); //hiển thị modal xác nhận xóa dự án
}
//tiến hàng xóa dự án khi ấn nút xác nhận xóa
document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
if (deleteProjectId !== null) {
  projects = projects.filter(project => project.id !== deleteProjectId);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
  deleteProjectId = null;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal")).hide();
}
});

//----------Mở modal xác nhận đăng xuất----------//
function openLogoutModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("logoutConfirmModal"));
  modal.show();
  document.getElementById("confirmLogoutBtn").onclick = function () {
    localStorage.removeItem("isLoggedIn");
    location.href = "../pages/login.html";
  };
}


//----------Tìm kiếm dự án----------//
document.getElementById("searchInput").addEventListener("input", () => {
  currentPage = 1; // reset về trang 1 khi tìm kiếm
  renderProjects();
});


//----------Hàm mở chi tiết dự án----------//
function openProjectDetail(id, name, description) {
  localStorage.setItem("currentProjectId", id);
  localStorage.setItem("currentProjectName", name);
  localStorage.setItem("currentProjectDescription", description);
  location.href = "../pages/detail-project-manager.html";
}
renderProjects(); //gọi hàm để render dữ liệu lên bảng
