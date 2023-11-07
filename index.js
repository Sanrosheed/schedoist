const DB_NAME = "todo_db";
const todoInput = document.querySelector("#todo-input");
const updateTodoBtn = document.querySelector("#update_todo_btn");

const createTodo = () => {
  try {
    if (!todoInput.value) {
      return showMessage("Please provide a todo title");
    }

    const newTodo = {
      id: uuid(),
      title: todoInput.value,
      created_at: Date.now(),
    };

    //   check for ls
    // const todo_db = getDb();
    const todo_db = getDb(DB_NAME);

    //   add new todo db array
    const new_todo_db = [...todo_db, newTodo];

    //   add to local storage
    setDb(DB_NAME, new_todo_db);
    fetchTodos();
    resetFormInput();
  } catch (error) {
    showMessage(error.message);
  }
};

// READ TO DO FUNCTION
const fetchTodos = () => {
  const todoListContainer = document.querySelector("#todo-lists-container");
  const todo_db = getDb(DB_NAME);
  const noTodo = todo_db.length === 0;
  if (noTodo) {
    todoListContainer.innerHTML = `<p class="text-center text-[#EBDAC0] font-bold">Your todos will appear here...</p>`;
    return;
  }

  const sortedTodos = sortedTodosByCreated_At(todo_db);
  const todos = sortedTodos.map((todo) => {
    return `
      <div
          class="group flex justify-between py-3 px-2.5 rounded-lg hover:bg-slate-50"
        >
          <!-- Title, action [edit, delete, view] -->
          <button onclick = "handlePreviewTodo('${todo.id}')"><h3>${todo.title}</h3></button>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
  const todo_db = getDb(DB_NAME);
  const todo_to_update = todo_db.find((todo) => todo.id === id);

  if (!todo_to_update) {
    return;
  }

  todoInput.value = todo_to_update.title;

  updateTodoBtn.classList.remove("hidden"); // show update todo button
  updateTodoBtn.setAttribute("todo_id_to_update", id);

  const addTodoBtn = document.querySelector("#add_todo_btn");
  addTodoBtn.classList.add("hidden"); // hide add todo button
};

const updateTodo = () => {
  if (!todoInput.value) {
    return showMessage("Todo title cannot be empty");
  }

  const todo_id_to_update = updateTodoBtn.getAttribute("todo_id_to_update");
  const todo_db = getDb(DB_NAME);
  const updated_todo_db = todo_db.map((todo) => {
    if (todo.id === todo_id_to_update) {
      return { ...todo, title: todoInput.value };
    } else {
      return todo;
    }
  });

  setDb(DB_NAME, updated_todo_db);
  fetchTodos();

  resetFormInput();
  updateTodoBtn.classList.add("hidden"); // hide update todo button
  const addTodoBtn = document.querySelector("#add_todo_btn");
  addTodoBtn.classList.remove("hidden"); // show add todo button
};

// DELETE TO DO FUNCTION
const deleteTodo = (id) => {
  const handleDelete = () => {
    //   Get todo ls
    const todo_db = getDb(DB_NAME);
    // filter out todos that doesn't match the id
    const new_todo_db = todo_db.filter((todo) => todo.id !== id);
    // set the new todos without the todo that matches the id to the ls
    setDb(DB_NAME, new_todo_db);
    fetchTodos();
  };
  showConfirmModal({
    title: "Delete Todo",
    text: "Do you want to delete this todo?",
    icon: "warning",
    confirmButtonText: "Yes!",
    showCancelButton: true,
    cb: handleDelete,
  });
};

fetchTodos();
