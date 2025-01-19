const fs = require("fs");
const path = require("path");
const { stdout } = process;

const pathToFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathToFolder, {withFileTypes: true}, (error, files) => {
  if(error) {
    console.error(error);
  }
  files.forEach(file => {
    if(file.isFile()) {
      const [name, extension ]  = file.name.split('.');
      let size = 0;
      fs.stat(path.join(pathToFolder, file.name), (err, data) => {
        if(err) {
          console.error(err);
        }
        size = data.size;
        stdout.write(`${name} - ${extension} - ${(size / 1024).toFixed(3)}kb\n`);
      });

    }
  })
})
