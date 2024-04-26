document.addEventListener('DOMContentLoaded', () => {
    const folderContents = document.getElementById('folderContents');
    const folderSelector = document.getElementById('folderSelector');

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
            itemElement.style.paddingLeft = `${level * 20}px`;
            itemElement.classList.add(item['_file'] ? 'file' : 'directory');

            if (item['_file']) {
                itemElement.addEventListener('click', event => displayFileContent(item['_file'], event));
            } else {
                const container = document.createElement('div');
                container.className = 'content hidden';
                itemElement.appendChild(container);
                itemElement.addEventListener('click', event => toggleDirectoryContents(container, event));
                displayStructure(item, container, level + 1);
            }

            parentElement.appendChild(itemElement);
        });
    };

    const displayFileContent = (file, event) => {
        event.stopPropagation();
        const contentDisplay = document.getElementById('fileContent');
        const reader = new FileReader();
        reader.onload = () => {
            const pre = document.createElement('pre');
            pre.textContent = reader.result;
            pre.style.whiteSpace = 'pre-wrap';
            contentDisplay.innerHTML = '';
            contentDisplay.appendChild(pre);
        };
        reader.onerror = () => {
            console.error("File could not be read: " + reader.error.message);
        };
        reader.readAsText(file);
    };

    const toggleDirectoryContents = (container, event) => {
        event.stopPropagation();
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            container.style.display = "block";
        } else {
            container.classList.add('hidden');
            container.style.display = "none";
        }
    };

});
