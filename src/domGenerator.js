

export function generateStaticContent() {
    const body = document.querySelector('body');
    const highLevelItems = document.createElement('div');
    const detailItems = document.createElement('div');
    highLevelItems.setAttribute('id', 'highLevelItems');
    detailItems.setAttribute('id', 'detailItems');

    const newProjectButton = document.createElement('button');
    newProjectButton.setAttribute('type', 'button');

};