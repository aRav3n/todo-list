import {compareAsc, parseISO} from 'date-fns';

export const projectList = [];
const lifeProject = generateNewProject('Life', 'General life tasks', '2200-01-01');
insertIntoProjectList(lifeProject);

export function generateNewProject(name, description, dueDate) {
    const id = `project-${projectList.length + 1}`;
    const taskList = [];
    return {name, description, dueDate, taskList, id};
};

export function insertIntoProjectList(newProject) {
    projectList.push(newProject);
    if (projectList.length > 1){
        projectList.sort((a,b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)));
    };
};