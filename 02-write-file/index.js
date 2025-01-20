const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

console.log('Hello, user! Put the text in the text.txt file');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writableStream.write(data);
  }
});

process.on('exit', () => {
  stdout.write('Good luck, user!');
});

process.on('SIGINT', () => {
  process.exit();
});
