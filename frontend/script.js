document.addEventListener("DOMContentLoaded", init);

let tasks = [];
let currentFilter = "all";
let confettiTriggered = false;

function init() {
    loadTasks();

    document.getElementById("task-form")
        .addEventListener("submit", addTask);

    document.querySelectorAll(".filters button")
        .forEach(btn => btn.addEventListener("click", changeFilter));
}

// 🔹 LOAD TASKS FROM BACKEND
async function loadTasks() {
    const res = await fetch("http://localhost:3000/tasks");
    tasks = await res.json();
    renderTasks();
}

// 🔹 ADD TASK
async function addTask(e) {
    e.preventDefault();

    const text = document.getElementById("task-input").value.trim();
    const dueDate = document.getElementById("due-date").value;

    if (!text) return;

    await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, dueDate })
    });

    e.target.reset();
    loadTasks();
}

// 🔹 RENDER TASKS
function renderTasks() {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="task-left">
                <span class="${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
                ${task.dueDate ? `<small>Due: ${task.dueDate}</small>` : ""}
            </div>

            <div class="task-actions">
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})">

                <span class="edit-btn ${task.completed ? 'disabled' : ''}"
                    onclick="${task.completed ? '' : `editTask(${task.id})`}">
                    <i class="fa-solid fa-file-pen"></i>
                </span>

                <button onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        list.appendChild(li);
    });

    updateProgress();
}

// 🔹 TOGGLE TASK (FRONTEND ONLY FOR NOW)
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

// 🔹 DELETE TASK (FRONTEND ONLY FOR NOW)
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

// 🔹 EDIT TASK
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;

    document.getElementById("task-input").value = task.text;
    document.getElementById("due-date").value = task.dueDate || "";

    deleteTask(id);
}

// 🔹 FILTER
function changeFilter(e) {
    document.querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");

    currentFilter = e.target.dataset.filter;
    renderTasks();
}

// 🔹 PROGRESS
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById("numbers").textContent = `${completed} / ${total}`;
    document.getElementById("progress").style.width =
        total ? `${(completed / total) * 100}%` : "0%";

    if (total > 0 && completed === total && !confettiTriggered) {
        triggerConfetti();
        confettiTriggered = true;
    }

    if (completed !== total) {
        confettiTriggered = false;
    }
}

// 🔹 CONFETTI
function triggerConfetti() {
    if (typeof confetti !== "function") return;

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
        confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
    }, 250);
}