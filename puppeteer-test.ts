import puppeteer from 'puppeteer';

const test = async () => {
  try {
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://felo.ai/');
    
    await page.waitForSelector('textarea', { timeout: 15000 });
    await page.type('textarea', 'how many jobs at google?');
    await page.keyboard.press('Enter');
    
    await new Promise(r => setTimeout(r, 10000)); // wait for response
    
    const paragraphs = await page.$$eval('p', els => els.map(el => el.textContent).join(' '));
    console.log(paragraphs.substring(0, 500));
    
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};
test();
