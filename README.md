# TON Dev Skills

Practical TON contract tooling for agents and developers.

## Install

```bash
npm i -g @tesserae/ton-dev-skills
# or run without install
npx @tesserae/ton-dev-skills doctor
```

## 60-second judge/demo path

```bash
npx @tesserae/ton-dev-skills doctor
npx @tesserae/ton-dev-skills demo
npx @tesserae/ton-dev-skills audit examples/jetton.fc --format table
```

## Commands

- `ton-dev doctor` — environment checks (Node version, write access)
- `ton-dev init [dir]` — scaffold starter TON project + config
- `ton-dev demo [--json]` — deterministic demo scan against bundled sample
- `ton-dev audit <file|dir> [--format table|json|sarif]` — TON-focused static checks
- `ton-dev rules --ton` — list TON-native starter rulepack

## TON-native checks (starter)

- Missing bounce handling on state-changing flows
- Privileged paths without sender auth signals
- Cross-contract sends without visible gas/value checks
- External handlers without replay/signature checks
- Potentially unsafe send-mode usage

## Machine-readable output

`audit` supports:
- `--format json`
- `--format sarif` (for CI/code scanning pipelines)

Example:

```bash
ton-dev audit contracts --format sarif > ton-dev.sarif
```

## Notes

This repo is the public package surface for fast adoption and evaluation.

- npm: https://www.npmjs.com/package/@tesserae/ton-dev-skills
- GitHub: https://github.com/TesseraeVentures/ton-dev-skills

## License

MIT
