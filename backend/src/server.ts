import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import cron from 'node-cron';

// Import routes
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';
import configRoutes from './routes/config';
import tagsRoutes from './routes/tags';
import emailRoutes from './routes/email';

// Import services
import { initializeEmailService, processPendingEmails } from './services/emailService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Demasiados intentos de inicio de sesión, por favor intente más tarde.',
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', limiter, leadsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/email', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Initialize email service
initializeEmailService();

// Schedule email processing every minute
cron.schedule('* * * * *', () => {
  processPendingEmails();
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🚀 Notorios CRM Backend                ║
║                                           ║
║   Server: http://localhost:${PORT}       ║
║   Status: ✓ Running                      ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;
