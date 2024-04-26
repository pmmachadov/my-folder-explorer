// This line listens for the DOMContentLoaded event, which fires when the HTML document has been fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Retrieve elements from the DOM that will be manipulated or interacted with.
    const folderContents = document.getElementById('folderContents');
    const folderSelector = document.getElementById('folderSelector');

    // Add an event listener to the file input element for when the user selects files.
    folderSelector.addEventListener('change', event => {
        // Converts the FileList object into an array to facilitate manipulation.
        const files = Array.from(event.target.files);
        // Clear the current folder contents display.
        folderContents.innerHTML = '';
        // Construct a hierarchical structure based on the file paths.
        const structure = buildStructure(files);
        // Display the constructed folder/file structure in the UI.
        displayStructure(structure, folderContents);
    });

    // Function to build a nested object structure representing folder and file hierarchy.
    const buildStructure = files => {
        const root = {}; // Initialize the root of the structure.
        files.forEach(file => {
            // Split the file's relative path into parts to create nested objects.
            const parts = file.webkitRelativePath.split('/');
            let currentLevel = root;
            parts.forEach((part, index) => {
                // Create a nested object for each part of the path if it does not already exist.
                if (!currentLevel[part]) {
                    // The last part of the path is a file; otherwise, it's a directory.
                    currentLevel[part] = index === parts.length - 1 ? { '_file': file } : {};
                }
                // Move deeper into the structure.
                currentLevel = currentLevel[part];
            });
        });
        return root;
    };

    // Function to display the folder/file structure.
    const displayStructure = (structure, parentElement, level = 0) => {
        Object.keys(structure).forEach(key => {
            // Ignore the '_file' key as it's used only to store file data.
            if (key === '_file') return;

            const item = structure[key];
            const itemElement = document.createElement('div');
            itemElement.textContent = key;
            // Indent child elements to visually represent nesting.
            itemElement.style.paddingLeft = `${level * 20}px`;
            // Apply a class based on whether the item is a file or directory.
            itemElement.classList.add(item['_file'] ? 'file' : 'directory');

            if (item['_file']) {
                // If the item is a file, add an event listener to display its content on click.
                itemElement.addEventListener('click', event => displayFileContent(item['_file'], event));
            } else {
                // If it's a directory, create a container for its contents and hide it by default.
                const container = document.createElement('div');
                container.className = 'content hidden';
                itemElement.appendChild(container);
                itemElement.addEventListener('click', event => toggleDirectoryContents(container, event));
                // Recursively display nested structures.
                displayStructure(item, container, level + 1);
            }

            // Append the item element to its parent element in the DOM.
            parentElement.appendChild(itemElement);
        });
    };

    // Function to display the contents of a file.
    const displayFileContent = (file, event) => {
        // Prevent the event from propagating to avoid triggering parent element events.
        event.stopPropagation();
        // Retrieve the element intended to display file content.
        const contentDisplay = document.getElementById('fileContent');
        const reader = new FileReader();
        reader.onload = () => {
            // Create a pre element to preserve formatting of the file's text and display it.
            const pre = document.createElement('pre');
            pre.textContent = reader.result;
            pre.style.whiteSpace = 'pre-wrap';
            contentDisplay.innerHTML = '';
            contentDisplay.appendChild(pre);
        };
        reader.onerror = () => {
            // Log an error message if the file could not be read.
            console.error("File could not be read: " + reader.error.message);
        };
        // Initiate reading the file as text.
        reader.readAsText(file);
    };

    // Function to toggle the visibility of a directory's contents.
    const toggleDirectoryContents = (container, event) => {
        // Prevent the event from propagating to avoid triggering parent element events.
        event.stopPropagation();
        // Toggle visibility and display style based on current state.
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            container.style.display = "block";
        } else {
            container.classList.add('hidden');
            container.style.display = "none";
        }
    };

});
