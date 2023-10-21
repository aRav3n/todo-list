import AddIcon from './images/add.svg';
import ArrowIcon from './images/chevron-forward-outline.svg';
import CompletedIcon from './images/checkbox-outline.svg';
import DateTodayIcon from './images/date-today.svg';
import DateSoonIcon from './images/date-soon.svg';
import DatePastIcon from './images/date-past.svg';
import DateGeneralIcon from './images/date-general.svg';
import DeleteIcon from './images/delete.svg';
import HomeIcon from './images/home.svg';
import SaveIcon from './images/save.svg';
import {listenForCompletedTask, projectList, taskList, saveNewProject, saveNewTask} from './projectsAndTasks.js';
import {format} from 'date-fns';

function clearParentDiv(parentDiv) {
    parentDiv.innerHTML = ''
};

function listenForNewProject() {
    const detailItemsSection = document.querySelector('#detailItems');
    generateSectionToCreateNewProject(detailItemsSection);
};

function generateCompletedTasks() {

};

function generateDivButton(id, importedIconName, label, actions) {
    const divButton = document.createElement('div');
    divButton.setAttribute('id', id);
    const icon = new Image();
    icon.src = importedIconName;
    divButton.appendChild(icon);
    const divButtonLabel = document.createElement('span');
    divButtonLabel.innerHTML += ` ${label}`;
    divButton.appendChild(divButtonLabel);
    divButton.classList.add('divButton');
    for (let i = 3; i < arguments.length; i++) {
        divButton.addEventListener('click', () => {
            arguments[i]();
        });
    }
    return divButton;
};

function generateHomeButton(parent) {
    parent.appendChild(generateDivButton('homeButton', HomeIcon, 'Home', generateMainContent));
};

function generateListOfProjects() {
    const parentDiv = document.querySelector('#listOfProjects');
    let i = 1;
    projectList.forEach(project => {
        parentDiv.appendChild(generateSubDiv(project.id, ArrowIcon, project.name));
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
    newRow.appendChild(generateSubDiv('deleteProject', DeleteIcon, 'Delete Project'));
    const displayDate = format(project.dueDate, 'MM/dd/yyyy');
    newRow.appendChild(generateSubDiv('', DateGeneralIcon, `Due: ${displayDate}`));
    parent.appendChild(newRow);
    const projectName = document.createElement('h1');
    projectName.innerHTML = project.name;
    parent.appendChild(projectName);
    const projectDescription = document.createElement('h3');
    projectDescription.innerHTML = project.description;
    parent.appendChild(projectDescription);
    const heading = document.createElement('h2');
    heading.innerHTML = 'Current Tasks';
    heading.appendChild(generateDivButton('showCompletedTasks', CompletedIcon, 'Show Completed', generateCompletedTasks));
    heading.appendChild(generateDivButton('addTask', AddIcon, 'Add Task', generateSectionToCreateNewTask));
    parent.appendChild(heading);
    generateTaskList(parent, project);
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
    parentDiv.appendChild(generateDivButton('saveNewProject', SaveIcon, 'Save', saveNewProject));
};

function generateSectionToCreateNewTask(parent, project) {
    const newTaskDiv = document.createElement('div');
    newTaskDiv.setAttribute('id', 'newTaskDiv');
    const heading = document.createElement('h2');
    heading.innerHTML = 'New Task';
    newTaskDiv.appendChild(heading);
    newTaskDiv.appendChild(generateNewInputSection('text', 'newTaskName', 'Task Name', 'Y'));
    newTaskDiv.appendChild(generateNewInputSection('date', 'newTaskDueDate', 'Due Date', 'Y'));
    newTaskDiv.appendChild(generateDivButton('saveNewTask', SaveIcon, 'Save'));
    parent.appendChild(newTaskDiv);
    saveNewTask('saveNewTask', 'newTaskName', 'newTaskDueDate', project);
};

function generateStaticContent() {
    const body = document.querySelector('body');
    const highLevelItems = document.createElement('div');
    highLevelItems.setAttribute('id', 'highLevelItems');

    const timeDueSection = document.createElement('div');
    timeDueSection.appendChild(generateSubDiv('pastDue', DatePastIcon, 'Past Due'));
    timeDueSection.appendChild(generateSubDiv('todayDue', DateTodayIcon, 'Due Today'));
    timeDueSection.appendChild(generateSubDiv('soonDue', DateSoonIcon, 'Due Soon'));

    const projectMenu = document.createElement('div');
    projectMenu.setAttribute('id', 'projectMenu');
    const projectHeadline = document.createElement('h2');
    projectHeadline.innerHTML = 'Projects'
    const listOfProjects = document.createElement('div');
    listOfProjects.setAttribute('id', 'listOfProjects');
    projectMenu.appendChild(projectHeadline);
    projectMenu.appendChild(listOfProjects);

    projectMenu.appendChild(generateDivButton('newProjectButton', AddIcon, 'New Project', listenForNewProject));

    highLevelItems.appendChild(timeDueSection);
    highLevelItems.appendChild(projectMenu);

    const detailItems = document.createElement('div');
    detailItems.setAttribute('id', 'detailItems');

    body.innerHTML = '';
    body.appendChild(highLevelItems);
    body.appendChild(detailItems);
};

function generateSubDiv(id, importedIconName, readableWords) {
    const subDiv = document.createElement('div');
    subDiv.setAttribute('id', id);
    const icon = new Image();
    icon.src = importedIconName;
    subDiv.appendChild(icon);
    const divText = document.createElement('span');
    divText.innerHTML += ` ${readableWords}`;
    subDiv.appendChild(divText);
    return subDiv;
};

function generateTaskDateDisplay(task) {
    const date = format(task.dueDate, 'MM/dd/yyyy');
    const dateRow = generateSubDiv('', DateGeneralIcon, date);
    dateRow.classList.add('taskRow');
    return dateRow;
};

function generateTaskNameDisplay(task, i) {
    let taskDiv = document.createElement('div');
    let checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    let id = `checkbox-${i+1}`;
    checkBox.setAttribute('id', id);
    taskDiv.appendChild(checkBox);
    let label = document.createElement('label');
    label.setAttribute('for', id);
    label.innerHTML = task.name;
    taskDiv.appendChild(label);
    taskDiv.classList.add('taskRow');
    return taskDiv;
};

function generateTaskList(parent, project) {
    const taskDisplaySection = document.createElement('div');
    taskDisplaySection.setAttribute('id', 'taskList');
    parent.appendChild(taskDisplaySection);
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        let taskId = task.parentId;
        let taskComplete = task.completed;
        let projectId = project.id
        if (taskId === projectId && taskComplete === false) {
            taskDisplaySection.appendChild(generateTaskNameDisplay(task, i));
            taskDisplaySection.appendChild(generateTaskDateDisplay(task));
            listenForCompletedTask(task, `checkbox-${i+1}`, project);
        };
    };
};