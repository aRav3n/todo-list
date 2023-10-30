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
import {
    deleteProject,
    itemLists,
    listenTaskComplete,
    localStorageGet,
    saveNewProject,
    saveNewTask,
    taskListToday,
    taskListPast,
    taskListSoon
} from './projectsAndTasks';
import {format} from 'date-fns';
const projectList = itemLists.project;
const taskList = itemLists.task;

const areYouSure = function areYouSureDelete(project) {
    const deleteButton = document.querySelector('#deleteProject');
    clearElement(deleteButton);
    const sureIcon = new Image();
    sureIcon.src = SureIcon;
    deleteButton.appendChild(sureIcon);
    deleteButton.innerHTML += 'Are you sure?';
    const yesImSure = deleteButton;
    yesImSure.addEventListener('click', () => {
        deleteProject(project);
    });
};

const clearElement = function clearSpecifiedElement(element) {
    element.innerHTML = ''
};

const newProject = function listenForNewProject() {
    const detailItemsSection = document.querySelector('#detailItems');
    createNewProject(detailItemsSection);
};

const completedTasks = function generateCompletedTasks(project) {
    const parent = document.querySelector('#detailItems');
    const heading = document.createElement('h2');
    const hideButton = newButton('hideTasks', CompletedIcon, 'Hide Completed', projectDetail.bind(null, project));
    heading.innerHTML = 'Completed Tasks';
    heading.appendChild(hideButton);
    parent.appendChild(heading);
    const completedTaskList = document.createElement('div');
    completedTaskList.setAttribute('id', 'taskListCompleted');
    completedTaskList.classList.add('listOfTasks');
    completedTaskList.appendChild(makeTaskList(project, true, taskList));
    parent.appendChild(completedTaskList);
};

const newButton = function generateDivButton(id, importedIconName, label, functionCalls) {
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
    };
    return divButton;
};

const homeButton = function generateHomeButton(parent) {
    parent.appendChild(newButton('homeButton', HomeIcon, 'Home', mainContent));
};

const makeProjectList = function generateListOfProjects() {
    const parentDiv = document.querySelector('#listOfProjects');
    projectList.forEach(project => {
        parentDiv.appendChild(subDiv(project.id, ArrowIcon, project.name, projectDetail.bind(null, project)));
    });
};

export const mainContent = function generateMainContent() {
    localStorageGet(projectList, 'project');
    localStorageGet(taskList, 'task');
    staticContent();
    makeProjectList();
    taskDisplay();
};

const newInput = function generateNewInputSection(type, id, labelText, required) {
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

export const projectDetail = function generateProjectDetailView(project) {
    const parent = document.querySelector('#detailItems');
    clearElement(parent);
    homeButton(parent);
    const newRow = document.createElement('div');
    newRow.setAttribute('id', 'spreadOutItems');
    const deleteButton = subDiv('deleteProject', DeleteIcon, 'Delete Project', areYouSure.bind(null, project));
    newRow.appendChild(deleteButton);
    const displayDate = format(project.dueDate, 'MM/dd/yyyy');
    newRow.appendChild(subDiv('', DateGeneralIcon, `Due: ${displayDate}`));
    parent.appendChild(newRow);
    const projectName = document.createElement('h1');
    projectName.innerHTML = project.name;
    parent.appendChild(projectName);
    const projectDescription = document.createElement('h3');
    projectDescription.innerHTML = project.description;
    parent.appendChild(projectDescription);
    const heading = document.createElement('h2');
    heading.innerHTML = 'Current Tasks';
    heading.appendChild(newButton('showCompletedTasks', CompletedIcon, 'Show Completed', completedTasks.bind(null, project)));
    heading.appendChild(newButton('addTask', AddIcon, 'Add Task', createNewTask.bind(null, project)));
    parent.appendChild(heading);
    parent.appendChild(makeTaskList(project, false, taskList));
};

const createNewProject = function generateSectionToCreateNewProject(parentDiv) {
    clearElement(parentDiv);
    const descriptionSection = document.createElement('label');
    descriptionSection.setAttribute('for', 'newProjectDescription');
    descriptionSection.innerHTML = 'Description';
    const descriptionSectionText = document.createElement('textarea');
    descriptionSectionText.setAttribute('id', 'newProjectDescription');
    descriptionSectionText.setAttribute('placeholder', 'Project description here...');
    descriptionSection.appendChild(descriptionSectionText);

    parentDiv.appendChild(newInput('text', 'newProjectName', 'Project Name', 'Y'));
    parentDiv.appendChild(descriptionSection);
    parentDiv.appendChild(newInput('date', 'newProjectDate', 'Due Date', 'Y'));
    parentDiv.appendChild(newButton('saveNewProject', SaveIcon, 'Save', saveNewProject));
};

const createNewTask = function generateSectionToCreateNewTask(project) {
    const parent = document.querySelector('#taskList');
    const newTaskDiv = document.createElement('div');
    newTaskDiv.setAttribute('id', 'newTaskDiv');
    const heading = document.createElement('h2');
    heading.innerHTML = 'New Task';
    newTaskDiv.appendChild(heading);
    newTaskDiv.appendChild(newInput('text', 'newTaskName', 'Task Name', 'Y'));
    newTaskDiv.appendChild(newInput('date', 'newTaskDueDate', 'Due Date', 'Y'));
    newTaskDiv.appendChild(newButton('saveNewTask', SaveIcon, 'Save', saveNewTask.bind(null,'saveNewTask', 'newTaskName', 'newTaskDueDate', project, parent)));
    clearElement(parent);
    parent.style.display = 'flex';
    parent.appendChild(newTaskDiv);
};

const staticContent = function generateStaticContent() {
    const body = document.querySelector('body');
    const highLevelItems = document.createElement('div');
    highLevelItems.setAttribute('id', 'highLevelItems');

    const timeDueSection = document.createElement('div');
    timeDueSection.appendChild(subDiv('pastDue', DatePastIcon, 'Past Due', taskDisplay.bind(null, taskListPast, 'Past Due Tasks')));
    timeDueSection.appendChild(subDiv('todayDue', DateTodayIcon, 'Due Today', taskDisplay.bind(null, taskListToday, "Today's Tasks")));
    timeDueSection.appendChild(subDiv('soonDue', DateSoonIcon, 'Due Soon', taskDisplay.bind(null, taskListSoon, 'Upcoming Tasks')));

    const projectMenu = document.createElement('div');
    projectMenu.setAttribute('id', 'projectMenu');
    const projectHeadline = document.createElement('h2');
    projectHeadline.innerHTML = 'Projects'
    const listOfProjects = document.createElement('div');
    listOfProjects.setAttribute('id', 'listOfProjects');
    projectMenu.appendChild(projectHeadline);
    projectMenu.appendChild(listOfProjects);

    projectMenu.appendChild(newButton('newProjectButton', AddIcon, 'New Project', newProject));

    highLevelItems.appendChild(timeDueSection);
    highLevelItems.appendChild(projectMenu);

    const detailItems = document.createElement('div');
    detailItems.setAttribute('id', 'detailItems');

    body.innerHTML = '';
    body.appendChild(highLevelItems);
    body.appendChild(detailItems);
};

const subDiv = function generateSubDiv(id, importedIconName, readableWords, functionOnClick) {
    const subDiv = document.createElement('div');
    subDiv.setAttribute('id', id);
    const icon = new Image();
    icon.src = importedIconName;
    subDiv.appendChild(icon);
    const divText = document.createElement('span');
    divText.innerHTML += ` ${readableWords}`;
    subDiv.appendChild(divText);
    if (arguments.length > 3) {
        subDiv.addEventListener('click', () => {
            functionOnClick();
        });
    };
    return subDiv;
};

const taskDate = function generateTaskDateDisplay(task) {
    const date = format(task.dueDate, 'MM/dd/yyyy');
    const dateRow = subDiv('', DateGeneralIcon, date);
    dateRow.classList.add('taskRow');
    return dateRow;
};

const taskDisplay = function generateTaskDisplay(arrayToUse, displayText) {
    const parent = document.querySelector('#detailItems');
    clearElement(parent);
    let array = taskListPast;
    let string = 'Tasks';
    if (arguments.length === 0){
        string = 'Past Due Tasks';
        if (array.length < 5) {
            array.concat(taskListToday);
            string = "Past Due & Today's Tasks"
        };
        if (array.length < 5) {
            array.concat(taskListSoon);
            string = 'Past Due & Upcoming Tasks'
        };
        if (array.length < 5) {
            array = taskList;
            string = 'Task List'
        };
    } else {
        string = displayText;
        array = arrayToUse;
    };
    const heading = document.createElement('h1');
    heading.innerHTML = string;
    parent.appendChild(heading);
    parent.appendChild(makeTaskList('', false, array));
};

const makeTaskList = function generateTaskList(project, completed, array) {
    const taskDisplaySection = document.createElement('div');
    taskDisplaySection.setAttribute('id', 'taskList');
    taskDisplaySection.classList.add('listOfTasks');
    for (let i = 0; i < array.length; i++) {
        let task = array[i];
        let taskId = task.parentId;
        let taskComplete = task.completed;
        if (project !== ''){
            let projectId = project.id
            if (taskId === projectId && taskComplete === completed) {
                taskDisplaySection.style.display = 'grid';
                taskDisplaySection.appendChild(taskName(task, i, projectDetail.bind(null, project)));
                taskDisplaySection.appendChild(taskDate(task));
            };
        } else if (taskComplete === completed) {
            taskDisplaySection.style.display = 'grid';
            taskDisplaySection.appendChild(taskName(task, i, taskDisplay));
            taskDisplaySection.appendChild(taskDate(task));
        };
    };
    return taskDisplaySection;
};

const taskName = function generateTaskNameDisplay(task, i, regen) {
    const taskDiv = document.createElement('div');
    const checkBox = new Image();
    if (task.completed) {
        checkBox.src = CompletedIcon;
    } else {
        checkBox.src = IncompleteIcon;
    };
    const id = `checkbox-${i}`;
    checkBox.setAttribute('id', id);
    listenTaskComplete(task, checkBox, regen);
    taskDiv.appendChild(checkBox);
    let label = document.createElement('label');
    label.setAttribute('for', id);
    label.innerHTML = task.name;
    taskDiv.appendChild(label);
    taskDiv.classList.add('taskRow');
    return taskDiv;
};