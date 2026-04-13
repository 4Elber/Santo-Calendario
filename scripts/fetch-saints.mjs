import https from 'https';
import fs from 'fs';
import querystring from 'querystring';

const AJAX_URL = 'https://santo.cancaonova.com/wp-admin/admin-ajax.php';

function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0'
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function fetchPage(url, redirectCount = 0) {
  if (redirectCount > 5) return Promise.resolve('');
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        resolve(fetchPage(res.headers.location, redirectCount + 1));
        return;
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(12000, () => { req.destroy(); resolve(''); });
  });
}

function extractSaintData(html) {
  if (!html || html.length < 1000) return null;
  
  const h1All = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  let nome = '';
  for (const m of h1All) {
    const t = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (t && !t.includes('Canção Nova') && !t.includes('Santo do Dia')) {
      nome = t; break;
    }
  }
  if (!nome) return null;
  
  const entryIdx = html.indexOf('entry-content content-santo');
  if (entryIdx === -1) return null;
  
  const contentStart = html.indexOf('>', entryIdx) + 1;
  let articleHtml = html.slice(contentStart, contentStart + 20000);
  
  // Remove noise blocks first
  articleHtml = articleHtml
    .replace(/<ul[^>]*id=['"]share-buttons['"][^>]*>[\s\S]*?<\/ul>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<img[^>]*>/gi, '');

  // Convert block-level elements to paragraph breaks BEFORE stripping tags
  articleHtml = articleHtml
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(h[2-6])[^>]*>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')        // strip remaining inline tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/[ \t]+/g, ' ')         // collapse horizontal whitespace
    .replace(/\n[ \t]+/g, '\n')      // trim leading spaces on each line
    .replace(/\n{3,}/g, '\n\n')      // collapse excess blank lines
    .trim();

  // Take up to ~3000 chars (will be several paragraphs)
  let historia = articleHtml.slice(0, 3000).trim();

  // If the slice cuts mid-sentence, trim to last sentence
  const lastPeriod = historia.lastIndexOf('.');
  if (lastPeriod > 1500) {
    historia = historia.slice(0, lastPeriod + 1).trim();
  }
  
  const virtueKeywords = [
    ['humildade', 'Humildade'], ['caridade', 'Caridade'], ['obediência', 'Obediência'],
    ['fé', 'Fé'], ['esperança', 'Esperança'], ['amor ao próximo', 'Amor ao próximo'],
    ['amor a deus', 'Amor a Deus'], ['pobreza', 'Pobreza'], ['penitência', 'Penitência'],
    ['oração', 'Oração'], ['martírio', 'Martírio'], ['coragem', 'Coragem'],
    ['prudência', 'Prudência'], ['paciência', 'Paciência'], ['misericórdia', 'Misericórdia'],
    ['generosidade', 'Generosidade'], ['serviço', 'Serviço'], ['contemplação', 'Contemplação'],
    ['perseverança', 'Perseverança'], ['alegria', 'Alegria'], ['pureza', 'Pureza'],
    ['fortaleza', 'Fortaleza'], ['fidelidade', 'Fidelidade'], ['sabedoria', 'Sabedoria'],
    ['mansidão', 'Mansidão'], ['missão', 'Missão'], ['dedicação', 'Dedicação'],
    ['trabalho', 'Trabalho'], ['apostolado', 'Apostolado'], ['confiança', 'Confiança'],
  ];
  
  const lowerText = (nome + ' ' + historia).toLowerCase();
  const found = [...new Set(virtueKeywords.filter(([k]) => lowerText.includes(k)).map(([, v]) => v))].slice(0, 5);
  
  if (found.length < 2) { if (!found.includes('Fé')) found.push('Fé'); if (found.length < 2) found.push('Santidade'); }
  const virtudes = [...new Set(found)].slice(0, 5);
  
  return { nome, historia, virtudes };
}

// Step 1: Get all day→slug mappings from 12 months
console.log('Fetching calendar...');
const monthsHtml = await Promise.all(
  Array.from({ length: 12 }, (_, i) => postRequest(AJAX_URL, {
    action: 'widget-ajax',
    sMes: String(i + 1),
    sAno: '2026',
    title: '',
    type: 'santo',
    ajax: 'true'
  }))
);

const allDays = {};
for (let m = 0; m < 12; m++) {
  const html = monthsHtml[m];
  const mes = String(m + 1).padStart(2, '0');
  const linkRegex = /href="(https:\/\/santo\.cancaonova\.com\/santo\/([^/?]+)\/)[^"]*\?sDia=(\d+)&sMes=(\d+)/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const [, fullUrl, slug, dia] = match;
    const key = `${mes}-${String(dia).padStart(2, '0')}`;
    allDays[key] = { slug, url: fullUrl };
  }
}
console.log(`Calendar: ${Object.keys(allDays).length} days`);

// Step 2: Fetch all saint pages with concurrency=15
const dayKeys = Object.keys(allDays).sort();
const CONCURRENCY = 20;
const saintData = {};
let done = 0;
let failed = 0;

async function processKey(key) {
  try {
    const html = await fetchPage(allDays[key].url);
    const data = extractSaintData(html);
    if (data) {
      saintData[key] = data;
    } else {
      failed++;
    }
  } catch (e) {
    failed++;
  }
  done++;
  if (done % 30 === 0) {
    console.log(`Progress: ${done}/${dayKeys.length} (${failed} failed)`);
  }
}

// Process in concurrency batches
for (let i = 0; i < dayKeys.length; i += CONCURRENCY) {
  const batch = dayKeys.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(processKey));
}

console.log(`Done! ${Object.keys(saintData).length} saints, ${failed} failed`);

// Save raw JSON
fs.writeFileSync('scripts/saints-raw.json', JSON.stringify(saintData, null, 2));
console.log('Saved scripts/saints-raw.json');
