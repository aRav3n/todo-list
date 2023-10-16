import './style.css';
import {generateMainContent, generateSectionToCreateNewProject, } from './domGenerator.js';

window.addEventListener('DOMContentLoaded', () => {
    generateMainContent();
    const detailItemsSection = document.querySelector('#detailItems');

    const newProjectButton = document.querySelector('#newProjectButton');
    newProjectButton.addEventListener('click', () => {
        generateSectionToCreateNewProject(detailItemsSection);
    });
});
