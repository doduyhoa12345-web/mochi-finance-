# Mochi Finance V0.4 — Neon Connected

Uses the Neon schema already initialized for Mochi Finance: 6 accounts, 23 categories, 8 October 2026 budgets.

## Vercel
Required environment variable: `DATABASE_URL` (provided by Neon integration).

Deploy after the Neon integration is connected. No additional SQL migration is required for V0.4.

## End-to-end features
- Mochi natural-language expense entry writes to Neon
- Dashboard reads real transactions
- Total Expense / Actual Expense / Savings are calculated from the ledger
- Budget progress reads real budget + transaction data
- Edit/delete transactions
- Account opening balance / credit limit / statement day editing
- Account balances derived from ledger so edit/delete rolls back automatically
- History reads real expense data
