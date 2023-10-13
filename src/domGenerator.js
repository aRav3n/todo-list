import DeleteIcon from './images/delete.svg';
import DateTodayIcon from './images/date-today.svg';
import DateSoonIcon from './images/date-soon.svg';
import DatePastIcon from './images/date-past.svg';
import DateGeneralIcon from './images/date-general.svg';
import AddIcon from './images/add.svg';

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
    generateSubDiv('newProjectButton', AddIcon, 'New Project', projectMenu);

    highLevelItems.appendChild(timeDueSection);
    highLevelItems.appendChild(projectMenu);
    body.appendChild(highLevelItems);





    const detailItems = document.createElement('div');
    detailItems.setAttribute('id', 'detailItems');
};