// Step 1: Basic setup for reading file input and initializing file selection

document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector'); // Selecting the file input element

    // Adding an event listener to handle file selection
    folderSelector.addEventListener('change', event => {
        const files = Array.from(event.target.files); // Converting FileList to an Array
        console.log(files); // Logging the list of selected files to the console
    });
});


// Step 2: Adding functionality to build a basic directory structure from selected files

document.addEventListener('DOMContentLoaded', () => {
    const folderSelector = document.getElementById('folderSelector');

    folderSelector.addEventListener('change', event => {
        const files = Array.from(event.target.files);
        const structure = buildStructure(files); // Build directory structure from files
        console.log(structure); // Log the structured directory to the console
    });

    // Function to organize files into a hierarchical structure based on their paths
    function buildStructure(files) {
        const root = {}; // Creating the root of the directory structure
        files.forEach(file => {
            const parts = file.webkitRelativePath.split('/'); // Splitting the file path
            let currentLevel = root; // Starting from the root
            parts.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = index === parts.length - 1 ? file : {}; // Creating nodes in the structure
                }
                currentLevel = currentLevel[part]; // Navigating deeper
            });
        });
        return root; // Returning the built structure
    }
});


// Step 3: Displaying the hierarchical structure in the DOM

document.addEventListener('DOMContentLoaded', () => {
    const folderContents = document.getElementById('folderContents');
    const folderSelector = document.getElementById('folderSelector');

    folderSelector.addEventListener('change', event => {
        const files = Array.from(event.target.files);
        const structure = buildStructure(files);
        displayStructure(structure, folderContents); // Displaying the structured files
    });

    function buildStructure(files) {
        const root = {};
        files.forEach(file => {
            const parts = file.webkitRelativePath.split('/');
            let currentLevel = root;
            parts.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = index === parts.length - 1 ? file : {};
                }
                currentLevel = currentLevel[part];
            });
        });
        return root;
    }

    // Function to display structured directory in the DOM
    function displayStructure(structure, parentElement) {
        for (let key in structure) {
            const item = structure[key];
            const itemElement = document.createElement('div');
            itemElement.textContent = key;
            parentElement.appendChild(itemElement); // Adding each item to the parent element

            if (typeof item === 'object' && !(item instanceof File)) {
                const container = document.createElement('div');
                itemElement.appendChild(container);
                displayStructure(item, container); // Recursively display nested items
            }
        }
    }
});
