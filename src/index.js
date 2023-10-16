import './style.css';
import {generateStaticContent, generateSectionToCreateNewProject, } from './domGenerator.js';

window.addEventListener('DOMContentLoaded', () => {
    generateStaticContent();
    const detailItemsSection = document.querySelector('#detailItems');

    const newProjectButton = document.querySelector('#newProjectButton');
    newProjectButton.addEventListener('click', () => {
        generateSectionToCreateNewProject(detailItemsSection);
    });
});
