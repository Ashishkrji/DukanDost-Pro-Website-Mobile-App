import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.ts';
import routes from './routes/index.ts';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { initReminderScheduler } from './utils/scheduler.ts';
import { initSentry, sentryErrorHandler } from './config/sentry.ts';

import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();
initSentry(app);

// ── Rate Limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── DB & Scheduler ──────────────────────────────────────────
connectDB();
initReminderScheduler();

// ── Routes ─────────────────────────────────────────────────
app.use('/api', routes);

// ── Health Check ───────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: process.env.APP_NAME || 'DukanDost Pro',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── Serve Frontend in Production ───────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../Frontend/dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res, next) => {
    // If request is for /api, skip to routes
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// ── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// The error handler must be before any other error middleware and after all controllers
sentryErrorHandler(app);

// ── Global Error Handler ───────────────────────────────────
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 DukanDost Pro API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api\n`);
});

export default app;
