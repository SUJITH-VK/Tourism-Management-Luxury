import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard SVG Icon (with emerald & gold compass star emblem)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1324" />
      <stop offset="50%" stop-color="#070b12" />
      <stop offset="100%" stop-color="#06191d" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="112" fill="url(#bg-grad)" />
  <rect width="506" height="506" x="3" y="3" rx="109" fill="none" stroke="url(#emerald-grad)" stroke-width="3" stroke-opacity="0.4" />
  
  <!-- Ambient glow circle -->
  <circle cx="256" cy="256" r="180" fill="url(#glow)" />

  <!-- Outer Astrolabe / Compass ring -->
  <circle cx="256" cy="256" r="160" fill="none" stroke="#1e293b" stroke-width="6" />
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#gold-grad)" stroke-width="2.5" stroke-dasharray="4 8" opacity="0.8" />
  <circle cx="256" cy="256" r="115" fill="none" stroke="#334155" stroke-width="1.5" />

  <!-- Compass cardinal ticks -->
  <line x1="256" y1="84" x2="256" y2="102" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
  <line x1="256" y1="410" x2="256" y2="428" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
  <line x1="84" y1="256" x2="102" y2="256" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
  <line x1="410" y1="256" x2="428" y2="256" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />

  <!-- Diagonal ticks -->
  <circle cx="148" cy="148" r="4" fill="#10b981" />
  <circle cx="364" cy="148" r="4" fill="#10b981" />
  <circle cx="148" cy="364" r="4" fill="#10b981" />
  <circle cx="364" cy="364" r="4" fill="#10b981" />

  <!-- Central Emerald Star / Compass Rose -->
  <g filter="url(#shadow)">
    <!-- North primary point -->
    <polygon points="256,110 274,236 256,256" fill="url(#emerald-grad)" />
    <polygon points="256,110 238,236 256,256" fill="#047857" />

    <!-- South primary point -->
    <polygon points="256,402 274,276 256,256" fill="#047857" />
    <polygon points="256,402 238,276 256,256" fill="url(#emerald-grad)" />

    <!-- East primary point -->
    <polygon points="402,256 276,238 256,256" fill="url(#emerald-grad)" />
    <polygon points="402,256 276,274 256,256" fill="#047857" />

    <!-- West primary point -->
    <polygon points="110,256 236,238 256,256" fill="#047857" />
    <polygon points="110,256 236,274 256,256" fill="url(#emerald-grad)" />

    <!-- Gold Accent Star Secondary Points -->
    <!-- North East -->
    <polygon points="340,172 268,244 256,256" fill="url(#gold-grad)" />
    <polygon points="340,172 256,256 268,268" fill="#b45309" />
    <!-- North West -->
    <polygon points="172,172 244,244 256,256" fill="#b45309" />
    <polygon points="172,172 256,256 244,268" fill="url(#gold-grad)" />
    <!-- South East -->
    <polygon points="340,340 268,268 256,256" fill="#b45309" />
    <polygon points="340,340 256,256 268,244" fill="url(#gold-grad)" />
    <!-- South West -->
    <polygon points="172,340 244,268 256,256" fill="url(#gold-grad)" />
    <polygon points="172,340 256,256 244,244" fill="#b45309" />
  </g>

  <!-- Central Pivot Disc -->
  <circle cx="256" cy="256" r="22" fill="#0f172a" stroke="url(#gold-grad)" stroke-width="4" />
  <circle cx="256" cy="256" r="10" fill="url(#emerald-grad)" />
  <circle cx="256" cy="256" r="4" fill="#ffffff" />
</svg>`;

// 2. Maskable Icon (safe zone padded by 15%, solid full bleed edge-to-edge background)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg-grad-full" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1324" />
      <stop offset="50%" stop-color="#070b12" />
      <stop offset="100%" stop-color="#06191d" />
    </linearGradient>
    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Full Bleed Edge-to-Edge Background (NO rounded rect border) -->
  <rect width="512" height="512" fill="url(#bg-grad-full)" />

  <!-- Padded Inner Content Scaled to Safe Zone (center 75% area, ~384px) -->
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Ambient glow circle -->
    <circle cx="256" cy="256" r="180" fill="url(#glow)" />

    <!-- Outer Astrolabe / Compass ring -->
    <circle cx="256" cy="256" r="160" fill="none" stroke="#1e293b" stroke-width="6" />
    <circle cx="256" cy="256" r="140" fill="none" stroke="url(#gold-grad)" stroke-width="3" stroke-dasharray="4 8" opacity="0.85" />
    <circle cx="256" cy="256" r="115" fill="none" stroke="#334155" stroke-width="2" />

    <!-- Compass cardinal ticks -->
    <line x1="256" y1="84" x2="256" y2="104" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />
    <line x1="256" y1="408" x2="256" y2="428" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />
    <line x1="84" y1="256" x2="104" y2="256" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />
    <line x1="408" y1="256" x2="428" y2="256" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" />

    <!-- Central Compass Rose -->
    <!-- North primary point -->
    <polygon points="256,110 274,236 256,256" fill="url(#emerald-grad)" />
    <polygon points="256,110 238,236 256,256" fill="#047857" />

    <!-- South primary point -->
    <polygon points="256,402 274,276 256,256" fill="#047857" />
    <polygon points="256,402 238,276 256,256" fill="url(#emerald-grad)" />

    <!-- East primary point -->
    <polygon points="402,256 276,238 256,256" fill="url(#emerald-grad)" />
    <polygon points="402,256 276,274 256,256" fill="#047857" />

    <!-- West primary point -->
    <polygon points="110,256 236,238 256,256" fill="#047857" />
    <polygon points="110,256 236,274 256,256" fill="url(#emerald-grad)" />

    <!-- Gold Accent Star Secondary Points -->
    <polygon points="340,172 268,244 256,256" fill="url(#gold-grad)" />
    <polygon points="340,172 256,256 268,268" fill="#b45309" />

    <polygon points="172,172 244,244 256,256" fill="#b45309" />
    <polygon points="172,172 256,256 244,268" fill="url(#gold-grad)" />

    <polygon points="340,340 268,268 256,256" fill="#b45309" />
    <polygon points="340,340 256,256 268,244" fill="url(#gold-grad)" />

    <polygon points="172,340 244,268 256,256" fill="url(#gold-grad)" />
    <polygon points="172,340 256,256 244,244" fill="#b45309" />

    <!-- Central Pivot Disc -->
    <circle cx="256" cy="256" r="24" fill="#0f172a" stroke="url(#gold-grad)" stroke-width="4" />
    <circle cx="256" cy="256" r="11" fill="url(#emerald-grad)" />
    <circle cx="256" cy="256" r="4" fill="#ffffff" />
  </g>
</svg>`;

async function run() {
  console.log('Writing public/icon.svg...');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);

  console.log('Generating pwa-512x512.png...');
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('Generating pwa-192x192.png...');
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  console.log('Generating apple-touch-icon.png (180x180)...');
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Generating pwa-maskable-512x512.png...');
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('Generating favicon.png / favicon.ico...');
  await sharp(Buffer.from(standardSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  await sharp(Buffer.from(standardSvg))
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All PWA assets generated successfully!');
}

run().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
