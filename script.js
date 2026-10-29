const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");
const counterEl = document.querySelector(".counter");

const STORAGE_KEY = "todo-tasks";
let count = 0;

// ----- helpers -----

function saveTasks() {
  const tasks = [...taskList.querySelectorAll("li")].map((li) => ({
    text: li.querySelector(".task-text").textContent,
    note: li.querySelector(".note-input").value,
    completed: li.classList.contains("completed"),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateCount() {
  count = taskList.querySelectorAll("li").length;
  taskCount.textContent = count;
  counterEl.classList.remove("bump");
  void counterEl.offsetWidth; // restart the animation
  counterEl.classList.add("bump");
  emptyState.classList.toggle("visible", count === 0);
}

function createTaskItem(text, note = "", completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed", checkbox.checked);
    saveTasks();
  });

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = text;

  const noteInput = document.createElement("input");
  noteInput.className = "note-input";
  noteInput.type = "text";
  noteInput.placeholder = "ملاحظة...";
  noteInput.value = note;
  noteInput.addEventListener("input", saveTasks);

  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";
  delBtn.textContent = "حذف";
  delBtn.addEventListener("click", () => {
    li.classList.add("removing");
    li.addEventListener("transitionend", () => {
      li.remove();
      updateCount();
      saveTasks();
    }, { once: true });
  });

  li.append(checkbox, textSpan, noteInput, delBtn);
  return li;
}

// ----- add task -----

addBtn.addEventListener("click", () => {
  const task = taskInput.value.trim();

  // validation: stop early if the input is empty
  if (task === "") {
    message.textContent = "من فضلك اكتب مهمة";
    return;
  }

  message.textContent = "";

  const li = createTaskItem(task);
  taskList.appendChild(li);

  updateCount();
  saveTasks();
  taskInput.value = "";
  taskInput.focus();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

// ----- load saved tasks on page open -----

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  saved.forEach((t) => taskList.appendChild(createTaskItem(t.text, t.note, t.completed)));
  updateCount();
}

loadTasks();
