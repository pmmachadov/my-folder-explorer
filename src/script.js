document.addEventListener("DOMContentLoaded", () => {
  const folderContents = document.getElementById("folderContents");
  const folderSelector = document.getElementById("folderSelector");
  const resizeHandle = document.getElementById("resizeHandle");
  const contentArea = document.getElementById("fileContent");

  let isResizing = false;
  let startY, startHeightTop, startHeightBottom;

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    startY = e.clientY;
    startHeightTop = folderContents.offsetHeight;
    startHeightBottom = contentArea.offsetHeight;

    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const diffY = e.clientY - startY;

    const containerHeight =
      folderContents.parentElement.offsetHeight - resizeHandle.offsetHeight;
    const newTopHeight = startHeightTop + diffY;
    const newBottomHeight = containerHeight - newTopHeight;

    if (newTopHeight >= 150 && newBottomHeight >= 150) {
      folderContents.style.height = `${newTopHeight}px`;
      folderContents.style.flex = "none";
      contentArea.style.height = `${newBottomHeight}px`;
      contentArea.style.flex = "none";
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  });

  folderSelector.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    folderContents.innerHTML = "";
    const structure = buildStructure(files);
    displayStructure(structure, folderContents);
  });

  const buildStructure = (files) => {
    const root = {};
    files.forEach((file) => {
      const parts = file.webkitRelativePath.split("/");
      let currentLevel = root;
      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] =
            index === parts.length - 1 ? { _file: file } : {};
        }
        currentLevel = currentLevel[part];
      });
    });
    return root;
  };
  const displayStructure = (structure, parentElement, level = 0) => {
    const levelWrapper = document.createElement("div");
    levelWrapper.className = "level-wrapper";
    levelWrapper.style.paddingLeft = `${level * 15}px`;

    const sortedKeys = Object.keys(structure)
      .filter((key) => key !== "_file")
      .sort((a, b) => {
        const aIsFile = structure[a]["_file"];
        const bIsFile = structure[b]["_file"];
        if (aIsFile && !bIsFile) return 1;
        if (!aIsFile && bIsFile) return -1;
        return a.localeCompare(b);
      });

    sortedKeys.forEach((key) => {
      const item = structure[key];
      const isFile = item["_file"];

      const itemElement = document.createElement("div");
      itemElement.className = isFile ? "file" : "directory";

      const iconSpan = document.createElement("span");
      iconSpan.className = "item-icon";

      const labelSpan = document.createElement("span");
      labelSpan.className = "item-label";
      labelSpan.textContent = key;

      itemElement.appendChild(iconSpan);
      itemElement.appendChild(labelSpan);

      if (isFile) {
        const fileExt = key.split(".").pop().toLowerCase();
        itemElement.setAttribute("data-type", fileExt);

        itemElement.addEventListener("click", (event) =>
          displayFileContent(item["_file"], event)
        );
      } else {
        const container = document.createElement("div");
        container.className = "folder-content hidden";

        const toggleBtn = document.createElement("span");
        toggleBtn.className = "toggle-btn";
        toggleBtn.innerHTML = "+";
        itemElement.insertBefore(toggleBtn, iconSpan);

        itemElement.addEventListener("click", (event) => {
          toggleDirectoryContents(container, event);
          const button = itemElement.querySelector(".toggle-btn");
          if (container.classList.contains("hidden")) {
            button.innerHTML = "+";
          } else {
            button.innerHTML = "-";
          }
        });

        displayStructure(item, container, level + 1);
        levelWrapper.appendChild(container);
      }

      levelWrapper.appendChild(itemElement);
    });

    parentElement.appendChild(levelWrapper);
  };
  const displayFileContent = (file, event) => {
    event.stopPropagation();
    const contentDisplay = document.getElementById("fileContent");
    const reader = new FileReader();

    contentDisplay.innerHTML =
      '<div class="loading">Cargando contenido...</div>';

    const previousSelected = document.querySelector(".file.selected");
    if (previousSelected) {
      previousSelected.classList.remove("selected");
    }
    event.currentTarget.classList.add("selected");

    reader.onload = () => {
      const pre = document.createElement("pre");
      pre.textContent = reader.result;

      const fileInfo = document.createElement("div");
      fileInfo.className = "file-info";
      fileInfo.innerHTML = `<strong>${file.name}</strong> (${formatFileSize(
        file.size
      )})`;

      contentDisplay.innerHTML = "";
      contentDisplay.appendChild(fileInfo);
      contentDisplay.appendChild(pre);

      if (window.innerWidth < 768) {
        contentDisplay.scrollIntoView({ behavior: "smooth" });
      }
    };

    reader.onerror = () => {
      contentDisplay.innerHTML = `<div class="error">Error: No se pudo leer el archivo ${file.name}</div>`;
      console.error("File could not be read: " + reader.error.message);
    };

    reader.readAsText(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const toggleDirectoryContents = (container, event) => {
    event.stopPropagation();

    const directory = event.currentTarget;

    if (container.classList.contains("hidden")) {
      container.classList.remove("hidden");
      container.style.maxHeight = "0";
      container.style.display = "block";
      container.style.overflow = "hidden";

      setTimeout(() => {
        container.style.maxHeight = container.scrollHeight + "px";

        directory.classList.add("open");
      }, 10);

      setTimeout(() => {
        container.style.maxHeight = "";
        container.style.overflow = "visible";
      }, 310);
    } else {
      container.style.maxHeight = container.scrollHeight + "px";
      container.style.overflow = "hidden";

      container.offsetHeight;

      container.style.maxHeight = "0";

      directory.classList.remove("open");

      setTimeout(() => {
        container.classList.add("hidden");
        container.style.display = "none";
      }, 300);
    }
  };
});
