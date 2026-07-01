import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import puppeteer from 'puppeteer';
dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json());

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '', 
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } 
});

const executeSearchQuery = async (query: string): Promise<string> => {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://felo.ai/');
    
    await page.waitForSelector('textarea', { timeout: 15000 });
    await page.type('textarea', query);
    await page.keyboard.press('Enter');
    
    // Wait for the AI processing and DOM rendering of the answer
    await new Promise(r => setTimeout(r, 12000));
    
    const paragraphs = await page.$$eval('p', els => els.map(el => el.textContent).join(' '));
    return paragraphs || '';
  } catch (error: any) {
    console.error("Puppeteer/Felo API Error:", error);
    return '';
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
};

const extractJobCount = (text: string, defaultVal: number = 0): number => {
  if (!text) return defaultVal;
  let cleanText = text.replace(/\[\d+\]/g, '');
  cleanText = cleanText.replace(/(\d+)\.(\d+)[kK]\b/g, (_, p1, p2) => String(parseInt(p1) * 1000 + parseInt(p2) * 100));
  cleanText = cleanText.replace(/(\d+)[kK]\b/g, '$1000');
  cleanText = cleanText.replace(/(?<=\d),(?=\d)/g, '');
  
  const matches = cleanText.match(/\b\d+\b/g);
  if (!matches) return defaultVal;
  
  const candidates: number[] = [];
  const rawCandidates: number[] = [];
  
  for (const m of matches) {
    const val = parseInt(m, 10);
    if (val >= 2000 && val <= 2030) continue;
    if (val > 80000) continue;
    rawCandidates.push(val);
    if (val >= 5) candidates.push(val);
  }
  
  if (candidates.length > 0) return Math.max(...candidates);
  if (rawCandidates.length > 0) return Math.max(...rawCandidates);
  return defaultVal;
};

const extractLiveEvidence = async (companyName: string) => {
  let contract_value = 0.0;
  let days_since = 30;
  try {
    const cleanName = companyName.split('.')[0].replace("https://", "").replace("http://", "").replace("www.", "");
    const query = encodeURIComponent(`"${cleanName}" contract ("million" OR "billion")`);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    
    const res = await fetch(rssUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const text = await res.text();
    
    // Very naive XML title extraction
    const titles = text.match(/<title>(.*?)<\/title>/gi);
    if (titles && titles.length > 1) {
      // First title is usually the search query itself in RSS, real items start at index 1 or 2
      for (let i = 1; i < Math.min(titles.length, 3); i++) {
        const titleText = titles[i].replace(/<\/?title>/gi, '');
        const match = titleText.match(/\$(\d+\.?\d*)\s*(million|billion|M|B)/i);
        if (match) {
          const val = parseFloat(match[1]);
          const multiplier = match[2].toLowerCase().startsWith('b') ? 1000 : 1;
          contract_value = val * multiplier;
          
          // Try to extract pubDate
          const pubDates = text.match(/<pubDate>(.*?)<\/pubDate>/gi);
          if (pubDates && pubDates[i]) {
            const dateStr = pubDates[i].replace(/<\/?pubDate>/gi, '');
            const pubDate = new Date(dateStr);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - pubDate.getTime());
            days_since = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          }
          break; // Found one
        }
      }
    }
  } catch (e) {
    console.error("OSINT error", e);
  }
  return {
    contract_value_millions: contract_value || 100.0,
    days_since_award: Math.max(days_since, 1)
  };
};

app.post('/api/analyze', async (req, res) => {
  try {
    const { company } = req.body;
    if (!company) {
      return res.status(400).json({ error: 'Company name required' });
    }

    console.log(`[API] Starting analysis for ${company}`);

    const q_primary = `Search the official careers site (like careers.${company}.com, Greenhouse, or Lever) for ${company}. How many total open jobs are currently listed? Provide ONLY the raw number.`;
    const ans_primary = await executeSearchQuery(q_primary);
    const count_primary = extractJobCount(ans_primary);

    let final_total = count_primary;

    const reposted_jobs = Math.floor(final_total * 0.30);
    const osint_data = await extractLiveEvidence(company);
    const contract_m = osint_data.contract_value_millions;
    const days_award = osint_data.days_since_award;

    const hgr = (final_total / 100000.0);
    const base_ratio = ((1.0 * reposted_jobs) + (0.02 * final_total)) / Math.max(final_total, 1);
    const hgr_factor = Math.exp(-5.0 * hgr);
    const contract_factor = Math.max(0.4, Math.min(1.0 - ((contract_m / (days_award + 1)) * 0.0002), 1.0));
    const final_cgi = Math.min(Math.max(base_ratio * hgr_factor * contract_factor, 0.0), 1.0);
    
    const operational_health_score = (1.0 - final_cgi) * 100;

    res.json({
      company,
      totalJobs: final_total,
      officialJobs: count_primary,
      repostedJobs: reposted_jobs,
      contractValueMillions: contract_m,
      daysSinceAward: days_award,
      cgiPercent: Number((final_cgi * 100).toFixed(1)),
      operationalHealthScore: Number(operational_health_score.toFixed(1))
    });

  } catch (error: any) {
    console.error("API error", error);
    res.status(500).json({ error: error.message || 'Failed to analyze' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
