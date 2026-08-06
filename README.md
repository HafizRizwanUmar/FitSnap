# FitSnap – Size Chart & Guide Popup

FitSnap is a modern, responsive Shopify app that allows merchants to easily create and manage size charts, and displays an elegant popup widget on their storefront to help customers find the perfect fit.

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` (it is already pre-filled for this test project).

3. **Run the local server:**
   ```bash
   npm run dev
   ```

4. **HTTPS Tunneling (ngrok):**
   Run ngrok or cloudflare tunnel to expose your local port (3000):
   ```bash
   ngrok http 3000
   ```
   Update your `.env` `HOST` variable and the Shopify Partner Dashboard App URL with the ngrok URL.

## Vercel Deployment

1. Login to Vercel CLI:
   ```bash
   vercel login
   ```
2. Deploy the app:
   ```bash
   vercel --prod
   ```
3. Set the Environment Variables in the Vercel Dashboard to match your `.env` file.

## Shopify Partner Dashboard Setup

1. Go to your app in the Shopify Partner Dashboard.
2. Update the **App URL** to your Vercel URL (or ngrok URL during dev).
3. Update the **Allowed redirection URL(s)** to `https://<YOUR_URL>/shopify/auth/callback`.

## Installing on Development Store

Use the Shopify Partner Dashboard to install the app on a development store. You will go through the OAuth flow and billing approval (3-day free trial).

## App Store Submission Checklist

- [ ] Ensure all App Bridge actions work correctly (toasts, titles).
- [ ] Verify mandatory GDPR webhooks return 200 OK.
- [ ] Test the Theme App Extension widget on a Dawn theme.
- [ ] Confirm Billing API properly redirects and charges.
