const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const tabButtons = document.querySelectorAll('.tab-button');

// Lưu trữ danh sách các task
let tasks = [];


function addTodo() {
  const taskText = todoInput.value.trim();
  const taskDateValue = todoDate.value;

  if (!taskText || !taskDateValue) {
    alert('Please enter a task and select a date!');
    return;
  }

  const taskDate = new Date(taskDateValue);
  taskDate.setHours(0, 0, 0, 0); 

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const status =
    taskDate.getTime() === today.getTime()
      ? 'today'
      : taskDate < today
      ? 'pending'
      : 'due';

  const task = {
    text: taskText,
    date: taskDate,
    status,
  };

  tasks.push(task);
  todoInput.value = '';
  todoDate.value = '';

  renderTasks();
}

// Hàm hiển thị task theo tab
function renderTasks(filter = 'today') {
  todoList.innerHTML = '';

  tasks
    .filter(task => task.status === filter)
    .forEach(task => {
      const todoItem = document.createElement('li');
      todoItem.classList.add('todo-item');

      todoItem.innerHTML = `
        <span>${task.text} - ${task.date.toDateString()}</span>
        <button class="delete-button">Delete</button>
      `;

      todoItem.addEventListener('click', function (e) {
        if (e.target.tagName !== 'BUTTON') {
          todoItem.classList.toggle('completed');
        }
      });

      const deleteButton = todoItem.querySelector('.delete-button');
      deleteButton.addEventListener('click', function (e) {
        e.stopPropagation();
        tasks = tasks.filter(t => t !== task);
        renderTasks(filter);
      });

      todoList.appendChild(todoItem);
    });

  tabButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.tab === filter);
  });
}

// Cập nhật trạng thái của các task
function updateTaskStatus() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach(task => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      task.status = 'today';
    } else if (taskDate < today) {
      task.status = 'pending';
    } else {
      task.status = 'due';
    }
  });
}

// Nút thêm task
addButton.addEventListener('click', () => {
  addTodo();
});

// Tab chuyển đổi
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.tab;
    updateTaskStatus();
    renderTasks(filter);
  });
});

// Mặc định hiển thị tab Today
renderTasks('today');
