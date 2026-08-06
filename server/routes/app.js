import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { shopify } from '../shopify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function appRoutes(app) {
  // Serve dashboard (protected) - App Bridge embedded
  app.get('/', async (req, res) => {
    const shop = req.query.shop;
    const host = req.query.host;

    if (!shop) {
      return res.status(400).send('Missing shop parameter');
    }

    // Check if installed
    const sessionId = shopify.session.getOfflineId(shop);
    const session = await shopify.config.sessionStorage.loadSession(sessionId);

    if (!session?.accessToken) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
            <script>
              window.open(window.location.origin + '/shopify/auth?shop=${shop}&host=${host}', '_top');
            </script>
          </head>
          <body>Redirecting to authenticate...</body>
        </html>
      `);
    }

    res.setHeader('Content-Security-Policy', `frame-ancestors https://${encodeURIComponent(shop)} https://admin.shopify.com;`);
    // Serve the dashboard HTML with App Bridge config injected
    let html = fs.readFileSync(path.join(process.cwd(), 'views/index.html'), 'utf-8');
    html = html
      .replace('{{SHOPIFY_API_KEY}}', process.env.SHOPIFY_API_KEY)
      .replace('{{HOST}}', host || '')
      .replace('{{SHOP}}', shop);
    res.send(html);
  });

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok', app: 'FitSnap' }));
}


