# TON Dev Skills

Practical TON contract tooling for agents and developers.

## Install

```bash
npm i -g @tesserae/ton-dev-skills
# or run without install
npx -y @tesserae/ton-dev-skills doctor --json
```

## Why this is more evaluator-friendly than typical TON tooling

Compared to standard scaffolding-first tools (e.g., Blueprint), TON Dev Skills optimizes for **proof + security + automation**:
- deterministic PASS/FAIL demo modes in one command
- machine-readable JSON/SARIF outputs for CI and grant reviewers
- one-command judge report generation
- one-command GitHub CI workflow bootstrap

## Top 3 new priorities shipped (v0.1.4)

1. **Judge report generator**
```bash
ton-dev report --judge --out GRANT_EVIDENCE.md
```

2. **CI workflow bootstrap**
```bash
ton-dev ci --github
```

3. **Init with CI on day one**
```bash
ton-dev init my-ton-project --ci
```

## 60-second judge path

```bash
npx -y @tesserae/ton-dev-skills doctor --json
npx -y @tesserae/ton-dev-skills demo --pass --ci --out ./.ton-dev-artifacts
npx -y @tesserae/ton-dev-skills demo --fail --ci --out ./.ton-dev-artifacts
npx -y @tesserae/ton-dev-skills report --judge --out GRANT_EVIDENCE.md
```

## Commands

- `ton-dev doctor [--json]`
- `ton-dev init [dir] [--ci]`
- `ton-dev ci --github [--out <dir>]`
- `ton-dev demo [--json] [--ci] [--pass|--fail] [--out <dir>]`
- `ton-dev audit <file|dir> [--format table|json|sarif] [--out <file>] [--explain]`
- `ton-dev rules --ton`
- `ton-dev scorecard [--json]`
- `ton-dev report --judge [--out <file>]`

## Links

- npm: https://www.npmjs.com/package/@tesserae/ton-dev-skills
- GitHub: https://github.com/TesseraeVentures/ton-dev-skills

## License

MIT
