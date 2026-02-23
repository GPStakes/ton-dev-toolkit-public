# CLI Reference

All commands use the `ton-dev` binary with subcommands.

## Commands

### `ton-dev audit`

Run a security audit on one or more contracts.

```
ton-dev audit <path> [options]

Arguments:
  path                Contract file or directory to audit

Options:
  --format <type>     Output format: terminal, json, sarif, markdown (default: terminal)
  --output <file>     Write report to file instead of stdout
  --severity <level>  Minimum severity: info, low, medium, high (default: info)
  --categories <list> Comma-separated categories to check (default: all)
  --no-color          Disable colored output
  -q, --quiet         Only output findings (no banner/summary)
  --json              Machine-readable JSON output
  -h, --help          Show help
```

### `ton-dev compile`

Compile a FunC, Tact, or Tolk contract.

```
ton-dev compile <path> [options]

Options:
  --output <file>     Output BOC file path
  -h, --help          Show help
```

### `ton-dev scaffold`

Generate a new contract from a template.

```
ton-dev scaffold <template> [options]

Templates:
  jetton              Jetton master + wallet (TEP-74)
  nft-collection      NFT collection + item (TEP-62)
  sbt                 Soulbound token (TEP-85)
  dao                 DAO governance contract
  multisig            Multi-signature wallet
  dex-pool            DEX liquidity pool

Options:
  --name <name>       Contract/token name
  --symbol <symbol>   Token symbol
  --type <language>   Output language: tact, func (default: tact)
  --output <dir>      Output directory (default: ./)
  -h, --help          Show help
```

### `ton-dev init`

Initialize a TON project in the current directory.

```
ton-dev init [options]

Options:
  -h, --help          Show help
```

### `ton-dev deploy`

Deploy a compiled contract.

```
ton-dev deploy <boc> [options]

Options:
  --network <net>     Network: testnet, mainnet (default: testnet)
  --wallet <path>     Path to wallet keys
  --amount <ton>      Initial TON balance (default: 0.05)
  -h, --help          Show help
```

### `ton-dev debug`

Explain TVM exit codes or trace transactions.

```
ton-dev debug <exit-code>    Explain a TVM exit code
ton-dev debug tx <tx-hash>   Trace a transaction

Options:
  -h, --help          Show help
```

### `ton-dev gas`

Estimate gas usage for a contract.

```
ton-dev gas estimate <boc> [options]

Options:
  -h, --help          Show help
```

### `ton-dev migrate` (Pro)

Migrate an EVM contract to TON.

```
ton-dev migrate [options]

Options:
  --from <chain>      Source chain: solidity (default: solidity)
  --contract <path>   Path to source contract
  --lang <language>   Output language: tact, func (default: tact)
  --output <dir>      Output directory (default: ./output/)
  --dry-run           Show migration plan without generating files
  -h, --help          Show help
```

### `ton-dev test-gen` (Pro)

Generate test cases for a contract.

```
ton-dev test-gen <path> [options]

Options:
  --framework <fw>    Test framework: sandbox, jest (default: sandbox)
  --output <dir>      Output directory
  -h, --help          Show help
```

### `ton-dev mcp` (Pro)

Start the MCP server.

```
ton-dev mcp start [options]

Options:
  --transport <type>  Transport: stdio, sse (default: stdio)
  --port <number>     Port for SSE transport (default: 3100)
  -h, --help          Show help
```

## Global Options

These options work with any command:

```
  --help, -h          Show help
  --version, -v       Show version
  --json              Machine-readable JSON output
  --quiet, -q         Suppress non-essential output
  --verbose           Show detailed output
```
