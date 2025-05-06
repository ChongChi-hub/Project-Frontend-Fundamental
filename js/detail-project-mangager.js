// Kiểm tra đăng nhập nếu ở trạng thái chưa đăng nhập thì duy chuyển về trang đăng nhập
if (localStorage.getItem("isLoggedIn") !== "true") {
  location.href = "../pages/login.html";
}
//lấy id dự án hiện tại từ local storage
const currentProjectId = localStorage.getItem("currentProjectId");
// Lấy toàn bộ danh sách dự án từ localStorage, nếu không có thì dùng mảng rỗng
const currentProjectName = localStorage.getItem("currentProjectName") || "Tên dự án";
// Tìm dự án hiện tại trong danh sách dự án dựa theo ID đã lấy
const currentProjectDescription = localStorage.getItem("currentProjectDescription") || "Mô tả dự án.";
// Lấy tên dự án từ currentProject nếu có, nếu không thì dùng giá trị mặc định
const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
let projects = allProjects; // Gán lại để các đoạn code sau có thể set lại localStorage
// Lấy mô tả dự án từ currentProject nếu có, nếu không thì dùng giá trị mặc định
const currentProject = allProjects.find(project => project.id == currentProjectId);
// Lấy danh sách người dùng từ localStorage để hiển thị thông tin thành viên nếu cần
const users = JSON.parse(localStorage.getItem("users")) || [];

//nếu  không tìm thấy dự án hiện tại thì chuyển hướng về trang quản lý
if (!currentProject) {
  location.href = "../pages/project-manager.html";
}

//----------Khởi tạo dữ liệu----------//
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//Hiển thị tên dự án và mô tả dự án
document.getElementById("projectTitle").textContent = currentProjectName;
document.getElementById("projectDescription").textContent = currentProjectDescription;


//----------Hàm format ngày tháng----------//
function formatDate(dateStr) {
  const parts = dateStr.split("-");
  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : dateStr;
}


//----------Hàm hiển thị màu sắc của priority theo cấp độ----------//
function generatePriorityBadge(priority) {
  if (priority === "Cao") return '<span class="badge bg-success">Cao</span>';
  if (priority === "Trung bình") return '<span class="badge bg-warning text-dark">Trung bình</span>';
  return '<span class="badge bg-danger">Thấp</span>';
}

//----------Hàm hiển thị màu sắc của progress theo cấp độ----------//
function generateProgressBadge(progress) {
  if (progress === "Trì hoãn") return '<span class="badge bg-danger">Trì hoãn</span>';
  if (progress === "Có rủi ro") return '<span class="badge bg-warning text-dark">Có rủi ro</span>';
  return '<span class="badge bg-success">Đúng tiến độ</span>';
}

//----------Hàm hiển thị danh sách nhiệm vụ----------//
function renderTasks() {
const table = document.getElementById("taskTable");
const keyword = document.getElementById("searchTaskInput").value.toLowerCase();
const sortValue = document.getElementById("sortSelect").value;

let projectTasks = tasks.filter(t => t.projectId == currentProjectId);

if (keyword) {
  projectTasks = projectTasks.filter(t => t.taskName.toLowerCase().includes(keyword));
}

// Nhóm nhiệm vụ theo trạng thái
const grouped = {};
projectTasks.forEach(task => {
  if (!grouped[task.status]) grouped[task.status] = [];
  grouped[task.status].push(task);
});

// Thứ tự sắp xếp custom
const priorityOrder = { "Thấp": 1, "Trung bình": 2, "Cao": 3 };
const progressOrder = { "Đúng tiến độ": 1, "Có rủi ro": 2, "Trì hoãn": 3 };

const allStatuses = ["To do", "In progress", "Pending", "Done"];
table.innerHTML = "";

allStatuses.forEach((status, index) => {
  const tasksByStatus = grouped[status] || [];

  // Sắp xếp bên trong mỗi nhóm trạng thái
  if (sortValue === "priority-asc") {
    tasksByStatus.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortValue === "priority-desc") {
    tasksByStatus.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else if (sortValue === "progress-asc") {
    tasksByStatus.sort((a, b) => progressOrder[a.progress] - progressOrder[b.progress]);
  } else if (sortValue === "progress-desc") {
    tasksByStatus.sort((a, b) => progressOrder[b.progress] - progressOrder[a.progress]);
  }

  const collapseId = `collapseStatus${index}`;
  const headingId = `headingStatus${index}`;

  table.innerHTML += `
    <tr>
      <td colspan="7" class="p-0 border-0">
        <div class="accordion mb-3 shadow-sm" id="accordion-${index}">
          <div class="accordion-item">
            <h2 class="accordion-header" id="${headingId}">
              <button class="accordion-button ${tasksByStatus.length === 0 ? 'collapsed' : ''}" 
                      type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" 
                      aria-expanded="${tasksByStatus.length !== 0}" 
                      aria-controls="${collapseId}">
                ${status}
              </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${tasksByStatus.length !== 0 ? 'show' : ''}" 
                 aria-labelledby="${headingId}" data-bs-parent="#accordion-${index}">
              <div class="accordion-body p-0">
                <table class="table table-bordered table-hover m-0 text-center align-middle">
                  <tbody>
                    <tr class="bg-dark text-white fw-bold table-dark">
                      <td>Tên Nhiệm Vụ</td>
                      <td>Người Phụ Trách</td>
                      <td>Ngày Giao</td>
                      <td>Hạn Chót</td>
                      <td>Ưu Tiên</td>
                      <td>Tiến Độ</td>
                      <td>Hành Động</td>
                    </tr>
                    ${
                      tasksByStatus.length === 0
                        ? `<tr><td colspan="7" class="text-muted">Không có nhiệm vụ</td></tr>`
                        : tasksByStatus.map(task => `
                          <tr>
                            <td>${task.taskName}</td>
                            <td>${getUserInfo(task.assigneeId)}</td>
                            <td class="text-primary">${formatDate(task.assignDate)}</td>
                            <td class="text-primary">${formatDate(task.dueDate)}</td>
                            <td>${generatePriorityBadge(task.priority)}</td>
                            <td>${generateProgressBadge(task.progress)}</td>
                            <td>
                              <button class="btn btn-warning btn-sm" onclick="openTaskModal(${task.id})">Sửa</button>
                              <button class="btn btn-danger btn-sm" onclick="confirmDelete(${task.id})">Xóa</button>
                            </td>
                          </tr>
                        `).join("")
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>`;
});
}
// Gọi lại renderTasks mỗi khi chọn sắp xếp
document.getElementById("sortSelect").addEventListener("change", () => {
renderTasks();
});


//----------lưu nhiệm vụ----------//
function saveTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const assigneeId = parseInt(document.getElementById("assigneeId").value);
  const status = document.getElementById("status").value;
  const assignDate = document.getElementById("assignDate").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const progress = document.getElementById("progress").value;
  const editTaskId = document.getElementById("editTaskId").value;

  resetFormErrors();
  let valid = true;

  if (!taskName) { document.getElementById("taskNameError").textContent = "Tên nhiệm vụ không được để trống"; valid = false; }
  const isDuplicate = tasks.some(t =>
    t.projectId == currentProjectId &&
    t.taskName.toLowerCase() === taskName.toLowerCase() &&
    t.id != editTaskId // nếu đang sửa thì bỏ qua chính nó
  );
  if (isDuplicate) {
    document.getElementById("taskNameError").textContent = "Tên nhiệm vụ đã tồn tại trong dự án.";
    valid = false;
  }
  if (!assigneeId || !currentProject.members.some(m => m.userId === assigneeId)) {
    document.getElementById("assigneeIdError").textContent = "Người phụ trách không hợp lệ"; valid = false;
  }
  if (!status) { document.getElementById("statusError").textContent = "Chọn trạng thái"; valid = false; }
  if (!assignDate) { document.getElementById("assignDateError").textContent = "Chọn ngày giao"; valid = false; }
  if (!dueDate) { document.getElementById("dueDateError").textContent = "Chọn hạn chót"; valid = false; }
  if (assignDate && dueDate && assignDate > dueDate) {
    document.getElementById("dueDateError").textContent = "Hạn chót phải sau hoặc bằng ngày giao.";
    valid = false;
  }
  
  if (!priority) { document.getElementById("priorityError").textContent = "Chọn ưu tiên"; valid = false; }
  if (!progress) { document.getElementById("progressError").textContent = "Chọn tiến độ"; valid = false; }

  if (!valid) return;

  if (editTaskId) {
    const task = tasks.find(t => t.id == editTaskId);
    Object.assign(task, { taskName, assigneeId, status, assignDate, dueDate, priority, progress });
  } else {
    tasks.push({
      id: Date.now(),
      taskName, assigneeId, status, assignDate, dueDate,
      priority, progress, projectId: currentProjectId
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("taskModal")).hide();
}

// GẮN SỰ KIỆN SUBMIT CHO FORM SAU KHI ĐÃ KHAI BÁO HÀM saveTask
document.getElementById("taskForm").addEventListener("submit", function (event) {
event.preventDefault();
saveTask();
});

//----------Hàm hiển thị modal thêm/sửa nhiệm vụ----------//
function openTaskModal(taskId) {
  const modal = new bootstrap.Modal(document.getElementById("taskModal"));
  const modalTitle = document.getElementById("modalTitle");
  const form = document.getElementById("taskForm");
  const editTaskId = document.getElementById("editTaskId");

  form.reset();
  editTaskId.value = "";
  resetFormErrors();

  const assigneeSelect = document.getElementById("assigneeId");
  assigneeSelect.innerHTML = currentProject.members.map(m => {
    const user = users.find(u => u.id == m.userId);
    return `<option value="${m.userId}">${user?.fullName || "Không rõ"}</option>`;
  }).join("");

  // Nếu có taskId thì là sửa, ngược lại là thêm mới
  if (taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      document.getElementById("taskName").value = task.taskName;
      document.getElementById("assigneeId").value = task.assigneeId;
      document.getElementById("status").value = task.status;
      document.getElementById("assignDate").value = task.assignDate;
      document.getElementById("dueDate").value = task.dueDate;
      document.getElementById("priority").value = task.priority;
      document.getElementById("progress").value = task.progress;
      editTaskId.value = task.id;
      modalTitle.textContent = "Sửa Nhiệm Vụ";
    }
  } else {
    modalTitle.textContent = "Thêm Nhiệm Vụ";
  }

  modal.show();
}


//----------Hàm hiển thị modal đăng xuất----------//
function openLogoutModal() {
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("logoutConfirmModal"));
  modal.show();
  document.getElementById("confirmLogoutBtn").onclick = function () {
    localStorage.removeItem("isLoggedIn");
    location.href = "../pages/login.html";
  };
}

//----------Hàm hiển thị modal xác nhận xóa nhiệm vụ----------//
let deleteTaskId = null; //Biến để lưu ID của nhiệm cụ cần xóa
function confirmDelete(taskId) {
  deleteTaskId = taskId;
  const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  modal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  if (deleteTaskId !== null) {
    tasks = tasks.filter(t => t.id !== deleteTaskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    deleteTaskId = null;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal")).hide();
  }
});

//----------Hàm reset form----------//
function resetFormErrors() {
  ["taskNameError", "assigneeIdError", "statusError", "assignDateError", "dueDateError", "priorityError", "progressError"]
    .forEach(id => document.getElementById(id).textContent = "");
}

//----------Hàm lấy thông tin vai trò----------//
function getUserInfo(userId) {
const user = users.find(user => user.id == userId);
const member = currentProject.members.find(member => member.userId == userId);
if (!user || !member) return "<span class='text-muted'>Không phụ trách</span>";
return `${user.fullName} (${member.role})`;
}

//----------Tìm kiếm nhiệm vụ theo từ khóa----------//
document.getElementById("searchTaskInput").addEventListener("input", () => {
  renderTasks(); // Gọi lại hàm mỗi khi nhập
});

//----------hàm hiển thị thành viên----------//
function renderMemberList() {
const memberListEl = document.getElementById("memberList");
memberListEl.innerHTML = "";
const members = currentProject.members || [];
const maxVisible = 2;

members.slice(0, maxVisible).forEach(member => {
  const user = users.find(user => user.id === member.userId);

  // Nếu không tìm thấy user, tránh lỗi undefined
  const fullName = user?.fullName || "Không rõ";
  const initials = fullName
    .split(" ")
    .map(word => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const color = getColorClass(initials);

  memberListEl.innerHTML += `
    <div class="d-flex align-items-center border rounded px-2 py-1 gap-2">
      <div class="rounded-circle ${color} text-white text-center fw-bold" style="width: 30px; height: 30px; line-height: 30px;">
        ${initials}
      </div>
      <div>
        <div class="fw-semibold">${fullName}</div>
        <div class="text-muted" style="font-size: 0.8rem;">${member.role}</div>
      </div>
    </div>`;
});

if (members.length > maxVisible) {
  const moreBtn = document.createElement("button");
  moreBtn.className = "btn btn-light border px-2 py-1";
  moreBtn.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
  moreBtn.onclick = openAllMembersModal;
  memberListEl.appendChild(moreBtn);
}
}

//----------Hàm mở modal hiển thị tất cả thành viên----------//
function openAllMembersModal() {
const allMembersListEl = document.getElementById("allMembersList");
allMembersListEl.innerHTML = "";

currentProject.members.forEach(member => {
  const user = users.find(user => user.id === member.userId);
  if (!user) return;

  allMembersListEl.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>${user.fullName}</strong><br>
        <small>${user.email}</small><br>
        <span class="text-muted">${member.role}</span>
      </div>
      <button class="btn btn-sm btn-danger" onclick="removeMember(${member.userId})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </li>`;
});

bootstrap.Modal.getOrCreateInstance(document.getElementById("allMembersModal")).show();
}

//----------Hàm mở modal thêm thành viên----------//
function openAddMemberModal() {
document.getElementById("newMemberEmail").value = "";
document.getElementById("newMemberRole").value = "";
document.getElementById("emailError").textContent = "";
document.getElementById("roleError").textContent = "";
bootstrap.Modal.getOrCreateInstance(document.getElementById("addMemberModal")).show();
}

//----------Hàm thêm thành viên----------//
function addMember() {
const email = document.getElementById("newMemberEmail").value.trim();
const role = document.getElementById("newMemberRole").value.trim();
const emailError = document.getElementById("emailError");
const roleError = document.getElementById("roleError");
emailError.textContent = "";
roleError.textContent = "";

const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

if (!user) {
  emailError.textContent = "Không tìm thấy người dùng với email này.";
  return;
}

if (currentProject.members.some(m => m.userId === user.id)) {
  emailError.textContent = "Thành viên đã tồn tại.";
  return;
}

if (!role) {
  roleError.textContent = "Vui lòng nhập vai trò.";
  return;
}

currentProject.members.push({ userId: user.id, role });

const index = projects.findIndex(p => p.id == currentProjectId);
if (index !== -1) {
  projects[index] = currentProject;
  localStorage.setItem("projects", JSON.stringify(projects));
}

renderMemberList();
bootstrap.Modal.getOrCreateInstance(document.getElementById("addMemberModal")).hide();
}

//----------Hàm xóa thành viên----------//
let userIdToRemove = null;
function removeMember(userId) {
userIdToRemove = userId;
const modal = new bootstrap.Modal(document.getElementById("confirmRemoveMemberModal"));
modal.show();
}

document.getElementById("confirmRemoveMemberBtn").addEventListener("click", () => {
if (userIdToRemove !== null) {
  // Xóa thành viên khỏi project
  currentProject.members = currentProject.members.filter(member => member.userId !== userIdToRemove);

  // Cập nhật lại localStorage cho dự án
  const index = projects.findIndex(project => project.id == currentProjectId);
  if (index !== -1) {
    projects[index] = currentProject;
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  // Gỡ bỏ user khỏi nhiệm vụ trong dự án hiện tại
  tasks = tasks.map(task => {
    if (task.projectId == currentProjectId && task.assigneeId === userIdToRemove) {
      return { ...task, assigneeId: null }; // hoặc assigneeId: undefined
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderMemberList();
  renderTasks(); // Cập nhật lại danh sách nhiệm vụ
  bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmRemoveMemberModal")).hide();
  openAllMembersModal(); // cập nhật lại modal thành viên
  userIdToRemove = null;
}
});


// ========================== Hàm phụ trợ: tạo màu avatar ==========================
function getColorClass(initials) {
const code = initials.charCodeAt(0);
const colors = ["bg-primary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-secondary"];
return colors[code % colors.length];
}




//gọi hàm hiển thị thành viên
renderMemberList();
//gọi hàm renderTasks để hiển thị danh sách nhiệm vụ
renderTasks();
