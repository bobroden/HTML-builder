const fs = require('fs');
const path = require('path');

const pathToFiles = path.join(__dirname, 'files');
const pathToCopyFiles = path.join(__dirname, 'files-copy');

function copyDir(fromPath = pathToFiles, toPath = pathToCopyFiles) {
  fs.mkdir(toPath, (err) => {
    if (err) {
      console.error(err);
    }
    fs.readdir(fromPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
      }
      files.forEach((file) => {
        const fromFile = path.join(fromPath, file.name);
        const toFile = path.join(toPath, file.name);
        fs.stat(fromFile, (err, stat) => {
          if (err) {
            console.error(err);
          }
          if (stat.isDirectory()) {
            copyDir(fromFile, toFile);
          } else {
            fs.copyFile(fromFile, toFile, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
        });
      });
    });
  });
}

copyDir();
