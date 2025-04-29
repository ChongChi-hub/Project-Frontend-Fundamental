
// Kiểm tra đăng nhập
if (localStorage.getItem("isLoggedIn") !== "true") {
  location.href = "../pages/login.html";
}

const currentProjectId = localStorage.getItem("currentProjectId");
const currentProjectName = localStorage.getItem("currentProjectName") || "Tên dự án";
const currentProjectDescription = localStorage.getItem("currentProjectDescription") || "Mô tả dự án.";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deleteTaskId = null;

// Hiển thị tiêu đề dự án
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
projectTitle.textContent = currentProjectName;
projectDescription.textContent = currentProjectDescription;

function getFilteredAndSortedTasks() {
  const keyword = document.getElementById("searchTaskInput").value.trim().toLowerCase();
  const sortValue = document.getElementById("sortSelect").value;

  let projectTasks = tasks.filter(task => task.projectId == currentProjectId);

  if (keyword) {
    projectTasks = projectTasks.filter(task => task.taskName.toLowerCase().includes(keyword));
  }

  if (sortValue) {
    projectTasks.sort((a, b) => {
      let compare = 0;
      if (sortValue === "status") compare = a.status.localeCompare(b.status);
      else if (sortValue === "priority") compare = a.priority.localeCompare(b.priority);
      else if (sortValue === "progress") compare = a.progress.localeCompare(b.progress);
      return -compare; // Giảm dần
    });
  }

  return projectTasks;
}

function renderTasks() {
  const table = document.getElementById("taskTable");
  table.innerHTML = "";

  const projectTasks = getFilteredAndSortedTasks();

  if (projectTasks.length === 0) {
    table.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Không tìm thấy nhiệm vụ nào!</td></tr>`;
    return;
  }

  projectTasks.forEach(task => {
    table.innerHTML += `
      <tr>
        <td>${task.taskName}</td>
        <td>${task.assigneeId}</td>
        <td>${task.status}</td>
        <td class="text-primary">${formatDate(task.asignDate)}</td>
        <td class="text-primary">${formatDate(task.dueDate)}</td>
        <td>${generatePriorityBadge(task.priority)}</td>
        <td>${generateProgressBadge(task.progress)}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="openTaskModal(${task.id})">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDelete(${task.id})">Xóa</button>
        </td>
      </tr>
    `;
  });
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

function formatDate(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[1]}-${parts[2]}`; // MM-DD
  return dateStr;
}

function openTaskModal(taskId = null) {
  const modal = new bootstrap.Modal(document.getElementById("taskModal"));
  const modalTitle = document.getElementById("modalTitle");

  document.getElementById("taskForm").reset();
  resetFormErrors();
  document.getElementById("editTaskId").value = "";

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
      document.getElementById("editTaskId").value = task.id;
      modalTitle.textContent = "Sửa Nhiệm Vụ";
    }
  } else {
    modalTitle.textContent = "Thêm Nhiệm Vụ";
  }

  modal.show();
}

function resetFormErrors() {
  ["taskNameError", "assigneeIdError", "statusError", "asignDateError", "dueDateError", "priorityError", "progressError"]
    .forEach(id => document.getElementById(id).textContent = "");
}

function saveTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const assigneeId = document.getElementById("assigneeId").value.trim();
  const status = document.getElementById("status").value;
  const asignDate = document.getElementById("asignDate").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const progress = document.getElementById("progress").value;
  const editTaskId = document.getElementById("editTaskId").value;

  resetFormErrors();
  let valid = true;

  if (!taskName) { document.getElementById("taskNameError").textContent = "Tên nhiệm vụ không được để trống"; valid = false; }
  if (!assigneeId) { document.getElementById("assigneeIdError").textContent = "Người phụ trách không được để trống"; valid = false; }
  if (!status) { document.getElementById("statusError").textContent = "Vui lòng chọn trạng thái"; valid = false; }
  if (!asignDate) { document.getElementById("asignDateError").textContent = "Ngày giao không được để trống"; valid = false; }
  if (!dueDate) { document.getElementById("dueDateError").textContent = "Hạn chót không được để trống"; valid = false; }
  if (!priority) { document.getElementById("priorityError").textContent = "Vui lòng chọn độ ưu tiên"; valid = false; }
  if (!progress) { document.getElementById("progressError").textContent = "Vui lòng chọn tiến độ"; valid = false; }

  if (!valid) return;

  if (editTaskId) {
    const task = tasks.find(t => t.id == editTaskId);
    if (task) {
      task.taskName = taskName;
      task.assigneeId = assigneeId;
      task.status = status;
      task.asignDate = asignDate;
      task.dueDate = dueDate;
      task.priority = priority;
      task.progress = progress;
    }
  } else {
    const newTask = {
      id: Date.now(),
      taskName,
      assigneeId,
      status,
      asignDate,
      dueDate,
      priority,
      progress,
      projectId: currentProjectId
    };
    tasks.push(newTask);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("taskModal")).hide();
}

function confirmDelete(taskId) {
  deleteTaskId = taskId;
  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal"));
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

document.getElementById("sortSelect").classList.add("ms-2");
document.getElementById("sortSelect").addEventListener("change", renderTasks);
document.getElementById("searchTaskInput").addEventListener("input", renderTasks);

document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  location.href = "../pages/login.html";
});


renderTasks();
