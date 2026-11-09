# IntentMesh

**A decentralized cross-chain intent coordination network powered by Arkiv.**

IntentMesh is a Web3 application that enables users to publish cross-chain transaction intents and allows independent solvers to discover, claim, and fulfil them.

Instead of relying on a centralized coordinator, IntentMesh uses **Arkiv's queryable, owner-controlled entities** to maintain shared intent state and a verifiable execution history.

## How It Works

1. **Publish an Intent:** Users publish a cross-chain request specifying the source chain, destination chain, token, amount, and recipient.
2. **Discover Intents:** Solvers query Arkiv to discover available intents matching their capabilities.
3. **Claim an Intent:** A solver creates a separate claim entity linked to the original intent.
4. **Execute:** The solver fulfils the requested operation.
5. **Record Completion:** An execution receipt is published and linked to the original intent, creating a verifiable lifecycle history.

## Built With

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Data Layer:** Arkiv DB-Chain
- **Blockchain SDK:** `@arkiv-network/sdk`, Viem
- **Network:** Arkiv Rabdi Testnet

## Arkiv Integration

Arkiv is the core coordination and data layer of IntentMesh.

The application explores:

- Queryable entities using typed, indexed attributes.
- Entity ownership and permission management.
- Entity relationships through native entity-key references.
- Entity lifecycle management and expiration.
- Atomic batch operations.
- Verifiable transaction and execution history.

## Current Progress

### Implemented

- [x] Arkiv Rabdi testnet connection
- [x] Intent entity schema and creation
- [x] Retrieve entities by key
- [x] Query intents using indexed attributes
- [x] Update intent status using `patchEntity()`
- [x] Filter intents by source chain, destination chain, and status
- [x] Default discovery of OPEN intents
- [x] Solver claim entity creation and retrieval
- [x] Link claims to original intents using native entity-key references
- [x] Validate intent status before claiming
- [x] Check for existing active claims
- [x] Atomically create claims and update intent status using batch operations

### Planned

- [ ] Complete solver lifecycle
- [ ] Execution receipts
- [ ] Robust concurrent claim coordination
- [ ] Frontend for publishing and discovering intents
- [ ] Cross-chain execution integration

## Development Status

🚧 **Under Development**

IntentMesh is being developed as a decentralized cross-chain intent coordination system, with Arkiv providing the shared, queryable state layer.

The initial implementation targets the Arkiv Rabdi testnet.

---

*Built for the Arkiv ecosystem.*