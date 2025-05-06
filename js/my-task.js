//----------Kiểm tra đăng nhập----------//
if (localStorage.getItem("isLoggedIn") !== "true") {
    location.href = "../pages/login.html";
  }
  //----------Dữ liệu đầu----------//
  const currentUserId = parseInt(localStorage.getItem("currentUserId"));
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  //----------Hàm format----------//
  function formatDate(dateStr) {
    const parts = dateStr.split("-");
    return parts.length === 3 ? `${parts[1]}-${parts[2]}` : dateStr;
  }
  
  function generatePriorityBadge(priority) {
    if (priority === "Cao") return '<span class="badge bg-danger">Cao</span>';
    if (priority === "Trung bình") return '<span class="badge bg-warning text-dark">Trung bình</span>';
    return '<span class="badge bg-success">Thấp</span>';
  }
  
  function generateProgressBadge(progress) {
    if (progress === "Trì hoãn") return '<span class="badge bg-danger">Trì hoãn</span>';
    if (progress === "Có rủi ro") return '<span class="badge bg-warning text-dark">Có rủi ro</span>';
    return '<span class="badge bg-success">Đúng tiến độ</span>';
  }
  
  //----------Hiển thị danh sách----------//
  function renderMyTasks() {
    const table = document.getElementById("taskTable");
    const keyword = document.getElementById("searchTaskInput").value.toLowerCase();
    const sort = document.getElementById("sortSelect").value;
  
    let myTasks = tasks.filter(t => t.assigneeId === currentUserId);
  
    if (keyword) {
      myTasks = myTasks.filter(t => t.taskName.toLowerCase().includes(keyword));
    }
  
    const priorityOrder = { "Thấp": 1, "Trung bình": 2, "Cao": 3 };
    if (sort === "dueDate-asc") {
      myTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (sort === "priority-desc") {
      myTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
  
    const grouped = {};
    myTasks.forEach(task => {
      if (!grouped[task.projectId]) grouped[task.projectId] = [];
      grouped[task.projectId].push(task);
    });
  
    table.innerHTML = "";
    let index = 0;
  
    Object.entries(grouped).forEach(([projectId, projectTasks]) => {
      const project = projects.find(p => p.id == projectId);
      const collapseId = `collapseProject${index}`;
      const headingId = `headingProject${index}`;
      const projectName = project ? project.projectName : "Dự án không xác định";
  
      table.innerHTML += `
        <tr>
          <td colspan="6" class="p-0 border-0">
            <div class="accordion mb-3 shadow-sm" id="accordion-${index}">
              <div class="accordion-item">
                <h2 class="accordion-header" id="${headingId}">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#${collapseId}" aria-expanded="true" aria-controls="${collapseId}">
                    ${projectName}
                  </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse show" aria-labelledby="${headingId}">
                  <div class="accordion-body p-0">
                    <table class="table table-bordered table-hover m-0 text-center align-middle">
                      <thead class="table-dark">
                        <tr>
                          <th>Tên Nhiệm Vụ</th>
                          <th>Độ ưu tiên</th>
                          <th>Trạng thái</th>
                          <th>Ngày bắt đầu</th>
                          <th>Hạn chót</th>
                          <th>Tiến độ</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${projectTasks.map(task => `
                          <tr>
                            <td>${task.taskName}</td>
                            <td>${generatePriorityBadge(task.priority)}</td>
                            <td>${task.status} 
                              <i class="fa-regular fa-pen-to-square text-primary" style="cursor:pointer;" 
                                 onclick="openStatusModal(${task.id})"></i>
                            </td>
                            <td>${formatDate(task.assignDate)}</td>
                            <td>${formatDate(task.dueDate)}</td>
                            <td>${generateProgressBadge(task.progress)}</td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>`;
      index++;
    });
  
    if (Object.keys(grouped).length === 0) {
      table.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Không có nhiệm vụ nào.</td></tr>`;
    }
  }
  
  //----------Bắt sự kiện----------//
  document.getElementById("searchTaskInput").addEventListener("input", renderMyTasks);
  document.getElementById("sortSelect").addEventListener("change", renderMyTasks);
  
  //----------Modal cập nhật trạng thái----------//
  let taskIdToUpdate = null;
  function openStatusModal(taskId) {
    taskIdToUpdate = taskId;
    const modal = new bootstrap.Modal(document.getElementById("statusConfirmModal"));
    modal.show();
  }
  
  document.getElementById("confirmStatusBtn").addEventListener("click", () => {
    const task = tasks.find(t => t.id === taskIdToUpdate);
    if (task) {
      task.status = (task.status === "In progress") ? "Pending" : "In progress";
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderMyTasks();
    }
    bootstrap.Modal.getOrCreateInstance(document.getElementById("statusConfirmModal")).hide();
  });
  
  //----------Gọi hàm render----------//
  renderMyTasks();
  