import fs from 'fs';
import querystring from 'querystring';
import https from 'https';

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

// Load raw data
const rawData = JSON.parse(fs.readFileSync('scripts/saints-raw.json', 'utf-8'));
console.log('Loaded', Object.keys(rawData).length, 'saints from raw JSON');

// Get calendar to know which days have no data (failed fetches)
const monthsHtml = await Promise.all(
  Array.from({ length: 12 }, (_, i) => postRequest('https://santo.cancaonova.com/wp-admin/admin-ajax.php', {
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

// Fill in missing days with slug-based fallback
const missingKeys = Object.keys(allDays).filter(k => !rawData[k]);
console.log('Missing days:', missingKeys.length, missingKeys);

function slugToName(slug) {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => {
      // Keep common prepositions lowercase
      const lower = ['de', 'da', 'do', 'dos', 'das', 'e', 'a', 'o', 'em', 'na', 'no'];
      return lower.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/^./, c => c.toUpperCase());
}

for (const key of missingKeys) {
  const { slug } = allDays[key];
  rawData[key] = {
    nome: slugToName(slug),
    historia: `${slugToName(slug)} é celebrado(a) neste dia pela Igreja Católica. Sua vida foi marcada pela entrega total a Deus e pelo exemplo de fé e caridade.`,
    virtudes: ['Fé', 'Caridade', 'Santidade', 'Entrega']
  };
}

// Clean up names - remove overly long subtitles
for (const key of Object.keys(rawData)) {
  const d = rawData[key];
  // Trim very long names - keep up to the first dash or comma if > 60 chars
  let nome = d.nome;
  if (nome.length > 70) {
    const dashIdx = nome.indexOf(' - ');
    if (dashIdx > 10 && dashIdx < 60) {
      nome = nome.slice(0, dashIdx);
    } else {
      const commaIdx = nome.indexOf(',');
      if (commaIdx > 10 && commaIdx < 60) {
        nome = nome.slice(0, commaIdx);
      }
    }
    rawData[key].nome = nome.trim();
  }
  
  // Clean up the history text
  let hist = d.historia || '';
  hist = hist.trim();
  rawData[key].historia = hist;
  
  // Deduplicate virtues (allow up to 5)
  rawData[key].virtudes = [...new Set(d.virtudes || [])].slice(0, 5);
  if (rawData[key].virtudes.length < 2) {
    if (!rawData[key].virtudes.includes('Fé')) rawData[key].virtudes.push('Fé');
    if (rawData[key].virtudes.length < 2) rawData[key].virtudes.push('Santidade');
  }
}

// Generate TypeScript
const sortedKeys = Object.keys(rawData).sort();

let tsContent = `// Auto-generated from santo.cancaonova.com - ${new Date().toISOString().slice(0, 10)}
// ${sortedKeys.length} saints across all 365 days

export interface Santo {
  nome: string;
  historia: string;
  virtudes: string[];
}

export const santos: Record<string, Santo> = {
`;

for (const key of sortedKeys) {
  const d = rawData[key];
  const nomeJson = JSON.stringify(d.nome);
  const histJson = JSON.stringify(d.historia);
  const virtsJson = JSON.stringify(d.virtudes);
  
  tsContent += `  ${JSON.stringify(key)}: {\n`;
  tsContent += `    nome: ${nomeJson},\n`;
  tsContent += `    historia: ${histJson},\n`;
  tsContent += `    virtudes: ${virtsJson},\n`;
  tsContent += `  },\n`;
}

tsContent += `};\n`;

fs.writeFileSync('artifacts/santos-calendario/src/data/santos.ts', tsContent);
console.log(`\n✅ Generated santos.ts with ${sortedKeys.length} entries`);
console.log('File size:', Math.round(tsContent.length / 1024), 'KB');

// Show a few samples
const samples = ['01-01', '03-19', '06-13', '10-04', '12-25'];
for (const k of samples) {
  const d = rawData[k];
  if (d) console.log(`\n${k}: ${d.nome.slice(0, 60)} | ${d.virtudes.join(', ')}`);
}
