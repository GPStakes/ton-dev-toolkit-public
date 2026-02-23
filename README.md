<p align="center">
  <h1 align="center">🔒 TON Dev Toolkit</h1>
  <p align="center">
    <strong>Security scanner, migration engine, MCP server & CLI for TON smart contracts</strong>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/@tesseraeventures/ton-dev-skills"><img src="https://img.shields.io/npm/v/@tesseraeventures/ton-dev-skills" alt="npm"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <a href="https://discord.gg/tesseraeventures"><img src="https://img.shields.io/discord/placeholder?label=discord" alt="Discord"></a>
  </p>
</p>

---

**TON Dev Toolkit** is a comprehensive development and security platform for the TON blockchain. It scans FunC, Tact, and Tolk contracts for vulnerabilities, migrates Solidity contracts to TON-native equivalents, and integrates directly into your AI-powered IDE via MCP.

## ✨ What You Get

| Feature | Description |
|---------|-------------|
| **Security Scanner** | 45+ rules across 19 categories — from reentrancy to TEP compliance |
| **Migration Engine** | Convert ERC-20, ERC-721, ERC-1155 and more from EVM → TON (Jettons, NFTs, SBTs) |
| **MCP Server** | Use scanner, migration, and contract tools directly in Claude, Cursor, Windsurf, etc. |
| **CLI** | Audit, compile, deploy, scaffold, and test-generate from the command line |
| **Contract Templates** | Production-ready Jetton, NFT, DAO, DEX, and multisig templates |

## 🔍 Scanner Categories

The security scanner checks **45+ rules** across these categories:

| | | | |
|---|---|---|---|
| Access Control | Arithmetic Safety | Bounced Messages | Cell Overflow |
| Code Injection | Compilation | Data Validation | Denial of Service |
| External Messages | Gas & Fees | Integer Handling | Randomness |
| Replay Protection | Reentrancy | State Management | Storage |
| TEP Compliance | Timestamp | Upgradeability | |

## 📊 Sample Scanner Output

```
$ ton-audit contracts/my-jetton.fc

  TON Dev Toolkit — Security Audit
  ═══════════════════════════════════

  Contract: contracts/my-jetton.fc
  Language:  FunC
  Rules:     45 checked

  ┌──────────┬────────────────────────────────────┬──────────┐
  │ Severity │ Finding                            │ Line     │
  ├──────────┼────────────────────────────────────┼──────────┤
  │ 🔴 HIGH  │ Missing sender validation on       │ L42      │
  │          │ internal_transfer handler           │          │
  ├──────────┼────────────────────────────────────┼──────────┤
  │ 🟡 MED   │ No bounce handler for failed       │ L87      │
  │          │ token transfers                     │          │
  ├──────────┼────────────────────────────────────┼──────────┤
  │ 🔵 LOW   │ Gas estimation missing on          │ L103     │
  │          │ cross-contract call                 │          │
  ├──────────┼────────────────────────────────────┼──────────┤
  │ 🟢 INFO  │ Consider TEP-74 metadata           │ L12      │
  │          │ extension for discoverability       │          │
  └──────────┴────────────────────────────────────┴──────────┘

  Summary: 1 high · 1 medium · 1 low · 1 info
  Full report: ./audit-report-1708099200.json
```

## 🔄 Sample Migration Output

```
$ ton-migrate --from solidity --contract contracts/MyToken.sol

  TON Dev Toolkit — Migration Engine
  ═══════════════════════════════════

  Source:     contracts/MyToken.sol (ERC-20)
  Target:     Jetton (TEP-74) + Jetton Wallet (TEP-89)
  Language:   Tact

  ✅ Token metadata mapped (name, symbol, decimals)
  ✅ Mint/burn logic converted to Jetton master ops
  ✅ Transfer → internal_transfer + transfer_notification
  ✅ Approval pattern removed (not applicable on TON)
  ✅ TEP-74 compliance verified
  ✅ Security audit passed (0 high, 0 medium findings)

  Output: ./output/my-token-jetton.tact
          ./output/my-token-wallet.tact
          ./output/migration-report.md
```

## 🚀 Getting Started

```bash
# Install from npm
npm install -g @tesseraeventures/ton-dev-skills

# Run your first audit
ton-audit ./contracts/my-contract.fc

# Migrate a Solidity contract
ton-migrate --from solidity --contract ./MyToken.sol

# Start the MCP server (for Claude, Cursor, etc.)
ton-mcp start
```

👉 **[Full Getting Started Guide →](docs/getting-started.md)**

## 🤖 MCP Integration

Add to your Claude Desktop or Cursor config:

```json
{
  "mcpServers": {
    "ton-dev": {
      "command": "ton-mcp",
      "args": ["start"]
    }
  }
}
```

Then ask your AI assistant things like:
- *"Audit this FunC contract for security issues"*
- *"Migrate this ERC-20 to a TON Jetton"*
- *"Scaffold a new NFT collection contract"*
- *"Check if this contract is TEP-74 compliant"*

👉 **[MCP Server Docs →](docs/mcp-server.md)**

## 💰 Pricing

| | Free | Pro | Enterprise |
|---|---|---|---|
| **Security Audits** | 5/day | Unlimited | Unlimited |
| **Scanner Rules** | 45+ | 45+ | 45+ + custom rules |
| **Migration Engine** | — | ✅ | ✅ |
| **MCP Server** | — | ✅ | ✅ |
| **Contract Templates** | Basic | All | All + custom |
| **CLI Tools** | Audit only | Full suite | Full suite |
| **Support** | Community | Priority | Dedicated + on-prem |
| **Price** | $0 | $29/mo | Contact us |

→ [Get started free](https://tesserae.ventures/ton-dev) · [Upgrade to Pro](https://tesserae.ventures/ton-dev/pro)

## 📚 Documentation

- [Getting Started](docs/getting-started.md)
- [Security Scanner](docs/scanner.md)
- [Migration Engine](docs/migration.md)
- [MCP Server](docs/mcp-server.md)
- [CLI Reference](docs/cli.md)
- [Contract Templates](docs/templates.md)
- [API / Tool Schemas](docs/api.md)

## 🔗 Links

- **npm:** [@tesseraeventures/ton-dev-skills](https://www.npmjs.com/package/@tesseraeventures/ton-dev-skills)
- **Docs:** [docs.tesserae.ventures/ton-dev](https://docs.tesserae.ventures/ton-dev) *(coming soon)*
- **Discord:** [discord.gg/tesseraeventures](https://discord.gg/tesseraeventures)
- **Website:** [tesserae.ventures](https://tesserae.ventures)

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

Core scanner rules and migration logic are proprietary. The CLI, MCP server interface, and this repository are open source.
