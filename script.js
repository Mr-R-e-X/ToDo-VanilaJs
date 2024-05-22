let todayList = document.querySelector("#today-item ol"); // list of today items div
let futureList = document.querySelector("#future-item ol"); // list of future items div
let completedList = document.querySelector("#complete-item ol"); // list of completed items div
let todo = document.querySelector("#todo"); // todo input
let todoDate = document.querySelector("#date"); // date input
let priority = document.querySelector("#priority"); // priority input
let submit = document.querySelector("#submit"); // submit button
let todoList = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : []; //list of todo items to display

//EMPTY ARRAY CHECK
function checkEmptyArray(obj) {
  return obj.length === 0;
}

//TODO ITEM CHECKER FUNCTION
function checkTodoList(todoList) {
  let dd = new Date().getDate();
  let mm = new Date().getMonth() + 1;
  let yyyy = new Date().getFullYear();
  let todayDate = `${dd < 10 ? `0${dd}` : `${dd}`}/${
    mm < 10 ? `0${mm}` : `${mm}`
  }/${yyyy}`;
  if (!checkEmptyArray(todoList)) {
    Itrate(todoList, todayDate);
  } else {
    todayList.innerHTML = "";
    futureList.innerHTML = "";
    completedList.innerHTML = "";
    updateEmptyState();
  }
}

function Itrate(todoList, todayDate) {
  todayList.innerHTML = "";
  futureList.innerHTML = "";
  completedList.innerHTML = "";
  todoList.map((item, index) => {
    updateUI(item, index, todayDate, index);
  });
}

//TODO FUNCTIONALITIES

function completeTodo(todo) {
  let timeOfCmplt = new Date().toLocaleTimeString();
  let dd = new Date().getDate();
  let mm = new Date().getMonth() + 1;
  let yyyy = new Date().getFullYear();
  let completedTime = `${dd < 10 ? `0${dd}` : `${dd}`}/${
    mm < 10 ? `0${mm}` : `${mm}`
  }/${yyyy} at ${timeOfCmplt}`;
  let index = parseInt(
    todo.parentElement.parentElement.parentElement.getAttribute("data-index"),
    10
  );
  console.log(index);
  todoList[index].status = "completed";
  todoList[index].fulfilled = completedTime;
  localStorage.setItem("todoList", JSON.stringify(todoList));
  checkTodoList(todoList);
  updateEmptyState();
}
function deleteTodo(todo) {
  let index = parseInt(
    todo.parentElement.parentElement.parentElement.getAttribute("data-index"),
    10
  );
  todoList = todoList.filter((item, idx) => idx !== index);
  checkTodoList(todoList);
  updateEmptyState();
  localStorage.setItem("todoList", JSON.stringify(todoList));
}
function addTodo(event) {
  event.preventDefault();
  console.log("clikced");
  let todoItem = todo.value;
  let todoItemdate = date.value.split("-").reverse().join("/");
  console.log("added", todoItemdate);
  let selectedPriority = priority.value;
  selectedPriority === "Priority"
    ? (selectedPriority = "low")
    : (selectedPriority = priority.value);
  let todoObj = {
    todo: todoItem,
    date: todoItemdate,
    priority: selectedPriority,
    status: "pending",
  };
  if (checkEmptyArray(todoList)) {
    todoList.push(todoObj);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    checkTodoList(todoList);
  } else {
    todoList.push(todoObj);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    checkTodoList(todoList);
  }
}

//UPDATE UI FUNCTIONS
function updateUI(item, index, todayDate, index) {
  let { todo, date, priority, status, fulfilled } = item;

  if (date === todayDate && status === "pending") {
    todayList.innerHTML += ui(todo, date, priority, status, fulfilled, index);
    updateEmptyState();
  } else if (date !== todayDate && status === "pending") {
    futureList.innerHTML += ui(todo, date, priority, status, fulfilled, index);
    updateEmptyState();
  } else {
    completedList.innerHTML += ui(
      todo,
      date,
      priority,
      status,
      fulfilled,
      index
    );
    updateEmptyState();
  }
}

function ui(todo, date, priority, status, fulfilled, index) {
  return `
    <li class="${
      status === "completed" ? "bg-green-300 text-black" : "bg-black text-white"
    } flex flex-col sm:flex-row justify-between items-start sm:items-center my-3 px-4 py-3 rounded-lg shadow-md w-full" data-index="${index}">
      <div class="flex-grow">
        <span class="block text-lg font-normal">${
          todo.charAt(0).toUpperCase() + todo.substring(1)
        }</span>
        ${
          fulfilled !== undefined
            ? `<span class="block text-sm text-gray-500">Fulfilled: ${fulfilled}</span>`
            : ""
        }
        <span class="block text-sm text-gray-500">Deadline: ${date}</span>
        
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center mt-2 sm:mt-0">
        <span class="text-sm sm:mr-4 sm:w-max">Priority: <span class="${
          priority === "high"
            ? "text-red-500"
            : priority === "medium"
            ? "text-orange-500"
            : "text-white"
        }">${
    priority.charAt(0).toUpperCase() + priority.substring(1)
  }</span></span>
        <div class="w-full flex justify-between items-center mt-2 sm:w-max sm:mt-0 sm:justify-around">
          ${
            status === "pending"
              ? `<img
                   src="https://cdn-icons-png.flaticon.com/128/10015/10015332.png"
                   alt="Complete"
                   class="h-5 w-5 cursor-pointer sm:mx-2"
                   title="Mark Complete"
                   onclick="completeTodo(this)"
                 />`
              : ""
          }
          <img
            src="https://cdn-icons-png.flaticon.com/128/9713/9713380.png"
            alt="Delete"
            class="h-5 w-5 cursor-pointer sm:mx-2"
            title="Delete Todo"
            onclick="deleteTodo(this)"
          />
        </div>
      </div>
    </li>`;
}

function updateEmptyState() {
  document.querySelector("#empty-today").style.display =
    todayList.children.length === 0 ? "block" : "none";
  document.querySelector("#empty-future").style.display =
    futureList.children.length === 0 ? "block" : "none";
  document.querySelector("#empty-complete").style.display =
    completedList.children.length === 0 ? "block" : "none";
}

function setDefaultDate() {
  let dd = new Date().getDate();
  let mm = new Date().getMonth() + 1;
  let yyyy = new Date().getFullYear();
  const today = `${yyyy}-${mm < 10 ? `0${mm}` : `${mm}`}-${
    dd < 10 ? `0${dd}` : `${dd}`
  }`;
  todoDate.value = today;
  todoDate.min = today;
}
//CALLING THE FUNCTION WHEN DOM IS LOADED
document.addEventListener("DOMContentLoaded", function () {
  setDefaultDate();
  checkTodoList(todoList);
  submit.addEventListener("click", (e) => addTodo(e));
});
