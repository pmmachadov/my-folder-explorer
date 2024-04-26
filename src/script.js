// Adding an event listener to wait for the DOM content to be fully loaded before running the code
document.addEventListener('DOMContentLoaded', () => {
    // Retrieving HTML elements by their ID to manipulate or use later
    const folderContents = document.getElementById('folderContents');
    const folderSelector = document.getElementById('folderSelector');

    // Adding an event listener to handle 'change' events on folderSelector
    folderSelector.addEventListener('change', event => {
        // Converts the FileList object into an Array for easier manipulation
        const files = Array.from(event.target.files);
        // Resets the innerHTML of the folderContents to an empty string to clear previous content
        folderContents.innerHTML = '';
        // Calling buildStructure to organize files into a hierarchical structure
        const structure = buildStructure(files);
        // Displaying the structured files in the folderContents element
        displayStructure(structure, folderContents);
    });

    // Function to build a hierarchical directory structure from a list of files
    function buildStructure(files) {
        const root = {}; // Initial empty object to hold the directory structure
        files.forEach(file => {
            // Extracting the relative path of the file and splitting into components
            const parts = file.webkitRelativePath.split('/');
            let currentLevel = root; // Starting from the root of our structure
            parts.forEach((part, index) => {
                // If current part of the path doesn't exist at the current level, create it
                if (!currentLevel[part]) {
                    currentLevel[part] = index === parts.length - 1 ? { '_file': file } : {};
                }
                // Moving deeper into the structure
                currentLevel = currentLevel[part];
            });
        });
        return root; // Return the fully built directory structure
    }

    // Recursive function to display the hierarchical structure in the DOM
    function displayStructure(structure, parentElement, level = 0) {
        Object.keys(structure).forEach(key => {
            if (key === '_file') return; // Skip the internal '_file' property used to store file references

            const item = structure[key];
            const itemElement = document.createElement('div'); // Create a new div for this item
            itemElement.textContent = key;
            // Style to indent items according to their level in the hierarchy
            itemElement.style.paddingLeft = `${level * 20}px`;
            // Add class based on whether the item is a file or directory
            itemElement.classList.add(item['_file'] ? 'file' : 'directory');

            if (item['_file']) {
                // If it's a file, add click listener to display its content
                itemElement.addEventListener('click', (event) => displayFileContent(item['_file'], event));
            } else {
                // If it's a directory, create a container div and make it collapsible
                const container = document.createElement('div');
                container.className = 'content hidden';
                itemElement.appendChild(container);
                itemElement.addEventListener('click', event => {
                    toggleDirectoryContents(container, event);
                });
                // Recursively display the contents of this directory
                displayStructure(item, container, level + 1);
            }

            // Append the current item element to the parent element
            parentElement.appendChild(itemElement);
        });
    }

    // Function to display the content of a file
    function displayFileContent(file, event) {
        event.stopPropagation(); // Stop the event from propagating to prevent unexpected behavior
        const contentDisplay = document.getElementById('fileContent');
        const reader = new FileReader();
        reader.onload = () => {
            // Create a pre element to preserve formatting of the file's content
            const pre = document.createElement('pre');
            pre.textContent = reader.result;
            pre.style.whiteSpace = 'pre-wrap'; // Ensure that whitespace is preserved
            contentDisplay.innerHTML = ''; // Clear previous contents
            contentDisplay.appendChild(pre); // Display the file's content
        };
        reader.onerror = () => {
            // Log an error if the file could not be read
            console.error("File could not be read: " + reader.error.message);
        };
        reader.readAsText(file); // Read the file as text
    }

    // Function to toggle the visibility of directory contents
    function toggleDirectoryContents(container, event) {
        event.stopPropagation(); // Stop the event from propagating to prevent unexpected behavior

        if (container.classList.contains('hidden')) {
            // If the container is hidden, show it
            container.classList.remove('hidden');
            container.style.display = "block";
        } else {
            // If the container is visible, hide it
            container.classList.add('hidden');
            container.style.display = "none";
        }
    }

});
