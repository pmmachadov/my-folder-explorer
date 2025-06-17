require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const net = require("net");

let PORT = parseInt(process.env.PORT) || 3000;

const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once("error", () => resolve(true))
      .once("listening", () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
};

const server = http.createServer((req, res) => {
  let filePath = "." + req.url;
  if (filePath === "./") {
    filePath = "./index.html";
  }

  const extname = String(path.extname(filePath)).toLowerCase();

  const contentTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  const contentType = contentTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        fs.readFile("./404.html", (err, content) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content, "utf-8");
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const startServer = async () => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const currentPort = PORT + attempt;
    const inUse = await isPortInUse(currentPort);

    if (!inUse) {
      server.listen(currentPort, () => {
        console.log(`Server running on port ${currentPort}`);
        console.log(`Open http://localhost:${currentPort} in your browser`);
      });
      return;
    }
    console.log(`Port ${currentPort} is in use, trying another...`);
  }

  console.error("Could not find an available port after multiple attempts.");
  process.exit(1);
};

startServer();
