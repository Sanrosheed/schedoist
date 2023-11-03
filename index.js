// UTILITY FUNCTIONS
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// CRUD FUNCTIONS

// CREATE TO DO FUNCTION

/*
1. Get todo from user input
2. Add todo to local storage
*/

const DB_NAME = "todo_db";

const createTodo = () => {
  const todoInput = document.querySelector("#todo-input");
  const formMessageSpan = document.querySelector("#form-message");
  if (!todoInput.value) {
    const formMessageSpan = document.querySelector("#form-message");
    formMessageSpan.innerHTML = "Please enter a todo title";
    formMessageSpan.classList.remove("hidden");
    formMessageSpan.classList.add("text-xs", "text-red-400");

    setTimeout(() => {
      formMessageSpan.classList.add("hidden");
    }, 5000);

    return;
  }

  const newTodo = {
    id: uuid(),
    title: todoInput.value,
    created_at: Date.now(),
  };

  //   check for ls
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];

  //   add new todo db array
  const new_todo_db = [...todo_db, newTodo];

  //   add to local storage
  localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
  fetchTodos();
  todoInput.value = "";
};

// READ TO DO FUNCTION
const fetchTodos = () => {
  const todoListContainer = document.querySelector("#todo-lists-container");
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const noTodo = todo_db.length === 0;
  if (noTodo) {
    todoListContainer.innerHTML = `<p class="text-center text-[#EBDAC0] font-bold">Your todos will appear here...</p>`;
    return;
  }

  const todos = todo_db
    ?.sort((a, b) =>
      a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
    )
    ?.map((todo) => {
      return `
      <div
          class="group flex justify-between py-3 px-2.5 rounded-lg hover:bg-slate-50"
        >
          <!-- Title, action [edit, delete, view] -->
          <a href="#"><h3>${todo.title}</h3></a>
          <section class="gap-4 hidden group-hover:flex">
            <button onclick="handleEditMode('${todo.id}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
            <button onclick="deleteTodo('${todo.id}')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </section>
        </div>
      
      `;
    });
  todoListContainer.innerHTML = todos?.join("");
};

// UPDATE TO DO FUNCTION

const handleEditMode = (id) => {
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const todo_to_update = todo_db.find((todo) => todo.id === id);

  if (!todo_to_update) {
    return;
  }

  const todoInput = document.querySelector("#todo-input");
  todoInput.value = todo_to_update.title;
};

// DELETE TO DO FUNCTION
const deleteTodo = (id) => {
  Swal.fire({
    title: "Delete Todo",
    text: "Do you want to delete this todo?",
    icon: "warning",
    confirmButtonText: "Yes!",
    showCancelButton: true,
  }).then((res) => {
    if (res.isConfirmed) {
      console.log(id);
      //   Get todo ls
      const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
      // filter out todos that doesn't match the id
      const new_todo_db = todo_db.filter((todo) => todo.id !== id);
      // set the new todos without the todo that matches the id to the ls
      localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
      fetchTodos();
    } else {
      return;
    }
  });
};

fetchTodos();
