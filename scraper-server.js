const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    await browser.close();

    res.json({ url, title });
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ error: 'Scraping failed', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Scraper is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
