# MCP Server

The TON Dev Skills MCP server exposes all toolkit features as tools for AI assistants (Claude, Cursor, Windsurf, etc.).

**Requires Pro or Enterprise plan.**

## Available Tools

| Tool | Description |
|------|-------------|
| `ton_audit` | Run security audit on a contract file or source string |
| `ton_compile` | Compile a FunC/Tact/Tolk contract |
| `ton_scaffold` | Generate a new contract from template |
| `ton_deploy` | Deploy a compiled contract to testnet/mainnet |
| `ton_tep_check` | Check TEP compliance for a contract |
| `ton_migrate` | Migrate a Solidity contract to TON-native |
| `ton_test_gen` | Generate test cases for a contract |
| `ton_debug` | Explain TVM exit codes |
| `ton_gas_estimate` | Estimate gas usage |

## Setup

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Cursor

Add to `.cursor/mcp.json` in your project:

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

### Windsurf / Other MCP Clients

```bash
# Start the server manually (stdio transport)
ton-dev mcp start

# Start with SSE transport on a specific port
ton-dev mcp start --transport sse --port 3100
```

## Transport Options

| Transport | Use Case |
|-----------|----------|
| `stdio` | Local IDE integration (default) |
| `sse` | Remote or shared access |

## Example Prompts

Once connected, try asking your AI assistant:

- "Audit `contracts/jetton.fc` for security issues"
- "Migrate `MyToken.sol` from Solidity to a TON Jetton"
- "Scaffold a new NFT collection called CoolCats"
- "Is this contract TEP-74 compliant?"
- "Generate tests for my Jetton wallet contract"

See [API docs](api.md) for full tool schemas.
