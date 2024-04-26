// Step 1: Basic setup to handle DOM content loaded and file input changes
document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector');

    folderSelector.addEventListener('change', event => {
        console.log('Files selected:', event.target.files);
    });
});
