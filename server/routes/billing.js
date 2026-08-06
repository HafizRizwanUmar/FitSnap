import { shopify } from '../shopify.js';

const PLAN = {
  name: 'FitSnap Monthly',
  amount: 9.00,
  currencyCode: 'USD',
  interval: 'EVERY_30_DAYS',
  trialDays: 3,
};

export async function createBillingCharge(session) {
  try {
    const client = new shopify.api.clients.Graphql({ session });
    const response = await client.query({
      data: {
        query: `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays, test: ${process.env.NODE_ENV !== 'production'}) {
            userErrors { field message }
            confirmationUrl
            appSubscription { id status }
          }
        }`,
        variables: {
          name: PLAN.name,
          trialDays: PLAN.trialDays,
          returnUrl: `https://${process.env.HOST}/shopify/auth/callback/billing?shop=${session.shop}`,
          lineItems: [{
            plan: {
              appRecurringPricingDetails: {
                price: { amount: PLAN.amount, currencyCode: PLAN.currencyCode },
                interval: PLAN.interval,
              }
            }
          }]
        }
      }
    });
    return response.body.data.appSubscriptionCreate.confirmationUrl;
  } catch (e) {
    console.error('Billing error:', e);
    return null;
  }
}

export function billingRoutes(app) {
  // Called after merchant approves billing
  app.get('/shopify/auth/callback/billing', (req, res) => {
    const { shop, host } = req.query;
    res.redirect(`/?shop=${shop}&host=${host}`);
  });
}
