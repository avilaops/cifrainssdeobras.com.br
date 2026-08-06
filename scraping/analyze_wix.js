const fs = require('fs');

const data = fs.readFileSync('D:\\Administrativo\\Websites\\CIFRA\\scraping\\Calculadora Reforma Tributária _ CalcProObra.html', 'utf8');

// Looking for user code or wix specific data
const wixCodeBlocks = data.match(/<script.*?id="wix-viewer-model".*?>([\s\S]*?)<\/script>/);
if (wixCodeBlocks) {
  console.log("Found wix-viewer-model. Parsing...");
  try {
    const json = JSON.parse(wixCodeBlocks[1]);
    console.log(Object.keys(json));
  } catch(e) {
    console.log("Failed to parse JSON", e.message);
  }
}

// Or maybe it's in a JS file in the _files folder
const files = fs.readdirSync('D:\\Administrativo\\Websites\\CIFRA\\scraping\\Calculadora Reforma Tributária _ CalcProObra_files');
for (const file of files) {
  if (file.endsWith('.js') || file.endsWith('.baixados')) {
    const content = fs.readFileSync('D:\\Administrativo\\Websites\\CIFRA\\scraping\\Calculadora Reforma Tributária _ CalcProObra_files\\' + file, 'utf8');
    if (content.includes('Redutor social') || content.includes('Empreitadas') || content.includes('Ano da CBS')) {
      console.log('Found keywords in file:', file);
    }
    if (content.includes('function calc') || content.includes('function calculate') || content.includes('reforma') || content.includes('tributaria')) {
      // maybe we found something
    }
  }
}

console.log("Script analysis complete.");
