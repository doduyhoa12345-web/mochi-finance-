# Mochi Finance v0.5.2

Fixes:
- Account values are now current balance/current debt snapshots, not historical opening balances.
- Saving an account records `balance_as_of` using Vietnam date. Only transactions after that date affect the displayed balance/debt.
- Historical migrated transactions remain available for History/charts but do not distort current account balances.
- Fixes `Invalid Date` in transaction rows when Neon returns a timestamp-like date string.
- No manual SQL migration required: `balance_as_of` is added automatically on first Account save.
