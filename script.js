const todoToday = document.getElementById("tasks-for-today");
const todoLeftOver = document.getElementById("left-over-tasks");
const input = document.getElementById("task-add");
const button = document.getElementById("submit-button");
const todayList = document.getElementById("today-list");
const laterTodos = document.getElementById("left-over-list");

const todoFromStorage = JSON.parse(localStorage.getItem("todoToday"));
const laterFromStorage = JSON.parse(localStorage.getItem("todoLater"));

let todos = [];
let laterList = [];

if (todoFromStorage != null && todoFromStorage.length > 0) {
  todos = todoFromStorage;
  populateList("Today");
}

if (laterFromStorage != null && laterFromStorage.length > 0) {
  laterList = laterFromStorage;
  populateList("Later");
}

input.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    addTask();
  }
});

button.addEventListener("click", (event) => {
  addTask();
});

function addTask() {
  todos.push(input.value);
  populateList("Today");
  input.value = "";
  storeItems();
}

function moveTaskUp(task) {
  laterList.push(task);
  populateList("Today");
  populateList("Later");
}

function populateList(list) {
  console.log("Here");
  let toInsertList = [];
  let toInsertTodos = [];

  if (list == "Today") {
    toInsertList = todayList;
    toInsertTodos = todos;
  } else if (list == "Later") {
    toInsertList = laterTodos;
    toInsertTodos = laterList;
  } else {
    console.log("Error: Wrong List");
  }

  toInsertList.innerHTML = "";

  toInsertTodos.forEach((todo, index) => {
    const itemElement = document.createElement("li");
    itemElement.innerText = todo;
    const iconDiv = document.createElement("div");
    itemElement.appendChild(iconDiv);

    const deleteButton = document.createElement("i");
    deleteButton.classList.add("delete-button");
    deleteButton.classList.add("fa-solid");
    deleteButton.classList.add("fa-trash");
    deleteButton.classList.add("item-icon");

    const upIcon = document.createElement("i");
    upIcon.classList.add("fa-solid");
    upIcon.classList.add("fa-up-long");
    upIcon.classList.add("item-icon");

    deleteButton.addEventListener("click", (event) => {
      removeItem(index, list);
      storeItems();
      populateList("Today");
      populateList("Later");
    });

    upIcon.addEventListener("click", (event) => {
      removeItem(index, "Today");
      moveTaskUp(todo);
      storeItems();
    });

    iconDiv.appendChild(upIcon);
    iconDiv.appendChild(deleteButton);
    toInsertList.appendChild(itemElement);
  });
}

function removeItem(i, list) {
  let tempTodo = [];

  if (list == "Today") {
    todos.forEach((item, index) => {
      if (index != i) {
        tempTodo.push(item);
      }
    });
    todos = tempTodo;
  } else if (list == "Later") {
    laterList.forEach((item, index) => {
      if (index != i) {
        tempTodo.push(item);
      }
    });
    laterList = tempTodo;
  }
}

function storeItems() {
  localStorage.setItem("todoToday", JSON.stringify(todos));
  localStorage.setItem("todoLater", JSON.stringify(laterList));
}
