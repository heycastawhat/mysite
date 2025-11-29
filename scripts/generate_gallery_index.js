const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'photogallery');
const outFile = path.join(galleryDir, 'index.json');

const exts = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

try {
  if (!fs.existsSync(galleryDir)) {
    console.error('Directory not found:', galleryDir);
    process.exit(1);
  }

  const files = fs.readdirSync(galleryDir)
    .filter(f => {
      const s = fs.statSync(path.join(galleryDir, f));
      if (!s.isFile()) return false;
      return exts.has(path.extname(f).toLowerCase());
    })
    .sort((a,b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

  const data = files.map(f => ({ file: f }));

  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');
  console.log('Wrote', outFile, 'with', files.length, 'items');
} catch (err) {
  console.error(err);
  process.exit(1);
}
