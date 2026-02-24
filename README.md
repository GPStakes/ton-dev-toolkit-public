# TON Dev Skills

Practical TON contract tooling for agents and developers.

## Install

```bash
npm i -g @tesserae/ton-dev-skills
# or run without install
npx -y @tesserae/ton-dev-skills doctor --json
```

## 60-second judge path

```bash
npx -y @tesserae/ton-dev-skills doctor --json
npx -y @tesserae/ton-dev-skills demo --ci --out ./.ton-dev-artifacts
cat ./.ton-dev-artifacts/demo-summary.json
```

The `demo --ci` command emits:
- deterministic pass/fail line
- `demo-summary.json`
- `demo.sarif`

## Commands

- `ton-dev doctor [--json]` — environment checks
- `ton-dev init [dir]` — scaffold starter TON project + config
- `ton-dev demo [--json] [--ci] [--out <dir>]` — deterministic demo scan
- `ton-dev audit <file|dir> [--format table|json|sarif] [--out <file>]`
- `ton-dev rules --ton` — list TON-native starter rulepack

## Machine-readable output

```bash
# JSON
npx -y @tesserae/ton-dev-skills audit examples/jetton.fc --format json --out report.json

# SARIF
npx -y @tesserae/ton-dev-skills audit examples/jetton.fc --format sarif --out report.sarif
```

## TON-native checks (starter)

- Missing bounce handling on state-changing flows
- Privileged paths without sender auth signals
- Cross-contract sends without visible gas/value checks
- External handlers without replay/signature checks
- Potentially unsafe send-mode usage

## Links

- npm: https://www.npmjs.com/package/@tesserae/ton-dev-skills
- GitHub: https://github.com/TesseraeVentures/ton-dev-skills

## License

MIT
