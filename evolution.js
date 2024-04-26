// ### Step 1: Basic Structure Setup and Event Listener

// Step 1: Basic setup to handle DOM content loaded and file input changes
document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector');

    folderSelector.addEventListener('change', event => {
        console.log('Files selected:', event.target.files);
    });
});


// ### Step 2: Display Files in a Basic List

// Step 2: Display the files in a basic list
document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector');
    const folderContents = document.getElementById('folderContents');

    folderSelector.addEventListener('change', event => {
        const files = Array.from(event.target.files);
        folderContents.innerHTML = ''; // Clear previous contents
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.textContent = file.name;
            folderContents.appendChild(fileElement);
        });
    });
});


// ### Step 3: Introduce File Structure Building

// Step 3: Build a nested structure based on file paths
document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector');
    const folderContents = document.getElementById('folderContents');

    folderSelector.addEventListener('change', event => {
        const files = Array.from(event.target.files);
        folderContents.innerHTML = '';
        const structure = buildStructure(files);
        console.log('Folder Structure:', structure);
    });

    const buildStructure = files => {
        const root = {};
        files.forEach(file => {
            const parts = file.webkitRelativePath.split('/');
            let currentLevel = root;
            parts.forEach(part => {
                if (!currentLevel[part]) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part];
            });
        });
        return root;
    };
});


// ### Step 4: Recursive Display of Nested File Structure

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

