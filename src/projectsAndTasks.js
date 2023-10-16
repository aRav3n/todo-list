import {compareAsc, parseISO} from 'date-fns';

export const projectList = [];

export function generateNewProject(name, description, dueDate) {

    return {name, description, dueDate};
};

export function insertIntoProjectList(newProject) {
    projectList.push(newProject);
    if (projectList.length > 1){
        projectList.sort((a,b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)));
    };
};