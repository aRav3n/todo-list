import {add, compareAsc, endOfToday, isBefore, isFuture, isPast, isToday, parseISO} from 'date-fns';
import {mainContent, projectDetail} from './domGenerator.js';

export const itemLists = {
    project: [],
    task: [],
};
const projectList = itemLists.project;
const taskList = itemLists.task;
export const taskListPast = [];
export const taskListSoon = [];
export const taskListToday = [];


export const deleteProject = function deleteThiProject(project) {
    const index = projectList.indexOf(project);
    deleteTasks(project);
    projectList.splice(index, 1);
    lsReset();
    mainContent();
};

const deleteTasks = function deleteTasksForProject(project) {
    const parentId = project.id;
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].parentId === parentId) {
            taskList.splice(i, 1);
        };
    };
    localStorageSet(taskList);
    updateSubTaskLists();
};

const dateFormat = function updateDateFormatForDateFns(date) {
    const oldDate = date;
    const correctedFormatDate = parseISO(oldDate);
    date = correctedFormatDate;
    return date;
};

const newProject = function generateNewProject(name, description, dueDate) {
    let completed = false;
    const type = 'project';
    const id = `project-${projectList.length + 1}`;
    dueDate = dateFormat(dueDate);
    return {name, description, dueDate, id, completed, type};
};

const newTask = function generateNewTask(name, dueDate, parentId) {
    let completed = false;
    const type = 'task';
    const id = `task-${taskList.length+1}`;
    dueDate = dateFormat(dueDate);
    return {name, dueDate, parentId, completed, id, type};
}

const insertIntoList = function insertItemIntoList(item) {
    const type = item.type;
    const list = itemLists[type];
    list.push(item);
    if (list.length > 1){
        list.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    };
    localStorageSet(list);
    updateSubTaskLists();
};

export const listenTaskComplete = function listenForCompletedTask(task, checkBox, regen) {
    checkBox.addEventListener('click', () => {
        task.completed = !task.completed;
        regen();
    });
};

export const localStorageGet = function populateArrayFromLocalStorage(arrayToPopulate, projectOrTask) {
    const string = `${projectOrTask.toLowerCase()}-`;
    let number = arrayToPopulate.length + 1;
    let idString = string + number;
    if (JSON.parse(localStorage.getItem(idString))) {
        const newObject = JSON.parse(localStorage.getItem(idString));
        const date = new Date(newObject.dueDate);
        newObject.dueDate = date;
        insertIntoList(newObject, arrayToPopulate);
        localStorageGet(arrayToPopulate, projectOrTask);
    };
};

const localStorageSet = function setArrayIntoLocalStorage(array) {
    if (storageAvailable()) {
        for (let i = 0; i < array.length; i++) {
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

const lsReset = function localStorageResetItems() {
    localStorage.clear();
    rsIds();
    localStorageSet(projectList);
    localStorageSet(taskList);
};

const rsIds = function resetIdNames(){
    const projects = itemLists.project;
    const tasks = itemLists.task;
    const newProjectIdKey = [];
    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];
        let oldId = project.id;
        let newId = `project-${i + 1}`;
        let key = {
            oldId: oldId,
            newId: newId,
        };
        newProjectIdKey.push(key);
        project.id = newId;
    };
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let newTaskId = `task-${i + 1}`;
        task.id = newTaskId;
        let oldParentId = task.parentId;
        for (let j = 0; j < newProjectIdKey.length; j++) {
            if (newProjectIdKey[j].oldId === oldParentId) {
                let newParentId = newProjectIdKey[j].newId;
                task.parentId = newParentId;
            };
        };
    };
};

export const saveNewProject = function saveANewProjectToProjectList() {
    const name = document.querySelector('#newProjectName');
    const dueDate = document.querySelector('#newProjectDate');
    if (validateRequiredFields(name, dueDate)) {
        const description = document.querySelector('#newProjectDescription');
        const newProjectObject = newProject(name.value, description.value, dueDate.value);
        insertIntoList(newProjectObject, projectList);
        mainContent();
    };
};

export const saveNewTask = function saveTheNewTaskToProjectAndTaskList(saveButtonId, taskNameInputId, dueDateInputId, project) {
    const saveButton = document.querySelector(`#${saveButtonId}`);
    const name = document.querySelector(`#${taskNameInputId}`);
    const dueDate = document.querySelector(`#${dueDateInputId}`);
    if (validateRequiredFields(name, dueDate)) {
        const newTask = newTask(name.value, dueDate.value, project.id);
        insertIntoList(newTask, taskList);
        projectDetail(project);
    };
};

// Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const storageAvailable = function checkIfStorageIsAvailable() {
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

const tasksDuePast = function getListOfPastDueTasks() {
    taskListPast.length = 0;
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isPast(task.dueDate)) {
            taskListPast.push(task);
        };
    };
};

const tasksDueSoon = function getListOfTasksDueSoon() {
    taskListSoon.length = 0;
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
};

const tasksDueToday = function getListOfTasksDueToday() {
    taskListToday.length = 0;
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        if (!task.completed && isToday(task.dueDate)) {
            taskListToday.push(task);
        };
    };
};

const updateSubTaskLists = function updateListOfSubTasks() {
    tasksDuePast();
    tasksDueSoon();
    tasksDueToday();
}

// Enter as arguments JavaScript elements, i.e. enter ITEM for const ITEM = document.querySelector....
const validateRequiredFields = function validateThisFieldIfRequired() {
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

const lifeProject = newProject('Life', 'General life tasks & enjoyment', '1000-04-01');
const lifeTask = newTask('Travel', '1000-04-01','project-1');
insertIntoList(lifeProject);
insertIntoList(lifeTask);