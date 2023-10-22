import './style.css';
import {generateMainContent, } from './domGenerator.js';
import {localStorageGet, projectList, taskList} from './projectsAndTasks.js';

window.addEventListener('DOMContentLoaded', () => {
    localStorageGet(projectList, 'project');
    localStorageGet(taskList, 'task');
    generateMainContent();
});
