if (localStorage.getItem("isLoggedIn") !== "true") {
  location.href = "../pages/login.html"; // Nếu chưa đăng nhập thì redirect về login
}

let currentPage = 1;
const projectsPerPage = 5;
let projects = [
  {
    id: 1,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 1, role: "Project owner" },
      { userId: 2, role: "Frontend developer" }
    ]
  },
  {
    id: 2,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 3, role: "Project owner" },
      { userId: 4, role: "Frontend developer" }
    ]
  },
  {
    id: 3,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 5, role: "Project owner" },
      { userId: 6, role: "Frontend developer" }
    ]
  },
  {
    id: 4,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 7, role: "Project owner" },
      { userId: 8, role: "Frontend developer" }
    ]
  },
  {
    id: 5,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 9, role: "Project owner" },
      { userId: 10, role: "Frontend developer" }
    ]
  },
  {
    id: 6,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 11, role: "Project owner" },
      { userId: 12, role: "Frontend developer" }
    ]
  },
  {
    id: 7,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 13, role: "Project owner" },
      { userId: 14, role: "Frontend developer" }
    ]
  },
  {
    id: 8,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 15, role: "Project owner" },
      { userId: 16, role: "Frontend developer" }
    ]
  },
  {
    id: 9,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 17, role: "Project owner" },
      { userId: 18, role: "Frontend developer" }
    ]
  },
  {
    id: 10,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 19, role: "Project owner" },
      { userId: 20, role: "Frontend developer" }
    ]
  },
  {
    id: 11,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 21, role: "Project owner" },
      { userId: 22, role: "Frontend developer" }
    ]
  },
  {
    id: 12,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 23, role: "Project owner" },
      { userId: 24, role: "Frontend developer" }
    ]
  },
  {
    id: 13,
    projectName: "Xây dựng website thương mại điện tử",
    members: [
      { userId: 25, role: "Project owner" },
      { userId: 26, role: "Frontend developer" }
    ]
  }
];

function renderProjects() {
  const tbody = document.getElementById("projectTableBody");
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = projects.filter(p => p.projectName.toLowerCase().includes(keyword));
  const start = (currentPage - 1) * projectsPerPage;
  const current = filtered.slice(start, start + projectsPerPage);

  tbody.innerHTML = "";
  current.forEach(project => {
    const members = project.members.map(m => m.role).join(", ");
    tbody.innerHTML += `
      <tr>
        <td>${project.id}</td>
        <td>${project.projectName}</td>
        <td>${members}</td>
        <td>
          <button class='btn btn-warning btn-sm' onclick='openAddModal(${project.id})'>Sửa</button>
          <button class='btn btn-danger btn-sm' onclick='deleteProject(${project.id})'>Xóa</button>
          <button class='btn btn-primary btn-sm' onclick=''>Chi tiết</button>
        </td>
      </tr>
    `;
  });
  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / projectsPerPage);
  const pagination = document.getElementById("pagination");
  let pageHTML = "";

  if (currentPage > 1) {
    pageHTML += `<li class="page-item">
      <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Previous</a>
    </li>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    pageHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
    </li>`;
  }

  if (currentPage < totalPages) {
    pageHTML += `<li class="page-item">
      <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a>
    </li>`;
  }

  pagination.innerHTML = pageHTML;
}

function goToPage(page) {
  currentPage = page;
  renderProjects();
}

function openAddModal(id) {
  resetFormInputs();
  const label = document.getElementById("projectModalLabel");
  const nameInput = document.getElementById("projectName");
  const memberInput = document.getElementById("projectMembers");
  const project = projects.find(p => p.id === id);

  if (project) {
    label.textContent = "Sửa Dự Án";
    nameInput.value = project.projectName;
    memberInput.value = project.members.map(m => m.role).join(", ");
    nameInput.dataset.editId = id;
  } else {
    label.textContent = "Thêm Dự Án Mới";
  }

  const modalEl = document.getElementById("projectModal");
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();

  nameInput.focus();
  setTimeout(() => document.getElementById("projectName").focus(), 300);
}

function saveProject() {
  const nameInput = document.getElementById("projectName");
  const membersInput = document.getElementById("projectMembers");
  const name = nameInput.value.trim();
  const members = membersInput.value.trim();

  const nameError = document.getElementById("projectNameError");
  const membersError = document.getElementById("projectMembersError");
  nameError.textContent = "";
  membersError.textContent = "";

  let valid = true;
  if (!name) {
    nameError.textContent = "Tên dự án không được để trống";
    valid = false;
  }
  if (!members) {
    membersError.textContent = "Vui lòng nhập vai trò các thành viên";
    valid = false;
  }

  if (!valid) return;

  const roles = members.split(",").map((r, i) => ({ userId: i + 1, role: r.trim() })).filter(m => m.role);

  if (nameInput.dataset.editId) {
    const project = projects.find(p => p.id == nameInput.dataset.editId);
    project.projectName = name;
    project.members = roles;
  } else {
    projects.push({ id: projects.length + 1, projectName: name, members: roles });
  }

  bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).hide();
  renderProjects();
}

function resetFormInputs() {
  const nameInput = document.getElementById("projectName");
  const memberInput = document.getElementById("projectMembers");
  nameInput.value = "";
  memberInput.value = "";
  delete nameInput.dataset.editId;
}

function deleteProject(id) {
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal"));

  confirmBtn.onclick = function () {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects.splice(index, 1);
      renderProjects();
    }
    modal.hide();
  };

  modal.show();
}

function openLogoutModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("logoutConfirmModal"));
  modal.show();

  const confirmBtn = document.getElementById("confirmLogoutBtn");
  confirmBtn.onclick = function () {
    localStorage.removeItem("isLoggedIn");
    location.href = "../pages/login.html";
  };
}
renderProjects();

