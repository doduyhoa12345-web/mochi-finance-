# Mochi Finance v0.5.2

Fixes:
- Account values are now current balance/current debt snapshots, not historical opening balances.
- Saving an account records `balance_as_of` using Vietnam date. Only transactions after that date affect the displayed balance/debt.
- Historical migrated transactions remain available for History/charts but do not distort current account balances.
- Fixes `Invalid Date` in transaction rows when Neon returns a timestamp-like date string.
- No manual SQL migration required: `balance_as_of` is added automatically on first Account save.

## v0.5.3
- Fixed current account balance calculation for transactions created later on the same day as the balance snapshot.
- Added `balance_anchor_at` timestamp automatically; no manual SQL migration required.
- Existing v0.5.2 accounts fall back to the account's previous `updated_at`, so same-day transactions after the last balance save are counted.
- Improved natural-language transfers between Tech chính, Tech tiết kiệm, Tech tiền nhà, VietinBank, Tech Credit and HSBC Credit.
- Transfers are one ledger transaction and are excluded from expense totals.
- Credit-card repayment via transfer to a credit account reduces outstanding debt.
- Transfer transaction editor now exposes both From account and To account.
