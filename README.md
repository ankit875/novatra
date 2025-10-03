# Novatra

An **AI-powered, on-chain prediction market** with round-based betting and **dynamic, weighted payouts**. Create markets, propose outcomes with the help of an AI agent, and settle rounds using trusted data sources (e.g., CoinMarketCap).

---

## What Novatra Does

- **Open Markets** – Anyone can spin up a market (e.g., "Will BTC hit $100k by Friday?", "Will SOL overtake XRP next week?").
- **AI-Assist** – GPT-powered agents help propose/curate outcomes, assign weights, and keep tabs on data.
- **Weighted Payouts** – Winners split the round's pool **proportionally to AI-assigned outcome weights**.
- **Dispute Handling** – Unclear outcomes are marked as **disputed**; those stakes are fully refunded and the dispute pot recycles into the next round.
- **USDC Support** – Wagers use USDC for clean accounting and easy UX.
- **Auth** – Email/Google sign-in via **AWS Amplify** for tracking positions across devices.

---

## Architecture (High Level)

- **Frontend:** Next.js (Pages Router) + AWS Amplify Auth
- **AI Agents:**
	- *Interactive* agent helps users craft outcomes, place bets, and explore insights.
	- *Automated* agent monitors data, assigns weights, marks results, and finalizes rounds.
- **On-Chain:** Aptos **Move** contracts manage the market pool, positions, and payouts.
- **Data Flow:** Agents crawl trusted sources → summarize → update weights/outcomes → send results on-chain at round end.

---

## Repo Structure (suggested)

```
novatra/
├─ contracts/
│  ├─ Move.toml
│  └─ sources/
│     ├─ helpers/
│     │   ├─ base_fungible_asset.move      # novatra_market::base_fungible_asset
│     │   └─ mock_usdc_fa.move             # novatra_market::mock_usdc_fa (local test token)
│     └─ generalized.move                  # novatra_market::generalized (prediction market)
├─ src/                                    # Next.js app (Pages Router)
│  └─ pages/                               # pages router (index.tsx, api/*, etc.)
├─ components/
├─ lib/
├─ public/
├─ package.json
├─ next.config.js
└─ README.md
```

> If you generated your Next.js app with a `src/` directory, just put `pages/` inside `src/` and adjust imports accordingly.

---

## Quick Start (Frontend)

You can use `create-next-app` and **select Pages Router** when prompted.

```bash
# Create a Next.js project
npx create-next-app@latest web

# During prompts:
# - Use TypeScript?           → Yes (recommended)
# - Use App Router?           → No
# - Use Pages Router?         → Yes
# - Use src/ directory?       → Your choice (both are supported)
# - Customize import alias?   → No (keeps "@/..." by default)

cd web
npm run dev
# http://localhost:3000
```

### Authentication (AWS Amplify)

1. Create an Amplify app & auth (Email/Google).
2. Download amplify_outputs.json after connecting your GitHub repo to AWS Amplify.
3. Place it in your web root (or wherever your app loads Amplify config).

Add any required API keys for your AI provider(s) to Amplify's secret manager.

---

## AI Agent Notes

- **Interactive Agent** – system/developer prompts + retrieval context; helps users propose outcomes & inspect live data.
- **Automated Agent** – scheduled runs to:
	- pull trusted market data,
	- (re)assign outcome weights,
	- mark winners/disputes at round end,
	- call smart contract entry functions to finalize and resolve.

Agents should persist their final decisions (weights, winners, disputes) on-chain at round cut-off.

---

## ⛓️ Smart Contracts (Aptos Move)

### Modules (under novatra_market)

- **base_fungible_asset** – Managed FA with owner capabilities (mint/transfer/burn/freeze).
- **mock_usdc_fa** – Lightweight USDC-like token for local testing.
- **generalized** – The core prediction market (rounds, outcomes, positions, payouts, disputes).

### Setup & Tests

```bash
cd contracts

# Run unit tests
aptos move test

# Publish (example; replace addresses/profiles)
aptos move publish \
	--profile default \
	--named-addresses novatra_market=0xYOUR_DEPLOYER_ADDR
```

For detailed instructions on deploying to AWS cloud, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws).

## Example (Aptos Testnet)

Use your own deployment addresses; these are placeholders from earlier development.

### Aptos Testnet

| Component Name | ID/Address |
| --- | --- |
| Package ID | 0x896f7c28432dc223478a0ff3e9325d23f97e8bc261c1896eab85ee20c1f66183 |
| Mock USDC | 0x74432d8fdde5be368d1fe3b717046e78bd712cc143000ccba136d2a16eb273be |
