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
