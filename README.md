<p align="center">
  <h1 align="center">🔒 TON Dev Skills</h1>
  <p align="center">
    <strong>Security scanner, migration engine, MCP server & CLI for TON smart contracts</strong>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/@tesserae/ton-dev-skills"><img src="https://img.shields.io/npm/v/@tesserae/ton-dev-skills" alt="npm"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  </p>
</p>

---

**TON Dev Skills** is a comprehensive development and security platform for the TON blockchain. It scans FunC, Tact, and Tolk contracts for vulnerabilities, migrates Solidity contracts to TON-native equivalents, and integrates directly into your AI-powered IDE via MCP.

## ✨ What You Get

| Feature | Description |
|---------|-------------|
| **Security Scanner** | 50+ rules across 21 categories — from reentrancy to TEP compliance |
| **Migration Engine** | Convert ERC-20, ERC-721, ERC-1155 and more from EVM → TON (Jettons, NFTs, SBTs) |
| **MCP Server** | Use scanner, migration, and contract tools directly in Claude, Cursor, Windsurf, etc. |
| **CLI** | Audit, compile, deploy, scaffold, and test-generate from the command line |
| **Contract Templates** | Production-ready Jetton, NFT, DAO, DEX, and multisig templates |

## 🚀 Getting Started

```bash
# Install from npm
npm install -g @tesserae/ton-dev-skills

# Run your first audit
ton-dev audit ./contracts/my-contract.fc

# Scaffold a new contract
ton-dev scaffold jetton --name "MyToken" --symbol "MTK"

# Compile a contract
ton-dev compile ./contracts/my-contract.fc

# Start the MCP server (for Claude, Cursor, etc.)
ton-dev mcp start
```

👉 **[Full Getting Started Guide →](docs/getting-started.md)**

## 🔍 Scanner Categories

The security scanner checks **50+ rules** across these categories:

| | | | |
|---|---|---|---|
| Access Control | Arithmetic Safety | Bounced Messages | Cell Overflow |
| Code Injection | Compilation | Data Validation | Denial of Service |
| External Messages | Gas & Fees | Integer Handling | Randomness |
| Replay Protection | Reentrancy | State Management | Storage |
| TEP Compliance | Timestamp | Upgradeability | TVM Internals |
| Cross-Contract Safety | | | |

## 📊 Sample Output

```
$ ton-dev audit contracts/my-jetton.fc

  TON Dev Skills — Security Audit
  ═══════════════════════════════════

  Contract: contracts/my-jetton.fc
  Language:  FunC
  Rules:     53 checked

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

## 🔄 Migration Example

```
$ ton-dev migrate --from solidity --contract contracts/MyToken.sol

  TON Dev Skills — Migration Engine
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

## 🛠️ CLI Commands

| Command | Description | Plan |
|---------|-------------|------|
| `ton-dev audit <path>` | Security audit a contract or directory | Free |
| `ton-dev compile <file>` | Compile a FunC, Tact, or Tolk contract | Free |
| `ton-dev scaffold <template>` | Generate a contract from template | Free |
| `ton-dev init` | Initialize a TON project | Free |
| `ton-dev deploy <boc>` | Deploy a compiled contract | Free |
| `ton-dev debug <exit-code>` | Explain a TVM exit code | Free |
| `ton-dev gas estimate <boc>` | Estimate gas usage | Free |
| `ton-dev migrate <file>` | Migrate an EVM contract to TON | Pro |
| `ton-dev test-gen <file>` | Generate test cases | Pro |
| `ton-dev mcp start` | Start the MCP server | Pro |

## 🤖 MCP Integration

Add to your Claude Desktop or Cursor config:

```json
{
  "mcpServers": {
    "ton-dev": {
      "command": "ton-dev",
      "args": ["mcp", "start"]
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
| **Scanner Rules** | 50+ | 50+ | 50+ + custom rules |
| **Migration Engine** | — | ✅ | ✅ |
| **MCP Server** | — | ✅ | ✅ |
| **Contract Templates** | Basic | All | All + custom |
| **CLI Tools** | Core (audit, compile, scaffold, deploy, debug, gas) | Full suite | Full suite |
| **Support** | Community | Priority | Dedicated |
| **Price** | $0 | $29/mo | Contact us |

## 📚 Documentation

- [Getting Started](docs/getting-started.md)
- [Security Scanner](docs/scanner.md)
- [Migration Engine](docs/migration.md)
- [MCP Server](docs/mcp-server.md)
- [CLI Reference](docs/cli.md)
- [Contract Templates](docs/templates.md)
- [API / Tool Schemas](docs/api.md)

## 🔗 Links

- **npm:** [@tesserae/ton-dev-skills](https://www.npmjs.com/package/@tesserae/ton-dev-skills)
- **GitHub:** [TesseraeVentures/ton-dev-skills](https://github.com/TesseraeVentures/ton-dev-skills)

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

Core scanner rules and migration logic are proprietary. The CLI, MCP server interface, and this repository are open source.
