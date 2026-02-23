# Migration Engine

Convert EVM smart contracts to TON-native equivalents automatically.

**Requires Pro or Enterprise plan.**

## Supported Migrations

| Source (EVM) | Target (TON) | Standard |
|---|---|---|
| ERC-20 | Jetton Master + Wallet | TEP-74, TEP-89 |
| ERC-721 | NFT Collection + Item | TEP-62, TEP-64 |
| ERC-1155 | SBT Collection | TEP-85 |
| ERC-4626 (Vault) | Custom Jetton Vault | — |
| Governor / DAO | TON DAO Contract | — |
| Multisig | Multisig Wallet | — |

## What the Engine Does

1. **Parses** the Solidity source and extracts contract logic
2. **Maps** EVM patterns to TON equivalents:
   - `mapping(address => uint)` → per-wallet contract architecture
   - `transfer()` → internal message with `transfer` op
   - `approve/transferFrom` → removed (not applicable on TON's actor model)
   - Events → external messages
3. **Generates** Tact source files for all required contracts
4. **Validates** TEP compliance on generated output
5. **Runs security audit** on generated contracts automatically
6. **Produces** a migration report with change summary

## Output Language

Generated contracts are in **Tact** by default. FunC output is available with `--lang func`.

## Usage

```bash
# Basic migration
ton-dev migrate --from solidity --contract ./MyToken.sol

# Specify output language
ton-dev migrate --from solidity --contract ./MyToken.sol --lang func

# Custom output directory
ton-dev migrate --from solidity --contract ./MyNFT.sol --output ./ton/

# Dry run — show what would be generated
ton-dev migrate --from solidity --contract ./MyToken.sol --dry-run
```

## Limitations

- Custom Solidity modifiers are translated on a best-effort basis
- Assembly blocks (`assembly { }`) are flagged and skipped
- Cross-contract inheritance is flattened before translation
- External library calls (e.g., OpenZeppelin) are resolved if source is available

## Migration Report

Every migration produces a detailed report including:
- Source → target mapping summary
- Pattern translations applied
- Features removed (not applicable on TON)
- TEP compliance status
- Security audit results on generated code

See [sample migration report](../examples/sample-migration-report.md) for an example.
