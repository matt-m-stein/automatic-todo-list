const todoToday = document.getElementById('tasks-for-today');
const todoLeftOver = document.getElementById('left-over-tasks');
const input = document.getElementById('task-add');
const button = document.getElementById('submit-button');
const todayList = document.getElementById('today-list');
const leftOverList = document.getElementById('left-over-list');

console.log(todoToday)
console.log(todoLeftOver)
console.log(input)

button.addEventListener('click', (event) => {
    console.log(input.value);
});