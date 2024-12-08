let activeTasks = JSON.parse(localStorage.getItem('activeTasks')) || [
    { id: 10, title: "Active Task 1", date: Date.now() - 1000000, completed: false },
    { id: 11, title: "Active Task 2", date: Date.now() - 500000, completed: false },
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks));
}

function renderTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = ""; 
    tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `<h3>${task.title}</h3><input type="checkbox" data-id="${task.id}">`;
        tasksContainer.appendChild(taskDiv);

        const separator = document.createElement("hr");
        separator.classList.add("task-separator");
        tasksContainer.appendChild(separator);
    });

    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            restoreBtn.classList.toggle("hidden", !isAnyTaskSelected());
        });
    });
}

function renderActiveTasks() {
    const activeTasksContainer = document.getElementById("active-tasks-container");
    activeTasksContainer.innerHTML = ""; 
    activeTasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("active-task");
        taskDiv.innerHTML = `<h3>${task.title}</h3><button data-id="${task.id}">Excluir</button>`;
        activeTasksContainer.appendChild(taskDiv);

        const separator = document.createElement("hr");
        separator.classList.add("task-separator");
        activeTasksContainer.appendChild(separator);
    });

    const deleteButtons = document.querySelectorAll("button[data-id]");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function() {
            const taskId = parseInt(button.getAttribute('data-id'));
            moveToTrash(taskId); 
        });
    });
}

function moveToTrash(taskId) {
    const taskToDelete = activeTasks.find(task => task.id === taskId);

    if (taskToDelete) {
        tasks.push(taskToDelete);
        activeTasks = activeTasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        renderActiveTasks();
        alert("Task movida para a lixeira!");
    }
}

function sortByRecent() {
    tasks.sort((a, b) => b.date - a.date);
    renderTasks();
}

function sortByOldest() {
    tasks.sort((a, b) => a.date - b.date);
    renderTasks();
}

function isAnyTaskSelected() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    return [...checkboxes].some(checkbox => checkbox.checked);
}

const restoreBtn = document.getElementById("restore-btn");
restoreBtn.addEventListener("click", function() {
    const selectedTasks = document.querySelectorAll("input[type='checkbox']:checked");
    if (selectedTasks.length > 0) {
        document.getElementById("modal").classList.remove("hidden");
    }
});

document.getElementById("confirm-yes").addEventListener("click", function() {
    const selectedTasks = document.querySelectorAll("input[type='checkbox']:checked");
    selectedTasks.forEach(checkbox => {
        const taskId = parseInt(checkbox.getAttribute('data-id'));
        const restoredTask = tasks.find(task => task.id === taskId);

        if (restoredTask) {
            activeTasks.push(restoredTask);
            tasks = tasks.filter(task => task.id !== taskId); 
        }
    });

    saveTasks(); 
    renderTasks();  
    restoreBtn.classList.add("hidden"); 
    closeModal(); 
    alert("Task(s) restaurada(s)!");
});

document.getElementById("confirm-no").addEventListener("click", function() {
    closeModal();
});

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

document.getElementById("options-btn").addEventListener("click", function() {
    const dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("hidden");
    dropdown.classList.toggle("show"); 
});

document.querySelectorAll("#dropdown button").forEach(button => {
    button.addEventListener("click", function() {
        if (button.innerText.includes("recentes")) {
            sortByRecent();
        } else {
            sortByOldest();
        }
        closeModal();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
    renderActiveTasks();
});
