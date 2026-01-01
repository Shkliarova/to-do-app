import Notiflix from "notiflix";

const selectors = {
    form: document.querySelector('.todo-form'),
    list: document.querySelector('.todo-list'),
    input: document.querySelector('.todo-input'),
    filters: {
        all: document.querySelector('.filters [data-filter = "all"]'),
        active: document.querySelector('.filters [data-filter = "active"]'),
        completed: document.querySelector('.filters [data-filter = "completed"]')
    }
}

const LS_KEY = "7Y$}7n)D}75ONC>";

const LSdata = JSON.parse(localStorage.getItem(LS_KEY)) || [];

if(LSdata.length !== 0){
    selectors.list.insertAdjacentHTML('beforeend', createMarkup(LSdata));
} 

selectors.form.addEventListener('submit', addTask)

function addTask(e) {
    e.preventDefault();

    const inputValue = e.target.elements[0].value;

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
    return tasks.map(({ text }) => {
        return `
        <li class="task-item">
            <div class="task-left">
                <label class="custom-checkbox">
                    <input type="checkbox" />
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