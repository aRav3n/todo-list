import {compareAsc, parseISO} from 'date-fns';
import {generateMainContent, generateProjectDetailView} from './domGenerator.js';

export const projectList = [];
export const taskList = [];
const lifeProject = generateNewProject('Life', 'General life tasks', '2200-01-01');
insertIntoList(lifeProject, projectList);

export function generateNewProject(name, description, dueDate) {
    let completed = false;
    const id = `project-${projectList.length + 1}`;
    return {name, description, dueDate, id, completed};
};

function generateNewTask(name, dueDate, parentId) {
    let completed = false;
    return {name, dueDate, parentId, completed};
}

export function insertIntoList(item, list) {
    const oldDate = item.dueDate;
    const correctedFormatDate = parseISO(oldDate);
    item.dueDate = correctedFormatDate;
    list.push(item);
    if (list.length > 1){
        list.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    };
};

export function listenForCompletedTask(task, checkboxId, project) {
    const checkBox = document.querySelector(`#${checkboxId}`);
    checkBox.addEventListener('click', () => {
        task.completed = true;
        generateProjectDetailView(project);
    });
}

export function saveNewProject(saveButtonId) {
    const saveButton = document.querySelector(`#${saveButtonId}`);
    saveButton.addEventListener('click', () => {
        const name = document.querySelector('#newProjectName');
        const dueDate = document.querySelector('#newProjectDate');
        if (validateRequiredFields(name, dueDate)) {
            const description = document.querySelector('#newProjectDescription');
            const newProjectObject = generateNewProject(name.value, description.value, dueDate.value);
            insertIntoList(newProjectObject, projectList);
            generateMainContent();
        };
    });
};

export function saveNewTask(saveButtonId, taskNameInputId, dueDateInputId, project) {
    const saveButton = document.querySelector(`#${saveButtonId}`);
    saveButton.addEventListener('click', () => {
        const name = document.querySelector(`#${taskNameInputId}`);
        const dueDate = document.querySelector(`#${dueDateInputId}`);
        if (validateRequiredFields(name, dueDate)) {
            const newTask = generateNewTask(name.value, dueDate.value, project.id);
            insertIntoList(newTask, taskList);
            generateProjectDetailView(project);
        };
    });
};

// Enter as arguments JavaScript elements, i.e. enter ITEM for const ITEM = document.querySelector....
function validateRequiredFields() {
    let failed = 0;
    for (let i = 0; i < arguments.length; i++) {
        let item = arguments[i];
        if (item.hasAttribute('required') && item.value === '') {
            item.setAttribute('placeholder', '*** Required ***');
            item.classList.add('validationFailed');
            failed ++;
        };
    };
    if (failed === 0) {
        return true;
    } else {
        return false;
    };
};