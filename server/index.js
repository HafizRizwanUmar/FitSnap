import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.js';
import { billingRoutes } from './routes/billing.js';
import { gdprRoutes } from './routes/gdpr.js';
import { appRoutes } from './routes/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Raw body for HMAC webhook verification
app.use((req, res, next) => {
  express.json({
    verify: (req, res, buf) => { req.rawBody = buf; }
  })(req, res, next);
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static public assets
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));

// Register routes
authRoutes(app);
billingRoutes(app);
gdprRoutes(app);
appRoutes(app);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`FitSnap running on http://localhost:${PORT}`));
}

export default app;

