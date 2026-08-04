import puppeteer, { Browser, Page } from 'puppeteer-core';
import { CertificateContext } from './cert-manager';

export async function createECACSession(certContext: CertificateContext) {
  // Launch puppeteer with the specific HOME directory so it loads the custom nssdb
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser', // Path in Alpine Linux
    headless: true,
    env: {
      ...process.env,
      HOME: certContext.homeDir, // Point HOME to our custom nssdb directory
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      // This tells Chrome to automatically select the client certificate we just installed
      '--auto-select-certificate-for-urls={"pattern":"*","filter":{}}'
    ]
  });

  const page = await browser.newPage();
  
  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // Navigate to eCAC login
    console.log('Navigating to eCAC...');
    await page.goto('https://cav.receita.fazenda.gov.br/autenticacao/login', { waitUntil: 'networkidle2' });

    // Click "Entrar com gov.br"
    const govBrBtnSelector = '#login-dados-certificado > p:nth-child(2) > input[type=image]';
    const hasGovBtn = await page.$(govBrBtnSelector);
    
    if (hasGovBtn) {
      console.log('Clicking Gov.br login button...');
      await page.click(govBrBtnSelector);
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // Now we should be on the gov.br login page. We need to click "Seu Certificado Digital"
    // The button has ID "login-certificate"
    const certLoginBtnSelector = '#login-certificate';
    await page.waitForSelector(certLoginBtnSelector, { timeout: 10000 });
    console.log('Clicking Certificado Digital option...');
    await page.click(certLoginBtnSelector);

    // Wait for the redirect back to eCAC after certificate selection
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    console.log('Successfully logged into eCAC (or hit a challenge)');

    // Capture screenshot to prove we are in
    const screenshot = await page.screenshot({ encoding: 'base64' });

    return {
      browser,
      page,
      screenshot
    };

  } catch (error) {
    await browser.close();
    throw error;
  }
}
