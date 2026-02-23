# Getting Started

## Installation

```bash
npm install -g @tesserae/ton-dev-skills
```

Requires Node.js 18+.

## Quick Start

### 1. Audit a Contract

```bash
# Audit a FunC contract
ton-dev audit ./contracts/jetton-minter.fc

# Audit a Tact contract
ton-dev audit ./contracts/nft-collection.tact

# Audit with JSON output
ton-dev audit ./contracts/jetton-minter.fc --format json --output report.json
```

### 2. Scaffold a New Contract

```bash
# Create a new Jetton from template
ton-dev scaffold jetton --name "MyToken" --symbol "MTK"

# Create an NFT collection
ton-dev scaffold nft-collection --name "MyNFTs"
```

### 3. Compile and Deploy

```bash
# Compile a contract
ton-dev compile ./contracts/jetton-minter.fc

# Deploy to testnet
ton-dev deploy ./build/jetton-minter.boc --network testnet
```

### 4. Debug TVM Errors

```bash
# Explain an exit code
ton-dev debug 9

# Trace a transaction
ton-dev debug tx EQ...abc123
```

### 5. Migrate from Solidity (Pro)

```bash
# Migrate an ERC-20 to Jetton
ton-dev migrate --from solidity --contract ./MyToken.sol

# Dry run — see what would be generated
ton-dev migrate --from solidity --contract ./MyToken.sol --dry-run
```

### 6. Start MCP Server (Pro)

```bash
ton-dev mcp start
```

See [MCP Server docs](mcp-server.md) for IDE integration.

## What's Next

- [Scanner categories & what gets checked](scanner.md)
- [Full CLI reference](cli.md)
- [Contract templates](templates.md)
- [Migration guide](migration.md)
