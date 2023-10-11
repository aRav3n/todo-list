import DeleteIcon from './images/delete.svg';
import DateTodayIcon from './images/date-today.svg';
import DateSoonIcon from './images/date-soon.svg';
import DatePastIcon from './images/date-past.svg';
import DateGeneralIcon from './images/date-general.svg';
import AddIcon from './images/add.svg';

export function generateStaticContent() {
    const body = document.querySelector('body');
    const highLevelItems = document.createElement('div').setAttribute('id', 'highLevelItems');

    const timeDueSection = document.createElement('div');
    const pastDue = document.createElement('span').setAttribute('id', 'pastDue');
    const pastDueIcon = new Image();
    pastDueIcon.src = DatePastIcon;
    pastDue.innerHTML =`${pastDueIcon} Past Due`;
    const todayDue = document.createElement('span').setAttribute('id', 'todayDue');
    const todayDueIcon = new Image();
    todayDueIcon.src = DateTodayIcon;
    todayDue.innerHTML = `${todayDueIcon} Due Today`;
    const soonDue = document.createElement('span').setAttribute('id', 'soonDue')
    const soonDueIcon = new Image();
    soonDueIcon.src = DateSoonIcon;
    soonDue.innerHTML = `${soonDueIcon} Due Soon`;
    timeDueSection.appendChild(pastDue);
    timeDueSection.appendChild(todayDue);
    timeDueSection.appendChild(soonDue);

    const projectMenu = document.createElement('div').setAttribute('id', 'projectMenu');
    const newProjectButton = document.createElement('button').setAttribute('type', 'button');
    newProjectButton.setAttribute('id', 'newProjectButton');
    const addIcon = new Image();
    addIcon.src = AddIcon;
    newProjectButton.innerHTML = `${addIcon} New Project`;
    const projectHeadline = document.createElement('h2');
    projectHeadline.innerHTML = 'Projects'
    const projectList = document.createElement('div').setAttribute('id', 'projectList');
    projectMenu.appendChild(newProjectButton);
    projectMenu.appendChild(projectHeadline);
    projectMenu.appendChild(projectList);

    highLevelItems.appendChild(timeDueSection);
    highLevelItems.appendChild(projectMenu);
    body.appendChild(highLevelItems);





    const detailItems = document.createElement('div').setAttribute('id', 'detailItems');
};