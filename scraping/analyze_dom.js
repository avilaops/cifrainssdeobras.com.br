const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const data = fs.readFileSync('D:\\Administrativo\\Websites\\CIFRA\\scraping\\Calculadora Reforma Tributária _ CalcProObra.html', 'utf8');

const dom = new JSDOM(data);
const doc = dom.window.document;

// Let's find inputs and their labels
const inputs = doc.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
  const name = input.getAttribute('name');
  const type = input.getAttribute('type');
  const placeholder = input.getAttribute('placeholder') || '';
  const id = input.getAttribute('id');
  const ariaLabel = input.getAttribute('aria-label');
  console.log(`Input - Type: ${type}, Name: ${name}, Placeholder: ${placeholder}, aria-label: ${ariaLabel}`);
});

// For dropdowns, Wix uses weird divs. Let's find anything with dropdown in ID or class
const dropdowns = doc.querySelectorAll('[data-hook*="dropdown"]');
dropdowns.forEach(dd => {
  console.log(`Dropdown data-hook: ${dd.getAttribute('data-hook')}`);
});
