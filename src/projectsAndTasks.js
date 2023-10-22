import {add, compareAsc, endOfToday, isBefore, isFuture, isPast, isToday, parseISO} from 'date-fns';
import {generateMainContent, generateProjectDetailView} from './domGenerator.js';

export const projectList = [];
export const taskList = [];
export const taskListPast = [];
export const taskListSoon = [];
export const taskListToday = [];
const lifeProject = generateNewProject('Life', 'General life tasks', '2025-04-01');
const lifeTask = generateNewTask('Travel', '2025-04-01','project-1');
insertIntoList(lifeProject, projectList);
insertIntoList(lifeTask, taskList);

function clearArray(array) {
    if (array.length > 0) {
        array.pop;
        clearArray(array);
    } else {
        return;
    };
};

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
    const id = `task-${taskList.length+1}`;
    return {name, dueDate, parentId, completed, id};
}

export function insertIntoList(item, list) {
    item.dueDate = updateDateFormatForDateFns(item.dueDate);
    list.push(item);
    console.log(item.name, item.id);
    if (list.length > 1){
        list.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    };
};

export function listenForCompletedTask(task, checkBox, regen) {
    checkBox.addEventListener('click', () => {
        task.completed = !task.completed;
        regen();
    });
};

function localStorageGet(arrayToPopulate, projectOrTask) {
    let string = `${projectOrTask.toLowerCase()}-`;
    let startingNumber = arrayToPopulate.length + 1;
    
};

function localStorageSet(array) {
    if (storageAvailable()) {
        for (let i = 1; i < array.length; i++) {
            let name = array[i].id;
            let object = array[i];
            if (!JSON.parse(localStorage.getItem(name))){
                localStorage.setItem(name, JSON.stringify(object));
            };
        };
    } else {
        alert('Sorry, no local storage available');
    };
};

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
    updateSubTaskLists();
};

// Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable() {
    let storage;
    let type = 'localStorage';
    try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
    } catch (e) {
    return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
    );
    }
};  

function tasksDuePast() {
    clearArray(taskListPast);
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isPast(task.dueDate)) {
            taskListPast.push(task);
        };
    };
    return taskListPast;
};

function tasksDueSoon() {
    clearArray(taskListSoon);
    const today = endOfToday();
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
    return taskListSoon;
};

function tasksDueToday() {
    clearArray(taskListToday);
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isToday(task.dueDate)) {
            taskListToday.push(task);
        };
    };
    return taskListToday;
};

function updateDateFormatForDateFns(date) {
    const oldDate = date;
    const correctedFormatDate = parseISO(oldDate);
    date = correctedFormatDate;
    return date;
};

export function updateSubTaskLists() {
    tasksDuePast();
    tasksDueSoon();
    tasksDueToday();
}

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