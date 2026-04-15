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

function fetchHead(url, redirectCount = 0) {
  if (redirectCount > 5) return Promise.resolve('');
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    }, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        req.destroy();
        resolve(fetchHead(res.headers.location, redirectCount + 1));
        return;
      }
      let body = '';
      res.on('data', chunk => {
        body += chunk;
        // Stop reading after we have the og:image (usually in first 8KB)
        if (body.length > 12000 || body.includes('</head>')) {
          req.destroy();
          resolve(body);
        }
      });
      res.on('end', () => resolve(body));
    });
    req.on('error', () => resolve(''));
    req.setTimeout(12000, () => { req.destroy(); resolve(''); });
  });
}

function extractOgImage(html) {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (match) return match[1].trim();
  // fallback: try twitter:image
  const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (tw) return tw[1].trim();
  return null;
}

console.log('Step 1: Fetching calendar to get all saint URLs...');
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
console.log(`Found ${Object.keys(allDays).length} days`);

// Load existing images if any
const imagesFile = 'scripts/saints-images.json';
const existingImages = fs.existsSync(imagesFile)
  ? JSON.parse(fs.readFileSync(imagesFile, 'utf-8'))
  : {};

const keys = Object.keys(allDays).sort();
const toFetch = keys.filter(k => !existingImages[k]);
console.log(`Step 2: Fetching images for ${toFetch.length} saints (${keys.length - toFetch.length} cached)...`);

const CONCURRENCY = 25;
let done = 0;
let found = 0;
let failed = 0;

async function fetchImageForKey(key) {
  try {
    const html = await fetchHead(allDays[key].url);
    const img = extractOgImage(html);
    if (img) {
      existingImages[key] = img;
      found++;
    } else {
      existingImages[key] = null;
      failed++;
    }
  } catch {
    existingImages[key] = null;
    failed++;
  }
  done++;
  if (done % 50 === 0 || done === toFetch.length) {
    console.log(`  ${done}/${toFetch.length} — ${found} images found, ${failed} without image`);
  }
}

for (let i = 0; i < toFetch.length; i += CONCURRENCY) {
  await Promise.all(toFetch.slice(i, i + CONCURRENCY).map(fetchImageForKey));
}

fs.writeFileSync(imagesFile, JSON.stringify(existingImages, null, 2));
console.log(`\nSaved ${imagesFile}`);
console.log(`Total: ${Object.values(existingImages).filter(Boolean).length} with image, ${Object.values(existingImages).filter(v => !v).length} without`);
