const siteUrl = 'https://adaptivestudio.cz';

const pages = [
  '/',
  '/en/',
  '/preview/sluzby/',
  '/en/preview/sluzby/',
  '/preview/dlouhovekost/',
  '/en/preview/dlouhovekost/',
  '/preview/o-nas/',
  '/en/preview/o-nas/',
  '/preview/pribeh/',
  '/en/preview/pribeh/',
  '/preview/kontakt/',
  '/en/preview/kontakt/',
  '/preview/rezervace/',
  '/en/preview/rezervace/',
  '/preview/neuroveda/',
  '/en/preview/neuroveda/',
  '/preview/polyvagalni-teorie/',
  '/en/preview/polyvagalni-teorie/',
  '/preview/somaticka-praxe/',
  '/en/preview/somaticka-praxe/',
  '/preview/aplikace/kortizol/',
  '/en/preview/aplikace/kortizol/',
  '/preview/aplikace/regulace-zateze/',
  '/preview/aplikace/kortizol/10-pravidel/',
  '/en/preview/aplikace/kortizol/10-rules/',
  '/preview/program/',
  '/en/preview/program/',
];

export function GET() {
  const lastmod = new Date().toISOString();
  const urls = pages
    .map((path) => {
      return `<url><loc>${siteUrl}${path}</loc><lastmod>${lastmod}</lastmod></url>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
