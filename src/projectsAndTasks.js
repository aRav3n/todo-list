import {compareAsc, parseISO} from 'date-fns';

export const projectList = [];
export const taskList = [];
const lifeProject = generateNewProject('Life', 'General life tasks', '2200-01-01');
insertIntoList(lifeProject, projectList);

export function generateNewProject(name, description, dueDate) {
    const id = `project-${projectList.length + 1}`;
    return {name, description, dueDate, id};
};

export function generateNewTask(name, dueDate, parentId) {
    return {name, dueDate, parentId};
}

export function insertIntoList(item, list) {
    const oldDate = item.dueDate;
    const correctedFormatDate = parseISO(oldDate);
    item.dueDate = correctedFormatDate;
    list.push(item);
    if (list.length > 1){
        list.sort((a,b) => compareAsc(a.dueDate, b.dueDate));
    };
};