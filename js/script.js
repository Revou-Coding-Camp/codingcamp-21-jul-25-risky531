const form = document.querySelector("#todo-form");
const taskList = document.querySelector("#task-list");
const deleteAllBtn = document.querySelector("#delete-all");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

// Submit Form Handler
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskInput = form.querySelector('input[name="task"]');
  const dateInput = form.querySelector('input[name="date"]');

  // === 🔒 Form Validation ===
  if (!taskInput.value.trim()) {
    alert("Task name cannot be empty.");
    taskInput.focus();
    return;
  }
if (!dateInput.value) {
  alert("Date cannot be empty.");
  dateInput.focus();
  return;
}
  tasks.push({
    task: taskInput.value.trim(),
    date: dateInput.value,
    completed: false,
  });

  taskInput.value = "";
  dateInput.value = "";

  renderTasks();
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return false;
  });

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center border-b pb-2 w-full bg-white rounded-md px-4 py-2 shadow";

    const left = document.createElement("div");
    left.className = "flex items-center gap-2";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = `${item.task} ${item.date ? `(${item.date})` : ""}`;
    if (item.completed) {
      text.classList.add("line-through", "text-gray-400");
    }

    left.appendChild(checkbox);
    left.appendChild(text);

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex space-x-2 flex-shrink-0";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600";
    deleteBtn.onclick = () => deleteTask(index);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(btnGroup);

    taskList.appendChild(li);
  });
}
let editIndex = null;

function editTask(index) {
  editIndex = index;
  const task = tasks[index];

  // Set value pada modal
  document.getElementById("editTaskInput").value = task.task;
  document.getElementById("editDateInput").value = task.date;

  // Tampilkan modal
  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

function saveEdit() {
  const newTask = document.getElementById("editTaskInput").value.trim();
  const newDate = document.getElementById("editDateInput").value;

  if (!newTask) {
    alert("Task name cannot be empty!");
    return;
  }

  if (!newDate) {
    alert("Please choose a valid date!");
    return;
  }

  tasks[editIndex].task = newTask;
  tasks[editIndex].date = newDate;

  renderTasks();
  closeEditModal();
}

// Edit Task
function editTask(index) {
  const newTask = prompt("Edit task name:", tasks[index].task);
  const newDate = prompt("Edit date (YYYY-MM-DD):", tasks[index].date);

  // Validasi input
  if (newTask === null || newDate === null) return;

  if (!newTask.trim()) {
    alert("Task name cannot be empty.");
    return;
  }

  const parsedDate = new Date(newDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate) || isNaN(parsedDate.getTime())) {
    alert("Invalid date format. Please use YYYY-MM-DD.");
    return;
  }

  // Update jika valid
  tasks[index].task = newTask.trim();
  tasks[index].date = newDate;
  renderTasks();
}

// Delete All
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
});

// Filter Buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});
