function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const resetFormInput = () => {
  const todoInput = document.querySelector("#todo-input");
  todoInput.value = "";
};

const showMessage = (title) => {
  const formMessageSpan = document.querySelector("#form-message");
  formMessageSpan.innerHTML = title;
  formMessageSpan.classList.remove("hidden");
  formMessageSpan.classList.add("text-xs", "text-red-400");

  setTimeout(() => {
    formMessageSpan.classList.add("hidden");
  }, 5000);
};

// Local Storage
const getDb = (DB_NAME) => {
  if (!DB_NAME) {
    throw new Error("DB_NAME is missing");
  }
  return JSON.parse(localStorage.getItem(DB_NAME)) || [];
};

const setDb = (DB_NAME, newData) => {
  if (!DB_NAME) {
    throw new Error("DB_NAME is missing...");
  }

  if (!newData) {
    throw new Error("Data is missing...");
  }

  localStorage.setItem(DB_NAME, JSON.stringify(newData));
};

const sortedTodosByCreated_At = (todos) => {
  return todos.sort((a, b) =>
    a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
  );
};

const showConfirmModal = ({
  title,
  text,
  icon,
  confirmButtonText,
  showCancelButton = false,
  cb,
}) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    showCancelButton,
  }).then((res) => {
    if (res.isConfirmed) {
      if (cb) {
        cb();
      }
    }
  });
};

const handlePreviewTodo = (id) => {
  setDb("current_preview_todo_id", id);
  window.location.href = "/preview-todo.html";
};
