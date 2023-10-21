import {add, compareAsc, isBefore, isFuture, isPast, isToday, parseISO} from 'date-fns';
import {generateMainContent, generateProjectDetailView} from './domGenerator.js';

export const projectList = [];
export const taskList = [];
export const taskListPast = [];
export const taskListSoon = [];
export const taskListToday = [];
const lifeProject = generateNewProject('Life', 'General life tasks', '2200-01-01');
const lifeTask = generateNewTask('Travel', '2025-04-01','project-1');
insertIntoList(lifeProject, projectList);
insertIntoList(lifeTask, taskList);
const taskB = generateNewTask('Task B', '2025-04-01','project-1');
const taskC = generateNewTask('Task C', '2025-04-01','project-1');
insertIntoList(taskB, taskList);
insertIntoList(taskC, taskList);

export function deleteProject(project) {
    const index = projectList.indexOf(project);
    projectList.splice(index, 1);
    generateMainContent();
};

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
    item.dueDate = updateDateFormatForDateFns(item.dueDate);
    list.push(item);
    if (list.length > 1){
        list.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    };
    tasksDuePast();
    tasksDueSoon();
    tasksDueToday();
};

export function listenForCompletedTask(task, checkBox, regen) {
    checkBox.addEventListener('click', () => {
        task.completed = !task.completed;
        regen();
    });
}

export function saveNewProject() {
    const name = document.querySelector('#newProjectName');
    const dueDate = document.querySelector('#newProjectDate');
    if (validateRequiredFields(name, dueDate)) {
        const description = document.querySelector('#newProjectDescription');
        const newProjectObject = generateNewProject(name.value, description.value, dueDate.value);
        insertIntoList(newProjectObject, projectList);
        generateMainContent();
    };
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

function tasksDuePast() {
    taskListPast.length = 0;
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isPast(task.dueDate)) {
            taskListPast.push(task);
        };
    };
};

function tasksDueSoon() {
    taskListSoon.length = 0;
    const date = new Date();
    const today = parseISO(date);
    const aMonthOut = add(today, {
        days: 1,
        months: 1,
    });
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isFuture(task.dueDate) && isBefore(task.dueDate, aMonthOut)) {
            taskListSoon.push(task);
        };
    };
};

function tasksDueToday() {
    taskListToday.length = 0;
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isToday(task.dueDate)) {
            taskListToday.push(task);
        };
    };
};

function updateDateFormatForDateFns(date) {
    const oldDate = date;
    const correctedFormatDate = parseISO(oldDate);
    date = correctedFormatDate;
    return date;
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