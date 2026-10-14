import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const templatePath = path.resolve(distDir, 'index.html');
const photosJsonPath = path.resolve(projectRoot, 'src', 'data', 'photos.json');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender] Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const photos = JSON.parse(fs.readFileSync(photosJsonPath, 'utf8'));

// Slug to OG image mapping
const OG_MAP = {
  'door-of-sidi-bou-said': 'sidi-bou-said.jpg',
  'colosseum-of-el-jem': 'el-jem.jpg',
  'dawn-chott-el-djerid': 'chott-el-djerid.jpg',
  'medina-brass-craftsman': 'medina-brass.jpg',
  'chebika-mountain-oasis': 'chebika.jpg',
  'djerbahood-erriadh': 'djerba.jpg',
  'needles-of-tabarka': 'tabarka.jpg',
  'troglodyte-matmata': 'matmata.jpg',
  'great-mosque-kairouan': 'kairouan.jpg',
  'carthage-antonine-baths': 'carthage.jpg',
  'chenini-hilltop-ksar': 'chenini.jpg',
  'bizerte-old-port': 'bizerte.jpg',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function replaceMeta(html, { title, description, url, ogImage, ogType = 'article', bodyContent = '' }) {
  let output = html;

  // Replace Title
  output = output.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // Replace or inject description
  if (output.includes('<meta name="description"')) {
    output = output.replace(/<meta name="description"[\s\S]*?>/i, `<meta name="description" content="${description}" />`);
  }

  // Remove existing OG, Twitter, and canonical tags to avoid duplicates
  output = output.replace(/<meta\s+property="og:[^>]*>/gi, '');
  output = output.replace(/<meta\s+name="twitter:[^>]*>/gi, '');
  output = output.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  output = output.replace(/<!--\s*(OpenGraph Metadata|Twitter Card|Dynamic SSG OpenGraph & Twitter Previews)\s*-->/gi, '');

  // Build OpenGraph & Twitter tags block
  const metaTags = `
    <!-- Dynamic SSG OpenGraph & Twitter Previews -->
    <link rel="canonical" href="${url}" />
    <meta property="og:site_name" content="Tunisian Lens" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;

  // Inject meta tags into head
  output = output.replace('</head>', `${metaTags}\n  </head>`);

  // Replace empty <div id="root"></div> with semantic pre-rendered HTML shell for SEO/crawlers
  if (bodyContent) {
    output = output.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);
  }

  return output;
}

console.log(`[prerender] Starting SSG pre-rendering for ${photos.length} photography stories...`);

// 1. Ensure dist/og exists and copy all public/og files
const publicOgDir = path.resolve(projectRoot, 'public', 'og');
const distOgDir = path.resolve(distDir, 'og');
ensureDir(distOgDir);
if (fs.existsSync(publicOgDir)) {
  const files = fs.readdirSync(publicOgDir);
  for (const file of files) {
    fs.copyFileSync(path.join(publicOgDir, file), path.join(distOgDir, file));
  }
  console.log(`[prerender] Copied ${files.length} social card preview images to dist/og/`);
}

// 2. Pre-render each photo story route: /photo/:slug
for (const photo of photos) {
  const ogFilename = OG_MAP[photo.slug] || 'default-og.jpg';
  const ogImageUrl = `https://tunisian-lens.pages.dev/og/${ogFilename}`;
  const pageUrl = `https://tunisian-lens.pages.dev/photo/${photo.slug}`;
  const pageTitle = `${photo.title} — Tunisian Lens`;
  const cleanDescription = photo.story.replace(/"/g, '&quot;');

  // Semantic, crawlable HTML shell for search engine scrapers and social preview bots
  const semanticBody = `
    <main style="min-height: 100vh; background-color: #0B0C0E; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; padding: 2rem 1.5rem;">
      <article style="max-width: 1100px; margin: 0 auto;">
        <nav style="margin-bottom: 1.5rem;">
          <a href="/" style="color: #0284C7; text-decoration: none; font-size: 0.875rem;">← Back to Tunisian Lens Stories</a>
        </nav>
        <header style="margin-bottom: 2rem;">
          <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #D97706; margin-bottom: 0.5rem;">
            ${photo.region} • ${photo.locationName}
          </div>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; line-height: 1.15; margin: 0 0 1rem 0; color: #FFFFFF;">
            ${photo.title}
          </h1>
          <p style="font-size: 0.875rem; color: #A1A1AA; margin: 0;">
            Photographed by <strong style="color: #FFFFFF;">${photo.author.name}</strong> (<span style="color: #0284C7;">${photo.author.handle}</span>)
          </p>
        </header>

        <figure style="margin: 0 0 2rem 0; background: #000000; border-radius: 1.25rem; overflow: hidden; text-align: center; border: 1px solid #262930;">
          <img src="${photo.fullImageUrl}" alt="${photo.title}" style="max-height: 75vh; width: auto; max-width: 100%; object-fit: contain; display: inline-block;" />
        </figure>

        <section style="margin-bottom: 2.5rem; background: #15171C; border: 1px solid #262930; border-radius: 1.25rem; padding: 1.75rem;">
          <h2 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #D97706; margin-top: 0;">
            The Story
          </h2>
          <p style="font-size: 1rem; line-height: 1.7; color: #E4E4E7; font-weight: 300;">
            ${photo.story}
          </p>

          ${photo.exif ? `
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #262930;">
            <h3 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0284C7; margin-bottom: 0.75rem;">
              Optics & Technical EXIF
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.8125rem; color: #D4D4D8;">
              <li><strong style="color: #71717A;">Body:</strong> ${photo.exif.camera || '—'}</li>
              <li><strong style="color: #71717A;">Lens:</strong> ${photo.exif.lens || '—'}</li>
              <li><strong style="color: #71717A;">Aperture:</strong> ${photo.exif.aperture || '—'}</li>
              <li><strong style="color: #71717A;">Shutter:</strong> ${photo.exif.shutterSpeed || '—'}</li>
              <li><strong style="color: #71717A;">Focal Length:</strong> ${photo.exif.focalLength || '—'}</li>
              <li><strong style="color: #71717A;">ISO:</strong> ${photo.exif.iso || '—'}</li>
            </ul>
          </div>` : ''}

          <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${photo.tags.map(t => `<span style="font-size: 0.6875rem; padding: 0.25rem 0.625rem; border-radius: 0.375rem; background: #0B0C0E; color: #A1A1AA; border: 1px solid #262930;">#${t}</span>`).join('')}
          </div>
        </section>
      </article>
    </main>
  `;

  const renderedHtml = replaceMeta(template, {
    title: pageTitle,
    description: cleanDescription,
    url: pageUrl,
    ogImage: ogImageUrl,
    ogType: 'article',
    bodyContent: semanticBody,
  });

  const photoDir = path.resolve(distDir, 'photo', photo.slug);
  ensureDir(photoDir);
  fs.writeFileSync(path.resolve(photoDir, 'index.html'), renderedHtml, 'utf8');
  console.log(`[prerender] Generated static route: /photo/${photo.slug}/index.html`);
}

// 3. Pre-render main section routes
const staticPages = [
  {
    path: 'explore',
    title: 'Explore Cultural Photography & Visual Arts — Tunisian Lens',
    description: 'Browse curated Tunisian photography, architectural studies, desert landscapes, and creative portfolios.',
    ogImage: 'https://tunisian-lens.pages.dev/og/sidi-bou-said.jpg',
  },
  {
    path: 'creatives',
    title: 'Tunisian Photographers & Filmmakers Directory — Tunisian Lens',
    description: 'Connect with verified top Tunisian photographers, cinematographers, and visual storytellers.',
    ogImage: 'https://tunisian-lens.pages.dev/og/medina-brass.jpg',
  },
  {
    path: 'about',
    title: 'About Tunisian Lens — Celebrating Heritage Through Photography',
    description: 'Learn about our mission to document and share Tunisia\'s architectural, cultural, and landscape heritage.',
    ogImage: 'https://tunisian-lens.pages.dev/og/el-jem.jpg',
  },
  {
    path: 'jobs',
    title: 'Photography & Creative Jobs Marketplace — Tunisian Lens',
    description: 'Hire verified Tunisian photographers and videographers for weddings, commercial shoots, and expeditions.',
    ogImage: 'https://tunisian-lens.pages.dev/og/default-og.jpg',
  },
  {
    path: 'gear',
    title: 'Camera Gear Marketplace — Tunisian Lens',
    description: 'Buy and sell professional camera bodies, lenses, drones, and lighting equipment in Tunisia.',
    ogImage: 'https://tunisian-lens.pages.dev/og/default-og.jpg',
  },
];

for (const page of staticPages) {
  const pageDir = path.resolve(distDir, page.path);
  ensureDir(pageDir);
  const renderedHtml = replaceMeta(template, {
    title: page.title,
    description: page.description,
    url: `https://tunisian-lens.pages.dev/${page.path}`,
    ogImage: page.ogImage,
    ogType: 'website',
  });
  fs.writeFileSync(path.resolve(pageDir, 'index.html'), renderedHtml, 'utf8');
  console.log(`[prerender] Generated static route: /${page.path}/index.html`);
}

// 4. Update root dist/index.html with home page metadata and OpenGraph
const homeHtml = replaceMeta(template, {
  title: 'Tunisian Lens — Visual Storytelling & Cultural Photography',
  description: 'Discover Tunisia\'s living heritage through curated photography, high-resolution stories, and authentic creative vision from Carthage to the Sahara.',
  url: 'https://tunisian-lens.pages.dev/',
  ogImage: 'https://tunisian-lens.pages.dev/og/sidi-bou-said.jpg',
  ogType: 'website',
});
fs.writeFileSync(templatePath, homeHtml, 'utf8');
console.log(`[prerender] Updated root: dist/index.html`);

console.log('[prerender] SSG Pre-rendering completed successfully!');
