import puppeteer from 'puppeteer-core';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerExtra from 'puppeteer-extra';
import fs from 'fs';

puppeteerExtra.use(StealthPlugin());

(async () => {
  const browser = await puppeteerExtra.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new"
  });

  try {
    const page = await browser.newPage();
    console.log("Acessando Planalto...");
    await page.goto('https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm', { waitUntil: 'networkidle2' });

    console.log("Extraindo texto...");
    const text = await page.evaluate(() => document.body.innerText);
    
    fs.writeFileSync('D:\\Administrativo\\Websites\\CIFRA\\scraping\\lcp214.txt', text);
    console.log("Salvo com sucesso em lcp214.txt (" + text.length + " caracteres)");
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await browser.close();
  }
})();
