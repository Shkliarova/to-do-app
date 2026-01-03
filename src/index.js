import Notiflix from "notiflix";

const selectors = {
    form: document.querySelector('.todo-form'),
    list: document.querySelector('.todo-list'),
    input: document.querySelector('.todo-input'),
    filter: document.querySelector('.filters')
}
const buttons = document.querySelectorAll('.filters button');

const LS_KEY = "7Y$}7n)D}75ONC>";

const LSdata = JSON.parse(localStorage.getItem(LS_KEY)) || [];

if(LSdata.length !== 0){
    selectors.list.innerHTML = createMarkup(LSdata);
} 

selectors.form.addEventListener('submit', addTask);
selectors.filter.addEventListener('click', onActiveClick);

function addTask(e) {
    e.preventDefault();

    const inputValue = e.target.elements[0].value.trim();
    if(!inputValue){
        Notiflix.Notify.failure('Будь ласка, введіть завдання');
        return;
    } 

    const task = {
        id: Date.now(),
        text: inputValue,
        completed: false
    }

    LSdata.push(task);

    localStorage.setItem(LS_KEY, JSON.stringify(LSdata));

    selectors.form.reset();

    Notiflix.Notify.success("Завдання додано");

    selectors.list.innerHTML = createMarkup(JSON.parse(localStorage.getItem(LS_KEY))); 
}

function createMarkup(tasks) {
    return tasks.map(({ text, id, completed }) => {
        return `
        <li class="task-item ${completed ? 'completed' : ''}" data-id="${id}">
            <div class="task-left">
                <label class="custom-checkbox">
                    <input ${completed ? 'checked' : ''} name="checkbox" type="checkbox" />
                    <span class="checkmark"></span>
                </label>
                <span class="task-text">${text}</span>
            </div>
            <div class="task-actions">
                <button class="edit" aria-label="Редагувати">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0c8792" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                    </svg>
                </button>
                <button class="delete" aria-label="Видалити">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                    </svg>
                </button>
            </div>
        </li>
        `;
    }).join('');
}

function renderTasks(currentFilter){
    let filteredData;

    switch (currentFilter) {
        case "completed":
            filteredData = [...LSdata].filter(item => item.completed)
            break;
        case "active":
            filteredData = [...LSdata].filter(item => !item.completed)
            break;
        default:
            filteredData = [...LSdata];
    }

    selectors.list.innerHTML = createMarkup(filteredData);
}

function onActiveClick(e){
    buttons.forEach(button => button.classList.remove('active'));

    if(e.target === e.currentTarget){
        return;
    }

    e.target.classList.add('active');

    renderTasks(e.target.dataset.filter);
}

selectors.list.addEventListener('change', handleCompletedTask);
selectors.list.addEventListener('click', handleEditBtn);

function handleCompletedTask(e){
    if(e.target.type !== "checkbox"){
        return;
    }

    const currentTask = e.target.closest('li');
    const id = Number(currentTask.dataset.id);
    
    const currentItem = LSdata.find(task => task.id === id);
    if (!currentItem) return;

    currentItem.completed = e.target.checked;

    if(currentItem.completed){
        currentTask.classList.add('completed');
    } else{
        currentTask.classList.remove('completed');
    }

    localStorage.setItem(LS_KEY, JSON.stringify(LSdata));

    const activeFilter = document.querySelector('.filters button.active')?.dataset.filter || 'all';

    renderTasks(activeFilter);
}

function handleEditBtn(e){
    const editBtn = e.target.closest('.edit');

    if(!editBtn){
        return;
    }

    const currentTask = editBtn.closest('li');
    const id = Number(currentTask.dataset.id);
    
    const currentItem = LSdata.find(task => task.id === id);
    if (!currentItem) return;

    if (currentItem.completed) {
        Notiflix.Notify.warning('Неможливо редагувати виконане завдання');
        return;
    }

    const newText = prompt("Відредагуйте завдання", currentItem.text);
    if (!newText || !newText.trim()) return;

    currentItem.text = newText.trim();

    localStorage.setItem(LS_KEY, JSON.stringify(LSdata));

    const activeFilter = document.querySelector('.filters button.active')?.dataset.filter || 'all';

    renderTasks(activeFilter);

    Notiflix.Notify.info('Текст завдання змінено');
}