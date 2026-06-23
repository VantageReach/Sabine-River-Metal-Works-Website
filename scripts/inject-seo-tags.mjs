import fs from 'fs';

const pages = [
  { file: 'index.html', robots: 'index, follow' },
  { file: 'pole-barns.html', robots: 'index, follow' },
  { file: 'red-iron-buildings.html', robots: 'index, follow' },
  { file: 'metal-roofing.html', robots: 'index, follow' },
  { file: 'custom-awnings.html', robots: 'index, follow' },
  { file: 'metal-buildings.html', robots: 'index, follow' },
  { file: 'gallery.html', robots: 'index, follow' },
  { file: 'contact.html', robots: 'index, follow' },
  { file: 'updates.html', robots: 'index, follow' },
  { file: 'metal-building-cost-beaumont.html', robots: 'index, follow' },
  { file: 'pole-barn-vs-red-iron.html', robots: 'index, follow' },
  { file: 'metal-roofing-southeast-texas.html', robots: 'index, follow' },
  { file: 'thank-you.html', robots: 'noindex, follow' },
];

const OG_IMAGE = 'https://sabinemetalworks.com/website%20pictures/Post-Frame-Hero-Image.png';
const THEME_COLOR = '#08243d';

for (const { file, robots } of pages) {
  let html = fs.readFileSync(file, 'utf8');

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';

  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const desc = descMatch ? descMatch[1] : '';

  const canonMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  const canonical = canonMatch ? canonMatch[1] : '';

  // Strip any existing incomplete OG, Twitter, robots, theme-color tags
  html = html.replace(/[ \t]*<meta property="og:[^>]+>\n?/g, '');
  html = html.replace(/[ \t]*<meta name="twitter:[^>]+>\n?/g, '');
  html = html.replace(/[ \t]*<meta name="robots"[^>]+>\n?/g, '');
  html = html.replace(/[ \t]*<meta name="theme-color"[^>]+>\n?/g, '');

  const tags = [
    `    <meta name="robots" content="${robots}">`,
    `    <meta name="theme-color" content="${THEME_COLOR}">`,
    `    <meta property="og:title" content="${title}">`,
    `    <meta property="og:description" content="${desc}">`,
    `    <meta property="og:type" content="website">`,
    `    <meta property="og:url" content="${canonical}">`,
    `    <meta property="og:site_name" content="Sabine River Metal Works">`,
    `    <meta property="og:locale" content="en_US">`,
    `    <meta property="og:image" content="${OG_IMAGE}">`,
    `    <meta property="og:image:width" content="1200">`,
    `    <meta property="og:image:height" content="630">`,
    `    <meta name="twitter:card" content="summary_large_image">`,
    `    <meta name="twitter:title" content="${title}">`,
    `    <meta name="twitter:description" content="${desc}">`,
    `    <meta name="twitter:image" content="${OG_IMAGE}">`,
  ].join('\n');

  html = html.replace('  </head>', `${tags}\n  </head>`);

  fs.writeFileSync(file, html);
  console.log(`✓ ${file}`);
}

console.log('\nDone — SEO tags injected into all pages.');
