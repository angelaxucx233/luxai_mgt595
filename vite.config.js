import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lecturesDir = path.join(__dirname, 'lectures');

function isSlidePdf(name) {
  if (!/^MGT 403 - Lecture \d+/i.test(name)) return false;
  if (/notes|solutions/i.test(name)) return false;
  return name.toLowerCase().endsWith('.pdf');
}

/** Serve /lectures PDFs in dev and copy slide decks to dist on build. */
function lecturesPlugin() {
  return {
    name: 'luxai-lectures',
    configureServer(server) {
      server.middlewares.use('/lectures', (req, res, next) => {
        const raw = decodeURIComponent((req.url || '').split('?')[0]);
        const rel = raw.replace(/^\/+/, '');
        const filePath = path.join(lecturesDir, rel);
        if (!filePath.startsWith(lecturesDir) || !fs.existsSync(filePath)) {
          next();
          return;
        }
        if (path.extname(filePath).toLowerCase() === '.pdf') {
          res.setHeader('Content-Type', 'application/pdf');
        }
        fs.createReadStream(filePath).pipe(res);
      });
    },
    closeBundle() {
      const outDir = path.join(__dirname, 'dist', 'lectures');
      if (!fs.existsSync(lecturesDir)) return;
      fs.mkdirSync(outDir, { recursive: true });
      for (const name of fs.readdirSync(lecturesDir)) {
        if (isSlidePdf(name)) {
          fs.copyFileSync(path.join(lecturesDir, name), path.join(outDir, name));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), lecturesPlugin()],
  server: {
    port: 5173,
    open: true,
  },
});
