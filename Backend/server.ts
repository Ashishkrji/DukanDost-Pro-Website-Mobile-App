import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.ts';
import routes from './routes/index.ts';
import { initReminderScheduler } from './utils/scheduler.ts';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors()); // Allow all origins in development
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

// ── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

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
