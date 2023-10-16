import {compareAsc, parseISO} from 'date-fns';

export const projectList = [];
const lifeProject = generateNewProject('Life', 'General life tasks', '2200-01-01');
insertIntoList(lifeProject, projectList);

export function generateNewProject(name, description, dueDate) {
    const id = `project-${projectList.length + 1}`;
    const taskList = [];
    return {name, description, dueDate, taskList, id};
};

export function insertIntoList(item, list) {
    const oldDate = item.dueDate;
    const correctedFormatDate = parseISO(oldDate);
    item.dueDate = correctedFormatDate;
    list.push(item);
    if (list.length > 1){
        list.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    };
};