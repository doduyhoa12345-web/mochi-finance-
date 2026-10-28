# Mochi Finance V0.3 — Full-stack foundation

Personal finance app for Vercel. Light Finance UI + Next.js API + PostgreSQL persistence.

## Included
- Overview, History, Budgets, Accounts, Settings, daily detail modal
- Transaction types: Expense, Income, Transfer, Refund/Reimbursement, Adjustment
- Natural Vietnamese input parser (multi-item input supported)
- Default account rules: everyday → Tech chính; Di chuyển/Kudog → Tech Credit; Shopee/Buy Stuff → HSBC Credit
- API for add/update/delete transaction, budget update, account settings
- PostgreSQL schema and seed data
- Demo mode when no database is configured

## Deploy on Vercel
1. Upload this folder to the `mochi-finance` GitHub repo and import/redeploy it in Vercel.
2. Add a PostgreSQL database to the project (any Postgres provider is fine) and expose its connection string as `DATABASE_URL`.
3. Locally or from a shell that has the same `DATABASE_URL`, run `npm install` then `npm run db:init` once.
4. Redeploy. The badge at the top changes from `Demo mode` to `Database connected`.
5. In Accounts, set the real opening/current balances before entering live transactions.

## Important data rule
Do not import old balances as truth. Historical Google Sheet data should be migrated separately at the granularity actually present in the sheet; missing categories must not be invented.

## Parser examples
- `cafe 70k, trưa 150k, grab 90k, shopee 450k`
- `lương tháng 10 40.3tr vào Tech`
- `A trả lại 1tr tiền ăn`
- `chuyển 10tr từ tech sang tiết kiệm`

The parser is intentionally deterministic for V0.3. It can later be upgraded with an AI fallback without changing the ledger/database model.
