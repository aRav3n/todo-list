import DeleteIcon from './images/delete.svg';
import DateTodayIcon from './images/date-today.svg';
import DateSoonIcon from './images/date-soon.svg';
import DatePastIcon from './images/date-past.svg';
import DateGeneralIcon from './images/date-general.svg';
import ArrowIcon from './images/chevron-forward-outline.svg';
import HomeIcon from './images/home.svg';
import AddIcon from './images/add.svg';
import SaveIcon from './images/save.svg';
import {listenForCompletedTask, projectList, taskList, saveNewProject, saveNewTask} from './projectsAndTasks.js';
import {format} from 'date-fns';

function clearParentDiv(parentDiv) {
    parentDiv.innerHTML = ''
};

function listenForNewProject() {
    const newProjectButton = document.querySelector('#newProjectButton');
    const detailItemsSection = document.querySelector('#detailItems');
    newProjectButton.addEventListener('click', () => {
        generateSectionToCreateNewProject(detailItemsSection);
    });
};

function generateDivButton(id, importedIconName, label, parentDiv) {
    const divButton = document.createElement('div');
    divButton.setAttribute('id', id);
    const icon = new Image();
    icon.src = importedIconName;
    divButton.appendChild(icon);
    const divButtonLabel = document.createElement('span');
    divButtonLabel.innerHTML += ` ${label}`;
    divButton.appendChild(divButtonLabel);
    divButton.classList.add('divButton');
    parentDiv.appendChild(divButton);
};

function generateHomeButton(parent) {
    generateDivButton('homeButton', HomeIcon, 'Home', parent);
    const homeButton = document.querySelector('#homeButton');
    homeButton.addEventListener('click', () => {
        generateMainContent();
    });
};

function generateListOfProjects() {
    const parentDiv = document.querySelector('#listOfProjects');
    let i = 1;
    projectList.forEach(project => {
        generateSubDiv(project.id, ArrowIcon, project.name, parentDiv);
        const clickableSubDiv = document.querySelector(`#${project.id}`);
        clickableSubDiv.addEventListener('click', () => {
            generateProjectDetailView(project);
        });
    });
};

export function generateMainContent() {
    generateStaticContent();
    generateListOfProjects();
};

function generateNewInputSection(type, id, labelText, required) {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', type);
    inputField.setAttribute('id', id);
    inputField.setAttribute('name', id);
    inputField.setAttribute('placeholder', labelText);
    const fieldLabel = document.createElement('label');
    fieldLabel.setAttribute('for', id);
    fieldLabel.innerHTML = labelText;
    if (required === 'Y'){
        inputField.required = true;
        fieldLabel.innerHTML += ' *'
    };
    fieldLabel.appendChild(inputField);
    return fieldLabel;
};

export function generateProjectDetailView(project) {
    const parent = document.querySelector('#detailItems');
    clearParentDiv(parent);
    generateHomeButton(parent);
    let newRow = document.createElement('div');
    newRow.classList.add('spreadOutItems');
    generateSubDiv('deleteProject', DeleteIcon, 'Delete Project', newRow);
    const displayDate = format(project.dueDate, 'MM/dd/yyyy');
    generateSubDiv('', DateGeneralIcon, `Due: ${displayDate}`, newRow);
    parent.appendChild(newRow);
    const projectName = document.createElement('h1');
    projectName.innerHTML = project.name;
    parent.appendChild(projectName);
    const projectDescription = document.createElement('h3');
    projectDescription.innerHTML = project.description;
    parent.appendChild(projectDescription);
    const heading = document.createElement('h2');
    heading.innerHTML = 'Current Tasks';
    generateDivButton('addTask', AddIcon, 'Add Task', heading);
    parent.appendChild(heading);
    const addTaskButton = document.querySelector('#addTask');

    generateTaskList(parent, project);
    addTaskButton.addEventListener('click', () => {
        generateSectionToCreateNewTask(parent, project);
    });
};

function generateSectionToCreateNewProject(parentDiv) {
    clearParentDiv(parentDiv);
    const descriptionSection = document.createElement('label');
    descriptionSection.setAttribute('for', 'newProjectDescription');
    descriptionSection.innerHTML = 'Description';
    const descriptionSectionText = document.createElement('textarea');
    descriptionSectionText.setAttribute('id', 'newProjectDescription');
    descriptionSectionText.setAttribute('placeholder', 'Project description here...');
    descriptionSection.appendChild(descriptionSectionText);

    parentDiv.appendChild(generateNewInputSection('text', 'newProjectName', 'Project Name', 'Y'));
    parentDiv.appendChild(descriptionSection);
    parentDiv.appendChild(generateNewInputSection('date', 'newProjectDate', 'Due Date', 'Y'));
    generateDivButton('saveNewProject', SaveIcon, 'Save', parentDiv);
    saveNewProject('saveNewProject');
};

function generateSectionToCreateNewTask(parent, project) {
    const newTaskDiv = document.createElement('div');
    newTaskDiv.setAttribute('id', 'newTaskDiv');
    const heading = document.createElement('h2');
    heading.innerHTML = 'New Task';
    newTaskDiv.appendChild(heading);
    newTaskDiv.appendChild(generateNewInputSection('text', 'newTaskName', 'Task Name', 'Y'));
    newTaskDiv.appendChild(generateNewInputSection('date', 'newTaskDueDate', 'Due Date', 'Y'));
    generateDivButton('saveNewTask', SaveIcon, 'Save', newTaskDiv);
    parent.appendChild(newTaskDiv);
    saveNewTask('saveNewTask', 'newTaskName', 'newTaskDueDate', project);
};

function generateStaticContent() {
    const body = document.querySelector('body');
    const highLevelItems = document.createElement('div');
    highLevelItems.setAttribute('id', 'highLevelItems');

    const timeDueSection = document.createElement('div');
    generateSubDiv('pastDue', DatePastIcon, 'Past Due', timeDueSection);
    generateSubDiv('todayDue', DateTodayIcon, 'Due Today', timeDueSection);
    generateSubDiv('soonDue', DateSoonIcon, 'Due Soon', timeDueSection);

    const projectMenu = document.createElement('div');
    projectMenu.setAttribute('id', 'projectMenu');
    const projectHeadline = document.createElement('h2');
    projectHeadline.innerHTML = 'Projects'
    const listOfProjects = document.createElement('div');
    listOfProjects.setAttribute('id', 'listOfProjects');
    projectMenu.appendChild(projectHeadline);
    projectMenu.appendChild(listOfProjects);

    generateDivButton('newProjectButton', AddIcon, 'New Project', projectMenu);

    highLevelItems.appendChild(timeDueSection);
    highLevelItems.appendChild(projectMenu);

    const detailItems = document.createElement('div');
    detailItems.setAttribute('id', 'detailItems');

    body.innerHTML = '';
    body.appendChild(highLevelItems);
    body.appendChild(detailItems);
    listenForNewProject();
};

function generateSubDiv(id, importedIconName, readableWords, parentDiv) {
    const subDiv = document.createElement('div');
    subDiv.setAttribute('id', id);
    const icon = new Image();
    icon.src = importedIconName;
    subDiv.appendChild(icon);
    const divText = document.createElement('span');
    divText.innerHTML += ` ${readableWords}`;
    subDiv.appendChild(divText);
    parentDiv.appendChild(subDiv);
};

function generateTaskDateDisplay(task, parent) {
    const date = format(task.dueDate, 'MM/dd/yyyy');
    generateSubDiv('', DateGeneralIcon, date, parent);
};

function generateTaskNameDisplay(project, task, i) {
    let taskDiv = document.createElement('div');
    let checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    let id = `checkbox-${i+1}`;
    checkBox.setAttribute('id', id);
    taskDiv.appendChild(checkBox);
    let label = document.createElement('label');
    label.setAttribute('for', id);
    return taskDiv;
};

function generateTaskList(parent, project) {
    const taskDisplaySection = document.createElement('div');
    taskDisplaySection.setAttribute('id', 'taskList');
    const nameColumn = document.createElement('div');
    const dateColumn = document.createElement('div');
    taskDisplaySection.appendChild(nameColumn);
    taskDisplaySection.appendChild(dateColumn);
    parent.appendChild(taskDisplaySection);
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        let taskId = task.parentId;
        let taskComplete = task.completed;
        let projectId = project.id
        if (taskId === projectId && taskComplete === false) {
            nameColumn.appendChild(generateTaskNameDisplay(project, task, i));
            generateTaskDateDisplay(task, dateColumn);
            listenForCompletedTask(task, `checkbox-${i+1}`, project);
        };
    };


};