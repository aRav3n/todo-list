import AddIcon from './images/add.svg';
import ArrowIcon from './images/chevron-forward-outline.svg';
import CompletedIcon from './images/checkbox_selected.svg';
import DateTodayIcon from './images/date-today.svg';
import DateSoonIcon from './images/date-soon.svg';
import DatePastIcon from './images/date-past.svg';
import DateGeneralIcon from './images/date-general.svg';
import DeleteIcon from './images/delete.svg';
import HomeIcon from './images/home.svg';
import IncompleteIcon from './images/checkbox_blank.svg';
import SaveIcon from './images/save.svg';
import SureIcon from './images/help-circle-outline.svg';
import {deleteProject, listenForCompletedTask, projectList, taskList, saveNewProject, saveNewTask} from './projectsAndTasks.js';
import {format} from 'date-fns';

function areYouSureDelete(project) {
    const deleteButton = document.querySelector('#deleteProject');
    clearParentDiv(deleteButton);
    const sureIcon = new Image();
    sureIcon.src = SureIcon;
    deleteButton.appendChild(sureIcon);
    deleteButton.innerHTML += 'Are you sure?';
    const yesImSure = deleteButton;
    yesImSure.addEventListener('click', () => {
        deleteProject(project);
    });
};

function clearParentDiv(parentDiv) {
    parentDiv.innerHTML = ''
};

function listenForNewProject() {
    const detailItemsSection = document.querySelector('#detailItems');
    generateSectionToCreateNewProject(detailItemsSection);
};

function generateCompletedTasks(project) {
    const parent = document.querySelector('#detailItems');
    const heading = document.createElement('h2');
    const hideButton = generateDivButton('hideTasks', CompletedIcon, 'Hide Completed', generateProjectDetailView.bind(null, project));
    heading.innerHTML = 'Completed Tasks';
    heading.appendChild(hideButton);
    parent.appendChild(heading);
    const completedTaskList = document.createElement('div');
    completedTaskList.setAttribute('id', 'taskListCompleted');
    completedTaskList.classList.add('listOfTasks');
    generateTaskList(completedTaskList, project, true);
    parent.appendChild(completedTaskList);
};

function generateDivButton(id, importedIconName, label, functionCalls) {
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
    const newRow = document.createElement('div');
    newRow.setAttribute('id', 'spreadOutItems');
    const deleteButton = generateSubDiv('deleteProject', DeleteIcon, 'Delete Project');
    deleteButton.addEventListener('click', () => {
        areYouSureDelete(project);
    });
    newRow.appendChild(deleteButton);
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
    heading.appendChild(generateDivButton('showCompletedTasks', CompletedIcon, 'Show Completed', generateCompletedTasks.bind(null, project)));
    heading.appendChild(generateDivButton('addTask', AddIcon, 'Add Task', generateSectionToCreateNewTask.bind(null, project)));
    parent.appendChild(heading);
    const taskDisplaySection = document.createElement('div');
    taskDisplaySection.setAttribute('id', 'taskList');
    taskDisplaySection.classList.add('listOfTasks');
    parent.appendChild(taskDisplaySection);
    generateTaskList(taskDisplaySection, project, false);
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

function generateSectionToCreateNewTask(project) {
    const parent = document.querySelector('#taskList');
    const newTaskDiv = document.createElement('div');
    newTaskDiv.setAttribute('id', 'newTaskDiv');
    const heading = document.createElement('h2');
    heading.innerHTML = 'New Task';
    newTaskDiv.appendChild(heading);
    newTaskDiv.appendChild(generateNewInputSection('text', 'newTaskName', 'Task Name', 'Y'));
    newTaskDiv.appendChild(generateNewInputSection('date', 'newTaskDueDate', 'Due Date', 'Y'));
    newTaskDiv.appendChild(generateDivButton('saveNewTask', SaveIcon, 'Save', saveNewTask.bind(null,'saveNewTask', 'newTaskName', 'newTaskDueDate', project, parent)));
    clearParentDiv(parent);
    parent.style.display = 'flex';
    parent.appendChild(newTaskDiv);
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

function generateTaskList(parent, project, completed) {
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i];
        let taskId = task.parentId;
        let taskComplete = task.completed;
        let projectId = project.id
        if (taskId === projectId && taskComplete === completed) {
            parent.style.display = 'grid';
            parent.appendChild(generateTaskNameDisplay(task, i, project));
            parent.appendChild(generateTaskDateDisplay(task));
        };
    };
};

function generateTaskNameDisplay(task, i, project) {
    const taskDiv = document.createElement('div');
    const checkBox = new Image();
    if (task.completed) {
        checkBox.src = CompletedIcon;
    } else {
        checkBox.src = IncompleteIcon;
    };
    const id = `checkbox-${i}`;
    checkBox.setAttribute('id', id);
    listenForCompletedTask(task, checkBox, project)
    taskDiv.appendChild(checkBox);
    let label = document.createElement('label');
    label.setAttribute('for', id);
    label.innerHTML = task.name;
    taskDiv.appendChild(label);
    taskDiv.classList.add('taskRow');
    return taskDiv;
};