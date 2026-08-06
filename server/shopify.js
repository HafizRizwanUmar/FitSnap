import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';
import '@shopify/shopify-api/adapters/node';

export const shopify = shopifyApi({
  apiKey: (process.env.SHOPIFY_API_KEY || 'missing'),
  apiSecretKey: (process.env.SHOPIFY_API_SECRET || 'missing'),
  scopes: (process.env.SCOPES || 'read_products').split(','),
  hostName: (process.env.HOST || 'https://fit-snap-orcin.vercel.app').replace(/https?:\/\//, '') ?? '',
  apiVersion: ApiVersion.October24,
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
  logger: { level: LogSeverity.Warning },
});

export const SESSION_COOKIE = 'fitsnap_session';

