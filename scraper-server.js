const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // 🟡 Ví dụ: lấy tiêu đề trang
        const title = await page.title();

        // 📦 Trả về kết quả
        res.json({ url, title });

        await browser.close();
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Scraping failed', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Scraper API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
