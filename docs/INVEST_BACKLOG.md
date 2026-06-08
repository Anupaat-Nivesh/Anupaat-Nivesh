# Invest platform — backlog (post MVP)

- [x] mfdata.in proxy (`/api/mutual-funds/*`) — AUM, returns, holdings, managers (falls back to mfapi NAV when mfdata is down)
- [ ] AMFI / RTA feed: official benchmark, SEBI riskometer (mfdata covers AUM/holdings when service is up)
- [ ] Live sector & stock holdings: wired via mfdata; illustrative fallback when enrichment unavailable
- [ ] Dedicated EmailJS template for basket unlock with PDF holdings
- [ ] Webhook automation: `payment.captured` → CRM + fund list email
- [ ] Wire real basket holdings in `src/basket/data/baskets.js`
- [ ] AMC directory grid view (`/invest/amc`)
- [ ] User accounts / login (if product requires persistence beyond localStorage)
