import { shopify } from '../shopify.js';

export function gdprRoutes(app) {
  // GDPR webhook: customers/data_request
  app.post('/webhooks/customers/data_request', verifyWebhook, (req, res) => {
    // Log the request - no PII stored so nothing to return
    console.log('GDPR: customers/data_request received', req.body?.shop_domain);
    res.sendStatus(200);
  });

  // GDPR webhook: customers/redact
  app.post('/webhooks/customers/redact', verifyWebhook, (req, res) => {
    console.log('GDPR: customers/redact received', req.body?.shop_domain);
    // FitSnap does not store customer PII
    res.sendStatus(200);
  });

  // GDPR webhook: shop/redact
  app.post('/webhooks/shop/redact', verifyWebhook, (req, res) => {
    console.log('GDPR: shop/redact received', req.body?.shop_domain);
    // Clean up any shop-level data
    res.sendStatus(200);
  });
}

function verifyWebhook(req, res, next) {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const rawBody = req.rawBody || JSON.stringify(req.body);
  const valid = shopify.webhooks.validate({
    rawBody,
    hmac,
    secret: process.env.SHOPIFY_API_SECRET,
  });
  if (!valid) {
    console.error('Webhook HMAC validation failed');
    return res.sendStatus(401);
  }
  next();
}
