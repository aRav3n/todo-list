import DeleteIcon from './images/delete.svg';
import DateTodayIcon from './images/date-today.svg';
import DateSoonIcon from './images/date-soon.svg';
import DatePastIcon from './images/date-past.svg';
import DateGeneralIcon from './images/date-general.svg';
import AddIcon from './images/add.svg';
import SaveIcon from './images/save.svg';

const clearParentDiv = function(parentDiv) {
    parentDiv.innerHTML = ''
};

const makeNewDivButton = function(id, importedIconName, label, parentDiv) {
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
}

export function generateStaticContent() {
    const body = document.querySelector('body');
    const highLevelItems = document.createElement('div');
    highLevelItems.setAttribute('id', 'highLevelItems');

    const timeDueSection = document.createElement('div');
    const generateSubDiv = function(id, importedIconName, readableWords, parentDiv) {
        const timeDue = document.createElement('div');
        timeDue.setAttribute('id', id);
        const icon = new Image();
        icon.src = importedIconName;
        timeDue.appendChild(icon);
        const timeDueWords = document.createElement('span');
        timeDueWords.innerHTML += ` ${readableWords}`;
        timeDue.appendChild(timeDueWords);
        parentDiv.appendChild(timeDue);
    };
    generateSubDiv('pastDue', DatePastIcon, 'Past Due', timeDueSection);
    generateSubDiv('todayDue', DateTodayIcon, 'Due Today', timeDueSection);
    generateSubDiv('soonDue', DateSoonIcon, 'Due Soon', timeDueSection);

    const projectMenu = document.createElement('div');
    projectMenu.setAttribute('id', 'projectMenu');
    const projectHeadline = document.createElement('h2');
    projectHeadline.innerHTML = 'Projects'
    const projectList = document.createElement('div');
    projectList.setAttribute('id', 'projectList');
    projectMenu.appendChild(projectHeadline);
    projectMenu.appendChild(projectList);

    makeNewDivButton('newProjectButton', AddIcon, 'New Project', projectMenu);

    highLevelItems.appendChild(timeDueSection);
    highLevelItems.appendChild(projectMenu);
    body.appendChild(highLevelItems);

    const detailItems = document.createElement('div');
    detailItems.setAttribute('id', 'detailItems');
    body.appendChild(detailItems);
};

export function generateSectionToCreateNewProject(parentDiv) {
    clearParentDiv(parentDiv);
    const generateNewInputSection = function(type, id, labelText) {
        const inputField = document.createElement('input');
        inputField.setAttribute('type', type);
        inputField.setAttribute('id', id);
        inputField.setAttribute('name', id);
        const fieldLabel = document.createElement('label');
        fieldLabel.setAttribute('for', id);
        fieldLabel.innerHTML = labelText;
        fieldLabel.appendChild(inputField);
        parentDiv.appendChild(fieldLabel);
    };
    const descriptionSection = document.createElement('label');
    descriptionSection.setAttribute('for', 'newProjectDescription');
    descriptionSection.innerHTML = 'Description';
    const descriptionSectionText = document.createElement('textarea');
    descriptionSectionText.setAttribute('id', 'newProjectDescription');
    descriptionSectionText.setAttribute('placeholder', 'Project description here...');
    descriptionSection.appendChild(descriptionSectionText);

    generateNewInputSection('text', 'newProjectName', 'Project Name');
    parentDiv.appendChild(descriptionSection);
    generateNewInputSection('date', 'newProjectDate', 'Due Date');
    const saveButton = makeNewDivButton('saveNewProject', SaveIcon, 'Save', parentDiv);
};