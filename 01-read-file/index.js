const fs = require('fs');
const path = require('path');

let text = '';

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);

readableStream.on('data', (data) => (text += data));
readableStream.on('end', () => console.log(text));
