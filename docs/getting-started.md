# Getting Started

## Installation

```bash
npm install -g @tesseraeventures/ton-dev-skills
```

Requires Node.js 18+.

## Authentication

```bash
# Free tier — no auth required for up to 5 audits/day
ton-audit ./contract.fc

# Pro/Enterprise — authenticate with your API key
ton-auth login
# Opens browser for authentication
```

## Quick Start

### 1. Audit a Contract

```bash
# Audit a FunC contract
ton-audit ./contracts/jetton-minter.fc

# Audit a Tact contract
ton-audit ./contracts/nft-collection.tact

# Audit with JSON output
ton-audit ./contracts/jetton-minter.fc --format json --output report.json
```

### 2. Migrate from Solidity (Pro)

```bash
# Migrate an ERC-20 to Jetton
ton-migrate --from solidity --contract ./MyToken.sol

# Migrate with custom output directory
ton-migrate --from solidity --contract ./MyNFT.sol --output ./ton-contracts/
```

### 3. Scaffold a New Contract

```bash
# Create a new Jetton from template
ton-scaffold jetton --name "MyToken" --symbol "MTK"

# Create an NFT collection
ton-scaffold nft-collection --name "MyNFTs"
```

### 4. Start MCP Server (Pro)

```bash
ton-mcp start
```

See [MCP Server docs](mcp-server.md) for IDE integration.

## What's Next

- [Scanner categories & what gets checked](scanner.md)
- [Full CLI reference](cli.md)
- [Contract templates](templates.md)
- [Migration guide](migration.md)
