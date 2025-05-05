if (localStorage.getItem("isLoggedIn") !== "true") {
  location.href = "../pages/login.html";
}

const currentProjectId = localStorage.getItem("currentProjectId");
const currentProjectName = localStorage.getItem("currentProjectName") || "Tên dự án";
const currentProjectDescription = localStorage.getItem("currentProjectDescription") || "Mô tả dự án.";
const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
const currentProject = allProjects.find(p => p.id == currentProjectId);
const users = JSON.parse(localStorage.getItem("users")) || [];

if (!currentProject) {
  location.href = "../pages/product-manager.html";
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deleteTaskId = null;

document.getElementById("projectTitle").textContent = currentProjectName;
document.getElementById("projectDescription").textContent = currentProjectDescription;

function getUserInfo(userId) {
  const member = currentProject?.members?.find(m => m.userId == userId);
  const user = users.find(u => u.id == userId);
  return user ? `${user.fullName} (${member?.role || 'Vai trò?'})` : "Không rõ";
}

function formatDate(dateStr) {
  const parts = dateStr.split("-");
  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : dateStr;
}

function generatePriorityBadge(priority) {
  if (priority === "Cao") return '<span class="badge bg-success">Cao</span>';
  if (priority === "Trung bình") return '<span class="badge bg-warning text-dark">Trung bình</span>';
  return '<span class="badge bg-danger">Thấp</span>';
}

function generateProgressBadge(progress) {
  if (progress === "Trì hoãn") return '<span class="badge bg-danger">Trì hoãn</span>';
  if (progress === "Có rủi ro") return '<span class="badge bg-warning text-dark">Có rủi ro</span>';
  return '<span class="badge bg-success">Đúng tiến độ</span>';
}

function renderTasks() {
  const table = document.getElementById("taskTable");
  const keyword = document.getElementById("searchTaskInput").value.toLowerCase();
  const sortValue = document.getElementById("sortSelect").value;

  let projectTasks = tasks.filter(t => t.projectId == currentProjectId);
  if (keyword) {
    projectTasks = projectTasks.filter(t => t.taskName.toLowerCase().includes(keyword));
  }

  if (sortValue) {
    projectTasks.sort((a, b) => {
      if (sortValue === "priority") return a.priority.localeCompare(b.priority);
      if (sortValue === "progress") return a.progress.localeCompare(b.progress);
      return 0;
    });
  }

  const grouped = {};
  projectTasks.forEach(task => {
    if (!grouped[task.status]) grouped[task.status] = [];
    grouped[task.status].push(task);
  });

  const allStatuses = ["To do", "In progress", "Pending", "Done"];
  table.innerHTML = "";

  allStatuses.forEach((status, index) => {
    const tasksByStatus = grouped[status] || [];
    const collapseId = `collapseStatus${index}`;
    const headingId = `headingStatus${index}`;

    table.innerHTML += `
  <tr>
    <td colspan="8" class="p-0 border-0">
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
                  ${tasksByStatus.length === 0
                    ? `<tr><td colspan="7" class="text-muted">Không có nhiệm vụ</td></tr>`
                    : tasksByStatus.map(task => `
                      <tr>
                        <td>${task.taskName}</td>
                        <td>${getUserInfo(task.assigneeId)}</td>
                        <td class="text-primary">${formatDate(task.asignDate)}</td>
                        <td class="text-primary">${formatDate(task.dueDate)}</td>
                        <td>${generatePriorityBadge(task.priority)}</td>
                        <td>${generateProgressBadge(task.progress)}</td>
                        <td>
                          <button class="btn btn-warning btn-sm" onclick="openTaskModal(${task.id})">Sửa</button>
                          <button class="btn btn-danger btn-sm" onclick="confirmDelete(${task.id})">Xóa</button>
                        </td>
                      </tr>`).join("")}
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


function resetFormErrors() {
  ["taskNameError", "assigneeIdError", "statusError", "asignDateError", "dueDateError", "priorityError", "progressError"]
    .forEach(id => document.getElementById(id).textContent = "");
}

function saveTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const assigneeId = parseInt(document.getElementById("assigneeId").value);
  const status = document.getElementById("status").value;
  const asignDate = document.getElementById("asignDate").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const progress = document.getElementById("progress").value;
  const editTaskId = document.getElementById("editTaskId").value;

  resetFormErrors();
  let valid = true;

  if (!taskName) { document.getElementById("taskNameError").textContent = "Tên nhiệm vụ không được để trống"; valid = false; }
  if (!assigneeId || !currentProject.members.some(m => m.userId === assigneeId)) {
    document.getElementById("assigneeIdError").textContent = "Người phụ trách không hợp lệ"; valid = false;
  }
  if (!status) { document.getElementById("statusError").textContent = "Chọn trạng thái"; valid = false; }
  if (!asignDate) { document.getElementById("asignDateError").textContent = "Chọn ngày giao"; valid = false; }
  if (!dueDate) { document.getElementById("dueDateError").textContent = "Chọn hạn chót"; valid = false; }
  if (!priority) { document.getElementById("priorityError").textContent = "Chọn ưu tiên"; valid = false; }
  if (!progress) { document.getElementById("progressError").textContent = "Chọn tiến độ"; valid = false; }

  if (!valid) return;

  if (editTaskId) {
    const task = tasks.find(t => t.id == editTaskId);
    Object.assign(task, { taskName, assigneeId, status, asignDate, dueDate, priority, progress });
  } else {
    tasks.push({
      id: Date.now(),
      taskName, assigneeId, status, asignDate, dueDate,
      priority, progress, projectId: currentProjectId
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("taskModal")).hide();
}

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

document.getElementById("sortSelect").addEventListener("change", renderTasks);
document.getElementById("searchTaskInput").addEventListener("input", renderTasks);
document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  location.href = "../pages/login.html";
});

function openTaskModal(taskId = null) {
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

  if (taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      document.getElementById("taskName").value = task.taskName;
      document.getElementById("assigneeId").value = task.assigneeId;
      document.getElementById("status").value = task.status;
      document.getElementById("asignDate").value = task.asignDate;
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

renderTasks();
