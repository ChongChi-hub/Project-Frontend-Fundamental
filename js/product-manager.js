// ===============================
// product-manager.js (chuẩn theo yêu cầu ID tăng dần)
// ===============================

// Kiểm tra đăng nhập
if (localStorage.getItem("isLoggedIn") !== "true") {
  location.href = "../pages/login.html";
}

// Load dữ liệu
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let projectIdCounter = parseInt(localStorage.getItem("projectIdCounter")) || 1;
let currentPage = 1;
const projectsPerPage = 5;

// Vẽ bảng dự án
function renderProjects() {
  const tbody = document.getElementById("projectTableBody");
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = projects.filter(p => p.projectName.toLowerCase().includes(keyword));
  const start = (currentPage - 1) * projectsPerPage;
  const current = filtered.slice(start, start + projectsPerPage);

  tbody.innerHTML = "";
  current.forEach(project => {
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

  renderPagination(filtered.length);
}

// Phân trang
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / projectsPerPage);
  const pagination = document.getElementById("pagination");
  let pageHTML = "";

  pageHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
    <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Prev</a>
  </li>`;

  for (let i = 1; i <= totalPages; i++) {
    pageHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
    </li>`;
  }

  pageHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
    <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a>
  </li>`;

  pagination.innerHTML = pageHTML;
}

function goToPage(page) {
  currentPage = page;
  renderProjects();
}

// Mở modal thêm/sửa dự án
function openAddModal(id = null) {
  resetFormInputs();
  const label = document.getElementById("projectModalLabel");
  const nameInput = document.getElementById("projectName");
  const descriptionInput = document.getElementById("projectDescription");

  if (id !== null) {
    const project = projects.find(p => p.id === id);
    if (project) {
      label.textContent = "Sửa Dự Án";
      nameInput.value = project.projectName;
      descriptionInput.value = project.description;
      nameInput.dataset.editId = project.id;
    }
  } else {
    label.textContent = "Thêm Dự Án Mới";
  }

  bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).show();
}

// Lưu dự án
function saveProject() {
  const nameInput = document.getElementById("projectName");
  const descriptionInput = document.getElementById("projectDescription");
  const nameError = document.getElementById("projectNameError");
  const descriptionError = document.getElementById("projectDescriptionError");

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();

  nameError.textContent = "";
  descriptionError.textContent = "";

  let valid = true;

  if (!name) {
    nameError.textContent = "Tên dự án không được để trống";
    valid = false;
  } else if (name.length > 101) {
    nameError.textContent = "Tên dự án tối đa 100 ký tự";
    valid = false;
  }

  if (!description) {
    descriptionError.textContent = "Mô tả dự án không được để trống";
    valid = false;
  } else if (description.length > 151) {
    descriptionError.textContent = "Mô tả tối đa 150 ký tự";
    valid = false;
  }

  if (!valid) return;

  // Kiểm tra trùng tên
  const isDuplicate = projects.some(p =>
    p.projectName.toLowerCase() === name.toLowerCase() &&
    (!nameInput.dataset.editId || p.id != nameInput.dataset.editId)
  );

  if (isDuplicate) {
    nameError.textContent = "Tên dự án đã tồn tại. Vui lòng nhập tên khác.";
    return;
  }

  if (nameInput.dataset.editId) {
    const project = projects.find(p => p.id == nameInput.dataset.editId);
    project.projectName = name;
    project.description = description;
  } else {
    projects.push({ id: projectIdCounter++, projectName: name, description });
    localStorage.setItem("projectIdCounter", projectIdCounter.toString());
  }

  localStorage.setItem("projects", JSON.stringify(projects));
  bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).hide();
  renderProjects();
}

// Reset form
function resetFormInputs() {
  const nameInput = document.getElementById("projectName");
  const descriptionInput = document.getElementById("projectDescription");
  nameInput.value = "";
  descriptionInput.value = "";
  delete nameInput.dataset.editId;
}

// Xóa dự án
function deleteProject(id) {
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal"));

  confirmBtn.onclick = function () {
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
    modal.hide();
  };

  modal.show();
}

// Xem chi tiết
function openProjectDetail(projectId, projectName, projectDescription) {
  localStorage.setItem("currentProjectId", projectId);
  localStorage.setItem("currentProjectName", projectName);
  localStorage.setItem("currentProjectDescription", projectDescription);
  location.href = "../pages/category-manager.html";
}

// Đăng xuất
function openLogoutModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("logoutConfirmModal"));
  modal.show();
  document.getElementById("confirmLogoutBtn").onclick = function () {
    localStorage.removeItem("isLoggedIn");
    location.href = "../pages/login.html";
  };
}

// Khởi động
renderProjects();

// Tìm kiếm realtime
document.getElementById('searchInput').addEventListener('input', renderProjects);
