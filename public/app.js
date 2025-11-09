const API_URL = "/api/tasks";
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const formMessage = document.getElementById("form-message");
const refreshButton = document.getElementById("refresh");
const list = document.getElementById("tasks");
const emptyState = document.getElementById("tasks-empty");
const template = document.getElementById("task-template");

const STATUS_LABELS = {
  pending: "Pendiente",
  in_progress: "En progreso",
  done: "Completada",
};

const NEXT_ACTIONS = {
  pending: [
    { label: "Iniciar", status: "in_progress" },
    { label: "Completar", status: "done" },
  ],
  in_progress: [
    { label: "Completar", status: "done" },
  ],
  done: [],
};

async function request(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      const message = error?.error || `Error ${res.status}`;
      throw new Error(message);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function loadTasks() {
  toggleLoading(true);
  try {
    const tasks = await request(API_URL);
    renderTasks(tasks);
  } catch (error) {
    showFormMessage(error.message || "No se pudieron cargar las tareas", true);
  } finally {
    toggleLoading(false);
  }
}

function renderTasks(tasks) {
  list.innerHTML = "";
  const hasTasks = tasks.length > 0;
  emptyState.style.display = hasTasks ? "none" : "block";

  if (!hasTasks) {
    return;
  }

  for (const task of tasks) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".task-title").textContent = task.title;
    node.querySelector(".task-description").textContent = task.description || "Sin descripción";
    node.querySelector(".created-at").textContent = formatDate(task.created_at);
    node.querySelector(".updated-at").textContent = formatDate(task.updated_at);

    const statusEl = node.querySelector(".status");
    statusEl.dataset.status = task.status;
    statusEl.textContent = STATUS_LABELS[task.status] || task.status;

    const buttonsContainer = node.querySelector(".buttons");
    const actions = NEXT_ACTIONS[task.status] ?? [];
    if (actions.length === 0) {
      const span = document.createElement("span");
      span.className = "empty";
      span.textContent = "Sin acciones disponibles";
      buttonsContainer.appendChild(span);
    } else {
      for (const action of actions) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action.label;
        button.addEventListener("click", () => updateStatus(task.id, action.status));
        buttonsContainer.appendChild(button);
      }
    }

    list.appendChild(node);
  }
}

function formatDate(value) {
  if (!value) return "-";
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat("es-BO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch (error) {
    return value;
  }
}

function toggleLoading(isLoading) {
  refreshButton.disabled = isLoading;
  refreshButton.textContent = isLoading ? "Actualizando..." : "Actualizar";
}

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.className = isError ? "error" : "success";
  if (message) {
    setTimeout(() => {
      formMessage.textContent = "";
      formMessage.className = "";
    }, 3500);
  }
}

async function updateStatus(id, status) {
  try {
    await request(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    await loadTasks();
    showFormMessage("Estado actualizado", false);
  } catch (error) {
    showFormMessage(error.message || "No se pudo actualizar el estado", true);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
  };

  if (!data.title) {
    showFormMessage("El título es obligatorio", true);
    return;
  }

  try {
    await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    form.reset();
    titleInput.focus();
    showFormMessage("Tarea creada correctamente");
    await loadTasks();
  } catch (error) {
    showFormMessage(error.message || "No se pudo crear la tarea", true);
  }
});

refreshButton.addEventListener("click", () => loadTasks());

loadTasks();
