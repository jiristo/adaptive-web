import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/downloads/instagram/carousel-01');
fs.mkdirSync(outDir, { recursive: true });
const publicDir = path.resolve('public');

const slides = [
  {
    number: '01',
    eyebrow: 'ADAPTIVE STUDIO',
    title: ['Dlouhověkost', 'je dovednost.'],
    body: ['Nejen žít déle.', 'Fungovat déle dobře.'],
    image: '/images/athlete-relax-mindfulness.webp',
    theme: 'hero',
  },
  {
    number: '02',
    eyebrow: 'PROBLÉM',
    title: ['Výkon bez regenerace', 'nevydrží.'],
    body: ['Tělo zvládne stres.', 'Problém je, když se neumí', 'vrátit zpět do klidu.'],
    theme: 'light',
  },
  {
    number: '03',
    eyebrow: 'REALITA',
    title: ['Nikdo nás neučil', 'zotavovat se.'],
    body: ['Umíme zabrat.', 'Ale často neumíme vědomě vypnout', 'napětí, dech a přetížený nervový systém.'],
    image: '/images/relaxed-work.webp',
    theme: 'split',
  },
  {
    number: '04',
    eyebrow: 'ZMĚNA',
    title: ['Právě tady', 'začíná změna.'],
    body: ['Dech.', 'Pohyb.', 'Regenerace.', 'Nervový systém.'],
    image: '/images/man-breath-class.webp',
    theme: 'bottomImage',
  },
  {
    number: '05',
    eyebrow: 'PŘÍSTUP',
    title: ['Nejde jen', 'o úlevu.'],
    body: ['Jde o dovednost,', 'kterou si odnášíš', 'i mimo studio.'],
    theme: 'accent',
  },
  {
    number: '06',
    eyebrow: 'ODOLNOST',
    title: ['Skutečná odolnost', 'není vydržet víc.'],
    body: ['Je to schopnost', 'vracet se zpět', 'do rovnováhy.'],
    image: '/images/man-meditate-home.webp',
    theme: 'dark',
  },
  {
    number: '07',
    eyebrow: 'CTA',
    title: ['Učíme tělo', 'zvládat stres.', 'Vrátit se. Obnovit se.'],
    body: ['adaptivestudio.cz'],
    image: '/images/sadhu-board.webp',
    theme: 'dark',
  },
];

const commonStyle = `
  .bg-light { fill: #f7f8f7; }
  .bg-white { fill: #ffffff; }
  .bg-dark { fill: #111110; }
  .num-light { fill: #e4e4e7; }
  .num-dark { fill: rgba(255,255,255,0.14); }
  .eyebrow { font-family: 'Inter', system-ui, sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 0.35em; fill: #6b8f71; text-transform: uppercase; }
  .brand { font-family: 'Inter', system-ui, sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; fill: #71717a; text-transform: uppercase; }
  .brand-dark { fill: rgba(255,255,255,0.68); }
  .num { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 92px; font-weight: 700; }
  .title-light { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 82px; font-weight: 700; letter-spacing: -0.05em; fill: #18181b; }
  .title-dark { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 82px; font-weight: 700; letter-spacing: -0.05em; fill: #ffffff; }
  .body-light { font-family: 'Inter', system-ui, sans-serif; font-size: 34px; fill: #71717a; }
  .body-dark { font-family: 'Inter', system-ui, sans-serif; font-size: 34px; fill: rgba(255,255,255,0.82); }
  .bullet { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 32px; font-weight: 600; fill: #18181b; }
`;

function linesToTspans(lines, x, y, cls, lineHeight) {
  return `<text x="${x}" y="${y}" class="${cls}">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('')}</text>`;
}

function escapeXml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function imageTag(href, x, y, w, h, extra = '') {
  return `<image href="${inlineImage(href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" ${extra}/>`;
}

function inlineImage(href) {
  const relativePath = href.startsWith('/') ? href.slice(1) : href;
  const fullPath = path.join(publicDir, relativePath);
  const ext = path.extname(fullPath).toLowerCase();
  const mime =
    ext === '.webp' ? 'image/webp'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.png' ? 'image/png'
    : 'application/octet-stream';
  const data = fs.readFileSync(fullPath).toString('base64');
  return `data:${mime};base64,${data}`;
}

function renderSlide(slide) {
  const isDark = slide.theme === 'dark' || slide.theme === 'hero';
  const titleClass = isDark ? 'title-dark' : 'title-light';
  const bodyClass = isDark ? 'body-dark' : 'body-light';
  const numberClass = slide.theme === 'dark' ? 'num num-dark' : 'num num-light';
  const brandClass = slide.theme === 'dark' ? 'brand brand-dark' : 'brand';

  let background = `<rect width="1080" height="1350" class="${slide.theme === 'dark' ? 'bg-dark' : slide.theme === 'light' || slide.theme === 'accent' || slide.theme === 'bottomImage' || slide.theme === 'split' ? 'bg-light' : 'bg-white'}" />`;
  let overlays = '';

  if (slide.theme === 'hero') {
    background += imageTag(slide.image, 0, 0, 1080, 1350);
    overlays += `<rect width="1080" height="1350" fill="url(#heroOverlay)" />`;
  }

  if (slide.theme === 'split') {
    background += `<rect width="1080" height="1350" class="bg-light" />`;
    background += imageTag(slide.image, 0, 790, 1080, 560);
    overlays += `<rect x="0" y="790" width="1080" height="560" fill="url(#splitOverlay)" />`;
  }

  if (slide.theme === 'bottomImage') {
    background += `<rect width="1080" height="1350" class="bg-white" />`;
    background += imageTag(slide.image, 0, 770, 1080, 580);
    overlays += `<rect x="0" y="770" width="1080" height="580" fill="url(#bottomOverlay)" />`;
  }

  if (slide.theme === 'dark') {
    background += imageTag(slide.image, 0, 0, 1080, 1350);
    overlays += `<rect width="1080" height="1350" fill="url(#darkOverlay)" />`;
  }

  if (slide.theme === 'accent') {
    overlays += `<circle cx="940" cy="160" r="240" fill="rgba(107,143,113,0.12)" />`;
  }

  const top = `
    ${linesToTspans([slide.number], 86, 122, numberClass, 0)}
    <text x="994" y="108" text-anchor="end" class="eyebrow">${escapeXml(slide.eyebrow)}</text>
  `;

  const titleY = slide.theme === 'split' ? 398 : slide.theme === 'bottomImage' ? 406 : 492;
  const bodyY = slide.theme === 'hero' ? 970 : slide.theme === 'split' ? 608 : slide.theme === 'bottomImage' ? 594 : 760;
  const title = linesToTspans(slide.title, 170, titleY, titleClass, 86);
  const body = slide.body ? linesToTspans(slide.body, 170, bodyY, bodyClass, 54) : '';

  const brand = `
    <line x1="86" y1="1248" x2="136" y2="1248" stroke="#6b8f71" stroke-width="2" />
    <text x="160" y="1255" class="${brandClass}">Adaptive Studio</text>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="heroOverlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(17,17,16,0.08)" />
      <stop offset="100%" stop-color="rgba(17,17,16,0.62)" />
    </linearGradient>
    <linearGradient id="darkOverlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(17,17,16,0.08)" />
      <stop offset="100%" stop-color="rgba(17,17,16,0.62)" />
    </linearGradient>
    <linearGradient id="splitOverlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(17,17,16,0)" />
      <stop offset="100%" stop-color="rgba(17,17,16,0.76)" />
    </linearGradient>
    <linearGradient id="bottomOverlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(17,17,16,0)" />
      <stop offset="100%" stop-color="rgba(17,17,16,0.18)" />
    </linearGradient>
    <style>${commonStyle}</style>
  </defs>
  ${background}
  ${overlays}
  ${top}
  ${title}
  ${body}
  ${brand}
</svg>`;
}

slides.forEach((slide, index) => {
  const filename = `slide-${String(index + 1).padStart(2, '0')}.svg`;
  fs.writeFileSync(path.join(outDir, filename), renderSlide(slide), 'utf8');
});

const readme = `Carousel 01 exports\n\nFiles:\n${slides
  .map((_, index) => `- slide-${String(index + 1).padStart(2, '0')}.svg`)
  .join('\n')}\n`;

fs.writeFileSync(path.join(outDir, 'README.txt'), readme, 'utf8');
console.log(`Generated ${slides.length} slides in ${outDir}`);
