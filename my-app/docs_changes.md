# Payment Integration Blueprint (Razorpay + Stripe)

## What was added

- Added a client-side payments service at `lib/payments.ts` with:
  - gateway resolution (`resolveProvider`) for India vs international
  - typed API contracts for create/status/razorpay verify
  - fetch wrappers for:
    - `POST /api/payments/create`
    - `POST /api/payments/verify-razorpay`
    - `GET /api/payments/:localOrderId/status`

- Updated `app/(root)/(tabs)/outfit.tsx` into a payment integration sandbox:
  - user inputs for country, currency, and amount
  - provider preview (razorpay/stripe)
  - payment create + status query flow wired to backend API

## Required backend endpoints

Implement these endpoints on your backend:

1. `POST /api/payments/create`
2. `POST /api/payments/verify-razorpay`
3. `GET /api/payments/:localOrderId/status`
4. `POST /api/webhooks/stripe`
5. `POST /api/webhooks/razorpay`

## Required env for app

Add to `.env`:

- `EXPO_PUBLIC_PAYMENTS_API_BASE_URL=https://your-backend-domain.com`

## Notes

- This frontend intentionally does not process card/UPI details directly.
- Final payment confirmation should always rely on backend webhook verification.
