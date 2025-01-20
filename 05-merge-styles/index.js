const fs = require("fs");
const path = require("path");

const pathToCss = path.join(__dirname, "styles");
const pathToProject = path.join(__dirname, "project-dist");

const writableStream = fs.createWriteStream(path.join(pathToProject, "bundle.css"));

fs.readdir(pathToCss, {withFileTypes: true}, (error, files) => {
  if(error) {
    console.error(error);
  }
  files.forEach(file => {
    if(file.isFile() && path.extname(file.name) === ".css") {
      let text = '';
      const readableStream = fs.createReadStream(path.join(pathToCss, file.name), "utf-8");
      readableStream.on("data", data => text += data);
      readableStream.on("end", () => writableStream.write(`${text}\n`));
    }
  })
})