import { shopify } from '../shopify.js';
import { createBillingCharge } from './billing.js';

export function authRoutes(app) {
  // Begin OAuth
  app.get('/shopify/auth', async (req, res) => {
    try {
      await shopify.auth.begin({
        shop: shopify.utils.sanitizeShop(req.query.shop, true),
        callbackPath: '/shopify/auth/callback',
        isOnline: false,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  // OAuth callback
  app.get('/shopify/auth/callback', async (req, res) => {
    try {
      const callback = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });
      // Register mandatory webhooks
      await registerWebhooks(callback.session);
      // Create billing subscription (3-day trial)
      const billingUrl = await createBillingCharge(callback.session);
      if (billingUrl) {
        return res.redirect(billingUrl);
      }
      // Redirect to embedded app
      const host = req.query.host;
      res.redirect(`/?shop=${callback.session.shop}&host=${host}`);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
}

async function registerWebhooks(session) {
  const client = new shopify.api.clients.Rest({ session });
  const topics = ['CUSTOMERS_DATA_REQUEST', 'CUSTOMERS_REDACT', 'SHOP_REDACT'];
  const baseUrl = `https://${process.env.HOST}`;
  for (const topic of topics) {
    try {
      await client.post({
        path: 'webhooks',
        data: {
          webhook: {
            topic: topic.toLowerCase().replace(/_/g, '/'),
            address: `${baseUrl}/webhooks/${topic.toLowerCase().replace(/_/g, '/')}`,
            format: 'json',
          },
        },
      });
    } catch (e) { /* Already registered is ok */ }
  }
}
