const fs = require("fs");
const path = require("path");

const pathToAssets = path.join(__dirname, "assets");
const pathToComponents = path.join(__dirname, "components");
const pathToStyles = path.join(__dirname, "styles");
const pathToTemplate = path.join(__dirname, "template.html");

const pathToDistFolder = path.join(__dirname, "project-dist");

fs.rm(pathToDistFolder, {recursive: true, force: true}, error => {
  if(error) {
    console.error(error);
  }
  fs.mkdir(pathToDistFolder, err => {
    if(err) {
      console.error(err);
    }
    copyDir();
    buildStyles();
    buildTemplate()
  })
})

function copyDir(fromPath = pathToAssets, toPath = path.join(pathToDistFolder, "assets")) {
  fs.mkdir(toPath, err => {
    if(err) {
      console.error(err);
    }
    fs.readdir(fromPath, {withFileTypes: true}, (err, files) => {
      if(err) {
        console.error(err);
      }
      files.forEach(file => {
        const fromFile = path.join(fromPath, file.name);
        const toFile = path.join(toPath, file.name);
        fs.stat(fromFile, (err, stat) => {
          if(err) {
            console.error(err);
          }
          if(stat.isDirectory()) {
            copyDir(fromFile, toFile);
          }
          else {
            fs.copyFile(fromFile, toFile, err => {
              if(err) {
                console.error(err);
              }
            });
          }
        });
      });
    });
  });
}

function buildStyles() {
  const writableStream = fs.createWriteStream(path.join(pathToDistFolder, "style.css"));

  fs.readdir(pathToStyles, {withFileTypes: true}, (error, files) => {
    if(error) {
      console.error(error);
    }
    files.forEach(file => {
      if(file.isFile() && path.extname(file.name) === ".css") {
        let text = '';
        const readableStream = fs.createReadStream(path.join(pathToStyles, file.name), "utf-8");
        readableStream.on("data", data => text += data);
        readableStream.on("end", () => writableStream.write(`${text}\n`));
      }
    })
  })
}

function buildTemplate() {
  const readableStream = fs.createReadStream(pathToTemplate);
  const writableStream = fs.createWriteStream(path.join(pathToDistFolder, "index.html"));

  let htmlTemplate = '';

  readableStream.on("data", data => htmlTemplate += data);
  readableStream.on("end", () => {
    fs.readdir(pathToComponents, {withFileTypes: true}, (err, files) => {
      if(err) {
        console.error(err);
      }
      files.forEach((file, index) => {
        if(file.isFile() && path.extname(file.name) === ".html") {
          const fileName = file.name.split('.')[0];
          const readStream = fs.createReadStream(path.join(pathToComponents, file.name));
          let text = '';
          readStream.on("data", data => text += data);
          readStream.on("end", () => {
            htmlTemplate = htmlTemplate.replaceAll(`{{${fileName}}}`, text);
            if(index === files.length - 1) {
              writableStream.write(htmlTemplate);
            }
          })
        }
      })
    })
  });
}
