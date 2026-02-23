# Security Scanner

The TON Dev Toolkit security scanner analyzes FunC, Tact, and Tolk smart contracts for vulnerabilities, bad practices, and TEP compliance issues.

## Supported Languages

- **FunC** (`.fc`, `.func`)
- **Tact** (`.tact`)
- **Tolk** (`.tolk`)

## Scanner Categories

The scanner includes **45+ rules** across **19 categories**:

### 🔴 Critical & High Severity

| Category | What It Checks |
|----------|---------------|
| **Access Control** | Unauthorized function access, missing sender validation, privilege escalation |
| **Code Injection** | Unsafe code execution patterns, unvalidated external code |
| **Replay Protection** | Missing replay attack mitigations, seqno handling |
| **Reentrancy** | Cross-contract call ordering, state mutation after sends |

### 🟡 Medium Severity

| Category | What It Checks |
|----------|---------------|
| **Arithmetic Safety** | Integer overflow/underflow, unsafe division |
| **Bounced Messages** | Missing bounce handlers, unhandled bounced transfers |
| **Data Validation** | Unchecked input data, missing slice/cell validation |
| **External Messages** | Unsafe external message handlers, missing authentication |
| **Gas & Fees** | Insufficient gas forwarding, missing fee calculations |
| **Integer Handling** | Signedness issues, bit-width mismatches |
| **State Management** | Inconsistent state updates, race conditions |

### 🔵 Low & Info

| Category | What It Checks |
|----------|---------------|
| **Cell Overflow** | Cell size/depth limit violations |
| **Compilation** | Pragma issues, deprecated syntax |
| **Denial of Service** | Unbounded loops, gas exhaustion patterns |
| **Randomness** | Predictable random values, weak entropy sources |
| **Storage** | Inefficient storage layout, unnecessary reads/writes |
| **TEP Compliance** | TEP-62, TEP-64, TEP-74, TEP-81, TEP-85, TEP-89 conformance |
| **Timestamp** | Unsafe time-based logic, block time manipulation |
| **Upgradeability** | Unsafe upgrade patterns, missing migration logic |

## Output Formats

- **Terminal** — color-coded table (default)
- **JSON** — machine-readable, for CI/CD integration
- **SARIF** — compatible with GitHub Code Scanning
- **Markdown** — for reports and documentation

## CI/CD Integration

```yaml
# GitHub Actions example
- name: TON Security Audit
  run: |
    npm install -g @tesseraeventures/ton-dev-skills
    ton-audit ./contracts/ --format sarif --output results.sarif

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: results.sarif
```

## Severity Levels

| Level | Description |
|-------|-------------|
| 🔴 **High** | Exploitable vulnerability — funds at risk |
| 🟡 **Medium** | Potential vulnerability or significant bad practice |
| 🔵 **Low** | Minor issue, code quality concern |
| 🟢 **Info** | Suggestion, best practice recommendation |
