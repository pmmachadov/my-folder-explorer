// This line listens for the DOMContentLoaded event, which fires when the HTML document has been fully loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Retrieve elements from the DOM that will be manipulated or interacted with.
    const folderContents = document.getElementById('folderContents');
    const folderSelector = document.getElementById('folderSelector');

    // Add an event listener to the file input element for when the user selects files.
    folderSelector.addEventListener('change', event => {
        // Converts the FileList object into an array to facilitate manipulation.
        //         En JavaScript, puedes usar diferentes tipos de eventos para un input de tipo archivo.El evento change es comúnmente utilizado porque se dispara cada vez que el valor del elemento de entrada cambia, es decir, cuando el usuario selecciona un nuevo archivo o archivos.Sin embargo, puedes considerar otros eventos dependiendo de lo que necesitas lograr.Aquí hay algunas alternativas:

        //         input: Este evento es similar a change, pero para inputs de tipo archivo no hay mucha diferencia práctica.Se dispara cuando el valor de un < input > o < textarea > cambia.

        //             click: Este evento podría usarse para realizar alguna acción justo antes de que se abra el cuadro de diálogo de archivos, aunque no detectará cambios en los archivos seleccionados por sí mismo.

        // focus y blur: Estos eventos pueden ser útiles si necesitas realizar alguna acción cuando el input de archivos gana o pierde el foco, aunque no están directamente relacionados con la selección de archivos.

        // drag y drop: Estos eventos son útiles si estás implementando funcionalidad de arrastrar y soltar para la selección de archivos.

        // Permiten manejar los archivos que son arrastrados a un área específica y soltados allí.

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
            console.log(e.target.files);
            const parts = file.webkitRelativePath.split('/'); //file.webkitRelativePath: This is accessing the webkitRelativePath property of the file object. The file object here is assumed to have been retrieved from an input of type file with the webkitdirectory attribute enabled, which allows users to select directories instead of individual files. The webkitRelativePath provides the path of the file relative to the root of the directory selected by the user. For example, if a user selects a folder named Documents and within it a file located at Reports/2023/Report1.pdf, the webkitRelativePath would be Reports/2023/Report1.pdf.

            // .split('/'): This method is used to split a string into an array of substrings based on a specified delimiter, in this case, the forward slash(/). Splitting the string webkitRelativePath by / divides the path into its constituent directories and file name.Continuing with the earlier example, the result of file.webkitRelativePath.split('/') would be an array["Reports", "2023", "Report1.pdf"].

            //         const parts =: This initializes a constant named parts, assigning it the array resulting from the split operation.The use of const implies that the parts variable cannot be reassigned later in the code, ensuring the integrity of the data it holds.

            //             let currentLevel = root;
            // This line initializes currentLevel as a reference to the root object, which represents the top level of the directory structure.Initially, currentLevel points to this top - level object, and as the code iterates through parts of the path, currentLevel will be used to navigate and modify deeper levels of the structure.


            //             Ejemplo de cómo Funciona
            // Supongamos que tienes los siguientes archivos:

            //             documents / report / january / report.docx
            //             documents / report / february / report.docx
            // Al procesar estos archivos con el código, root se expandirá para incluir cada parte de la ruta como una clave en el objeto, con cada clave apuntando a otro objeto que representa la siguiente parte del camino, así:

            // {
            //     "documents": {
            //         "report": {
            //             "january": {
            //                 "report.docx": {
            //                     "_file": [File Object] // Contiene el objeto File real para 'january/report.docx'
            //                 }
            //             },
            //             "february": {
            //                 "report.docx": {
            //                     "_file": [File Object] // Contiene el objeto File real para 'february/report.docx'
            //                 }
            //             }
            //         }
            //     }
            // }


            //                 parts.forEach((part, index) => {...});
            // This loop iterates over each segment of the file's path (split into parts earlier), allowing the construction of a nested directory structure. Each part is a folder or file name derived from splitting the file's webkitRelativePath by '/'.

            //             if(!currentLevel[part]) {...}
            //     This conditional checks if a property corresponding to the current part exists in the current level of the directory structure(currentLevel).If it does not exist, it needs to be created.
            //         currentLevel[part] refers to a property of the object currentLevel where part is the key name(directory or file name).

            //             currentLevel[part] = index === parts.length - 1 ? { '_file': file } : {};

            // This line assigns a new object to currentLevel[part].

            // If the current part is the last segment of the path(index === parts.length - 1), it means this part represents a file.In this case, { '_file': file } is assigned, creating an object with a property _file that holds the File object.This signifies that the node in the structure is a file rather than a directory.

            // If it is not the last segment, an empty object { } is assigned, indicating that this node represents a directory that may contain more files or directories.

            //     currentLevel = currentLevel[part];
            // This updates currentLevel to point to the newly created object or existing object.This step is crucial as it moves the point of reference deeper into the directory structure, aligning with the depth of the current part in the file path.

            // On the next iteration, operations will be performed on this deeper level of the structure, enabling the construction of a nested hierarchy.

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
            // Example of the last file in the structure: {
            //     "module": {
            //         "config.json": { "_file": [Object File] },
            //         "src": {
            //             "index.js": { "_file": [Object File] },
            //             "app.js": { "_file": [Object File] }
            //         },
            //         "tests": {
            //             "test1.js": { "_file": [Object File] },
            //             "test2.js": { "_file": [Object File] }
            //         }
            //     }
            // }

        });
        return root;
    };

    // Function to display the folder/file structure.
    const displayStructure = (structure, parentElement, level = 0) => {
        Object.keys(structure).forEach(key => {
            // Ignore the '_file' key as it's used only to store file data.
            if (key === '_file') return;
            const item = structure[key];    // Retrieve the current item from the structure.
            const itemElement = document.createElement('div');  // Create a div element to represent the item.
            itemElement.textContent = key;  // Set the text content of the element to the item's name.
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
        event.stopPropagation(); // To avoid the event from propagating to parent elements, the stopPropagation method is called on the event object. It only opens or closes the file content when the file name is clicked and not the parent elements.

        // Retrieve the element intended to display file content.
        const contentDisplay = document.getElementById('fileContent');
        const reader = new FileReader(); // Create a new FileReader object to read the file.
        reader.onload = () => {
            // Create a pre element to preserve formatting of the file's text and display it.
            const pre = document.createElement('pre');
            pre.textContent = reader.result; // Assign the file content to the pre element's text content.
            pre.style.whiteSpace = 'pre-wrap'; // Preserve line breaks and spaces in the displayed text.
            contentDisplay.innerHTML = '';  // Clear the current content display.
            contentDisplay.appendChild(pre);    // Append the pre element to the content display.
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
            container.style.display = "block"; // Display the container as a block element. Block elements take up the full width available and start on a new line.
        } else {
            container.classList.add('hidden');
            container.style.display = "none";
        }
    };

});
