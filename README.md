# NalamUnavu — GitHub → Vercel package

This package is ready to push to GitHub and import into Vercel.

## Deploy
1. Create a GitHub repository and upload all files in this folder.
2. In Vercel, choose **Add New Project** → import the GitHub repository.
3. Framework preset: **Other**. No build command is required.
4. In Vercel → Project Settings → Environment Variables, add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Deploy. Test `/api/health` and confirm `paymentConfigured: true`.
6. Use Razorpay **test keys first**. After successful end-to-end testing, replace with live keys and redeploy.
7. Add your custom domain in Vercel → Project → Domains.

## Payment flow
The browser calls `/api/create-order`; the server creates a Razorpay Order. Razorpay Checkout then collects the payment. The callback is sent to `/api/verify-payment`, where the signature is verified server-side before the application marks the order/subscription as paid.

## Important production note
The uploaded legacy application stores users, restaurants, orders, and sessions in browser/in-memory JavaScript. This package fixes the payment secret handling and makes the site deployable, but **that legacy data model is not a secure production database/authentication system**. Before onboarding real customers or storing health/medical data, migrate accounts/orders/medical data to a real database + server-side authentication (for example PostgreSQL/Supabase/Neon) and add privacy/consent, backups, retention controls, monitoring, and legal/compliance review.

Do not put `RAZORPAY_KEY_SECRET` in `index.html` or commit it to GitHub.
