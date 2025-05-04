// The different elements brought in from the HTML using their specific ID
const input = document.getElementById("task-add");
const submitButton = document.getElementById("submit-button");

const todayUlElement = document.getElementById("today-list");
const laterUlElement = document.getElementById("later-list");
const doneUlElement = document.getElementById("done-list");

const switchModesButton = document.getElementById("switch-modes-button");

const mainLists = document.getElementById("main-lists");
const doneLists = document.getElementById("done-lists");

// GLOBAL VARIABLES
let todayTaskList = [];
let laterTaskList = [];
let doneTaskList = [];

const animationTime = 900;

function startUpScript() {
  // Retrive stored data that is stored on the local computer's webbrowser
  const todaysTasksFromStorage = JSON.parse(
    localStorage.getItem("todaysTasks")
  );

  const latersTasksFromStorage = JSON.parse(
    localStorage.getItem("latersTasks")
  );

  const doneTasksFromStorage = JSON.parse(localStorage.getItem("doneTasks"));

  // Checks to see if either list is stored in local storage
  if (isStoredListValid(todaysTasksFromStorage)) {
    todayTaskList = todaysTasksFromStorage;
  }

  if (isStoredListValid(latersTasksFromStorage)) {
    laterTaskList = latersTasksFromStorage;
  }

  if (isStoredListValid(doneTasksFromStorage)) {
    doneTaskList = doneTasksFromStorage;
  }

  // Populates all the task lists if there is any valid data in local storage
  populateAllLists();

  // Whenever the enter key is press, add a task
  input.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      addTask();
    }
  });

  input.focus();

  // If the submit button is clicked, add the task.
  submitButton.addEventListener("click", (event) => {
    addTask();
  });

  switchModesButton.addEventListener("click", (event) => {
    mainLists.classList.toggle("hide");
    doneLists.classList.toggle("hide");
  });
}

// Checks to see if there is valid data obtained from local storage
function isStoredListValid(storedList) {
  // Check to see if the list is null...
  const condition1 = storedList != null;

  // If it is, make sure not to proceed as not not throw a null object error
  if (!condition1) {
    return false;
  }

  // The next condition is to make sure if it has a length, it is greater than 0
  const condition2 = storedList.length > 0;

  // Only return true when both conditions are true.
  return condition1 && condition2;
}

// Adds a task to the today list
function addTask() {
  const task = input.value;
  if (task == "") {
    return;
  }

  // Push the task to the today task list array
  todayTaskList.push(task);

  // The only thing that could have changed is the Today list
  populateList("Today");

  // Return the input element to its intiial value
  //input.value = "";
  const textLength = input.value.length;
  input.value.split("").forEach((str, index) => {
    setTimeout(() => {
      input.value = input.value.slice(1, input.value.length);
    }, (135 / textLength) * index);
  });

  // Updates local storage
  storeItems();
}

// Populates both the today list and the later list for now
function populateAllLists() {
  populateList("Today");
  populateList("Later");
  populateList("Done");
}

// Given a task it moves it to opposite list
function moveTaskToList(task, list) {
  // If the task comes from the "Today" list, mmove it to the later
  if (list == "Today") {
    laterTaskList.push(task);
  } else if (list == "Later") {
    // Or do the exact opposite
    todayTaskList.push(task);
  } else if (list == "Done") {
    doneTaskList.push(task);
  }
}

// Populates a specific list
function populateList(list) {
  // These are the common variables
  let toInsertList = [];
  let toInsertTodos = [];
  let listIconClassname = "";

  // Sets the correct list and appropriate variables
  if (list == "Today") {
    toInsertList = todayUlElement;
    toInsertTodos = todayTaskList;
    listIconClassname = "fa-up-long";
  } else if (list == "Later") {
    toInsertList = laterUlElement;
    toInsertTodos = laterTaskList;
    listIconClassname = "fa-down-long";
  } else if (list == "Done") {
    toInsertList = doneUlElement;
    toInsertTodos = doneTaskList;
    listIconClassname = "";
  } else {
    console.log("Error: Wrong List");
  }

  // Return the list elements DOM back to its blank state.
  toInsertList.innerHTML = ``;

  // Loop through the task list array with the item and an index.
  toInsertTodos.forEach((todo, index) => {
    // Create both the container and inner container elements
    const itemElement = document.createElement("li");
    itemElement.innerText = todo;
    const iconDiv = document.createElement("div");
    itemElement.appendChild(iconDiv);

    // Create the delet button with the right classes
    const deleteButton = document.createElement("i");
    deleteButton.classList.add("delete-button");
    deleteButton.classList.add("fa-solid");
    deleteButton.classList.add("fa-trash");
    deleteButton.classList.add("item-icon");

    // Create the move icon with the right classes
    const moveIcon = document.createElement("i");
    const checkIcon = document.createElement("i");
    if (list == "Today" || list == "Later") {
      moveIcon.classList.add("fa-solid");
      moveIcon.classList.add(listIconClassname);
      moveIcon.classList.add("item-icon");

      checkIcon.classList.add("fa-solid");
      checkIcon.classList.add("fa-square-check");
      checkIcon.classList.add("item-icon");
    }

    // Add an event listener waiting for the user to click to the delete icon
    deleteButton.addEventListener("click", (event) => {
      // Remove the item, update local storage, and update both lists
      itemElement.classList.add("delete");
      setTimeout(() => {
        removeItem(index, list);
        storeItems();
        populateAllLists();
      }, animationTime);
    });

    // Listen for the click event from the move icon
    moveIcon.addEventListener("click", (event) => {
      // Move the item to the other listt, remove it from its current list, and update local storage.
      itemElement.classList.add("change-list");
      setTimeout(() => {
        moveTaskToList(todo, list);
        removeItem(index, list);
        storeItems();
        // Then populate all lists
        populateAllLists();
      }, animationTime);
    });

    checkIcon.addEventListener("click", (event) => {
      moveTaskToList(todo, "Done");
      removeItem(index, list);
      storeItems();
      populateAllLists();
    });

    // Append both icons within the icon list.
    iconDiv.appendChild(checkIcon);
    iconDiv.appendChild(moveIcon);
    iconDiv.appendChild(deleteButton);

    // Add the new task to the appropriate list.
    toInsertList.appendChild(itemElement);
  });
}

// Given the index remove it from the passed in list
function removeItem(i, list) {
  // Temporarily holds the data from the passed in list
  let tempTodo = [];

  let taskList = [];

  // Updates the today list without the removed element.
  // todayTaskList = tempTodo;
  // Loop through the today task list and unless it is the passed on
  // i, add it to the temporary storage array.

  if (list == "Today") {
    taskList = todayTaskList;
  } else if (list == "Later") {
    taskList = laterTaskList;
  } else if (list == "Done") {
    taskList = doneTaskList;
  }
  // laterTaskList.forEach((item, index) => {
  //   // Exact same functionality as the "Today" list
  //   if (index != i) {
  //     tempTodo.push(item);
  //   }
  // });
  taskList.forEach((item, index) => {
    if (index != i) {
      tempTodo.push(item);
    }
  });

  // Updates the later list without the removed element.
  if (list == "Today") {
    todayTaskList = tempTodo;
  } else if (list == "Later") {
    laterTaskList = tempTodo;
  } else if (list == "Done") {
    doneTaskList = tempTodo;
  }
}

// Update local storage for both lists with the correctly formated task list
function storeItems() {
  localStorage.setItem("todaysTasks", JSON.stringify(todayTaskList));
  localStorage.setItem("latersTasks", JSON.stringify(laterTaskList));
  localStorage.setItem("doneTasks", JSON.stringify(doneTaskList));
}

// Run the startup script
startUpScript();
