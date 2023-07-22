const fs = require('fs');
const path = require('path');

function promisifiedReaddir(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function promisifiedWriteFile(file, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function listFilesAndDirectories(directory, content = '') {
  try {
    const files = await promisifiedReaddir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file.name);

      if (file.isFile()) {
        console.log('File: ', filePath);
        content += `File: ${filePath}\n`;
      } else if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
        console.log('Directory: ', filePath);
        content += `Directory: ${filePath}\n`;
        content = await listFilesAndDirectories(filePath, content);
      }
    }

    return content;
  } catch (err) {
    console.error('Error:', err);
    return content;
  }
}

async function main() {
  const directory = "dir-path";
  const content = await listFilesAndDirectories(directory);

  const outputFile = path.join(__dirname, 'filesAndDirectories.txt');
  await promisifiedWriteFile(outputFile, content);
  console.log('Done');
}

main();
