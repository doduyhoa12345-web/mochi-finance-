# Mochi Finance V0.1
Personal finance dashboard prototype based on the agreed business rules.

## Included
- Dark Finance / Times New Roman design system
- Monthly dashboard
- Mochi quick-input command bar (UI interaction prototype)
- Budget progress by category
- Expense breakdown
- Daily expense ledger with expandable day detail
- Bank accounts + credit debt / limits / statement date
- 6-month Actual vs Baseline history concept
- Responsive mobile layout

## Business rules represented
- Income and expenses are separate from transfers
- Savings transfer is not an expense
- Credit purchase increases debt; credit payment is a transfer
- Budget is user-set; baseline is derived from historical actuals
- Actual Expense excludes housing and Giving
- Historical spreadsheet migration must preserve source granularity and must not infer missing categories

## Next implementation milestone
Persistent database, transaction parser, CRUD/rollback balance engine, settings, and Google Sheet migration.

## Run
npm install
npm run dev
