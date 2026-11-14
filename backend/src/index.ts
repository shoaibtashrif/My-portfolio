import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import contactRoutes from './routes/contact.js';
import assistantRoutes from './routes/assistant.js';
import { attachVoiceGateway } from './lib/voiceGateway.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 5050);

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, 'http://localhost:5174', 'http://localhost:5173']
      : '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'shoaib-portfolio-backend',
    liveVoiceWs: '/api/v1/voice',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/contact', contactRoutes);
app.use('/api/assistant', assistantRoutes);

const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  // Long-lived browser caching (1 year immutable) for images, videos, and hashed Vite bundles
  const immutableStaticOptions = {
    maxAge: '365d',
    immutable: true,
    etag: true,
    lastModified: true,
    setHeaders: (res: express.Response) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  };

  app.use('/images', express.static(path.join(frontendDist, 'images'), immutableStaticOptions));
  app.use('/videos', express.static(path.join(frontendDist, 'videos'), immutableStaticOptions));
  app.use('/assets', express.static(path.join(frontendDist, 'assets'), immutableStaticOptions));
  app.use(
    '/audio',
    express.static(path.join(frontendDist, 'audio'), {
      maxAge: '7d',
      etag: true,
      setHeaders: (res: express.Response) => {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      },
    })
  );

  app.use(
    express.static(frontendDist, {
      maxAge: '1h',
      etag: true,
      setHeaders: (res, filePath) => {
        if (/\.(jpg|jpeg|png|webp|gif|svg|ico|mp4|woff2?)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) return next();
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const server = http.createServer(app);
attachVoiceGateway(server);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Shoaib Portfolio running on http://0.0.0.0:${PORT} (Voice Gateway: /api/v1/voice)`);
});
