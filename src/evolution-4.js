// Step 4: Recursive display of the file structure and add basic interaction
document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector');
    const folderContents = document.getElementById('folderContents');

    folderSelector.addEventListener('change', event => {
        const files = Array.from(event.target.files);
        folderContents.innerHTML = '';
        const structure = buildStructure(files);
        displayStructure(structure, folderContents);
    });

    const buildStructure = files => {
        const root = {};
        files.forEach(file => {
            const parts = file.webkitRelativePath.split('/');
            let currentLevel = root;
            parts.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = index === parts.length - 1 ? { '_file': file } : {};
                }
                currentLevel = currentLevel[part];
            });
        });
        return root;
    };

    const displayStructure = (structure, parentElement, level = 0) => {
        Object.keys(structure).forEach(key => {
            if (key === '_file') return;

            const item = structure[key];
            const itemElement = document.createElement('div');
            itemElement.textContent = key;
            itemElement.style.paddingLeft = `${level * 20} px`;
            parentElement.appendChild(itemElement);

            if (!item['_file']) {
                const container = document.createElement('div');
                itemElement.appendChild(container);
                displayStructure(item, container, level + 1);
            }
        });
    };
});

