const fs = require('fs');
const path = require('path');

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

async function printTextRecursively(obj, content = '') {
  if (typeof obj === 'object') {
    if (obj.hasOwnProperty('text')) {
      console.log(obj.text);
      content += obj.text + '\n';
    }
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        for (const item of obj[key]) {
          content = await printTextRecursively(item, content);
        }
      } else if (typeof obj[key] === 'object') {
        content = await printTextRecursively(obj[key], content);
      }
    }
  }
  return content;
}

async function main() {
  const data = {
    text: 'Campeão: Gnar',
    Informacoes: {
      text: 'Habilidades:',
      Habilidades: [
        { text: ' Lançamento do Bumerangue / Arremesso da Pedra' },
        { text: ' Hiperativo / Espancar' },
        { text: ' Salto / Triturar' },
        { text: ' GNAR!' },
      ],
    },
  };

  try {
    const content = await printTextRecursively(data);

    const filePath = path.join(__dirname, 'objects.txt');

    await promisifiedWriteFile(filePath, content);

    console.log(`Conteúdo salvo em '${filePath}'.`);
  } catch (error) {
    console.error('Erro ao salvar o arquivo:', error);
  }
}

main();
