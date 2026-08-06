import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';
import '@shopify/shopify-api/adapters/node';

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(','),
  hostName: process.env.HOST?.replace(/https?:\/\//, '') ?? '',
  apiVersion: ApiVersion.October24,
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
  logger: { level: LogSeverity.Warning },
});

export const SESSION_COOKIE = 'fitsnap_session';
