const fs = require("fs");
const path = require("path");

const pathToFiles = path.join(__dirname, "files");
const pathToCopyFiles = path.join(__dirname, "files-copy");

function copyDir() {
  fs.rm(pathToCopyFiles, {recursive: true, force: true}, error => {
    if(error) {
      console.error(error);
    }
    fs.mkdir(pathToCopyFiles, {recursive: true}, err => {
      if(error) {
        console.error(err);
      }
      fs.readdir(pathToFiles, (err, files) => {
        if(err) {
          console.error(err);
        }
        files.forEach(file => {
          fs.copyFile(path.join(pathToFiles, file), path.join(pathToCopyFiles, file), err => {
            if(err) {
              console.error(err);
            }
          });
        });
      });
    });
  });
}

copyDir();
