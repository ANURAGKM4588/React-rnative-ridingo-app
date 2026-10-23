import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const USER_WWW = path.join(ROOT_DIR, 'packages', 'user', 'www');
const DRIVER_WWW = path.join(ROOT_DIR, 'packages', 'driver', 'www');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const PORTS = [
  { port: 5173, defaultApp: 'user' },
  { port: 5174, defaultApp: 'driver' },
  { port: 8088, defaultApp: 'user' }
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function createRequestHandler(defaultApp) {
  return function requestHandler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const rawUrl = req.url || '/';
    const [pathPart, queryPart] = rawUrl.split('?');
    const reqPath = decodeURI(pathPart);
    const search = (queryPart || '').toLowerCase();
    const referer = (req.headers.referer || '').toLowerCase();

    // Determine target app (driver vs user)
    const isDriverReq =
      defaultApp === 'driver' ||
      reqPath.startsWith('/driver') ||
      reqPath.startsWith('/packages/driver') ||
      search.includes('app=driver') ||
      search.includes('view=driver') ||
      referer.includes('/driver') ||
      referer.includes(':5174') ||
      referer.includes('app=driver');

    const primaryDir = isDriverReq ? DRIVER_WWW : USER_WWW;
    const secondaryDir = isDriverReq ? USER_WWW : DRIVER_WWW;

    // Handle HTML routes
    if (reqPath === '/' || reqPath === '' || reqPath === '/user' || reqPath === '/driver') {
      const targetHtml = (reqPath === '/driver' || (reqPath === '/' && isDriverReq))
        ? path.join(DRIVER_WWW, 'index.html')
        : path.join(USER_WWW, 'index.html');

      return serveFile(targetHtml, res);
    }

    if (reqPath === '/admin' || reqPath === '/admin.html') {
      return serveFile(path.join(USER_WWW, 'admin.html'), res);
    }

    // Strip leading /driver or /user prefix for asset lookup if present
    let cleanAssetPath = reqPath;
    if (cleanAssetPath.startsWith('/driver/')) {
      cleanAssetPath = cleanAssetPath.slice(7);
    } else if (cleanAssetPath.startsWith('/user/')) {
      cleanAssetPath = cleanAssetPath.slice(5);
    }

    // Potential file locations to try in order
    const candidates = [
      path.join(ROOT_DIR, reqPath),
      path.join(primaryDir, cleanAssetPath),
      path.join(secondaryDir, cleanAssetPath),
      path.join(PUBLIC_DIR, cleanAssetPath),
      path.join(primaryDir, reqPath),
      path.join(secondaryDir, reqPath)
    ];

    let foundFile = null;
    for (const cand of candidates) {
      try {
        if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
          foundFile = cand;
          break;
        }
      } catch (_) {}
    }

    if (foundFile) {
      return serveFile(foundFile, res);
    }

    // SPA fallback: if it's a navigation request without a file extension, fallback to index.html
    if (!path.extname(reqPath)) {
      const fallbackHtml = isDriverReq
        ? path.join(DRIVER_WWW, 'index.html')
        : path.join(USER_WWW, 'index.html');
      if (fs.existsSync(fallbackHtml)) {
        return serveFile(fallbackHtml, res);
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`File Not Found: ${reqPath}`);
  };
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (readErr, content) => {
    if (readErr) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${readErr.code}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

PORTS.forEach(({ port, defaultApp }) => {
  const server = http.createServer(createRequestHandler(defaultApp));
  server.listen(port, '0.0.0.0', () => {
    const label = defaultApp === 'driver' ? 'Ridingo Driver App' : 'Ridingo User App';
    console.log(`🚀 ${label} running at: http://localhost:${port}/`);
  });
  server.on('error', (err) => {
    console.warn(`Port ${port} notice:`, err.message);
  });
});
