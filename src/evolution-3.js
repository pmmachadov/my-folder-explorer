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