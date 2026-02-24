#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VERSION = '0.1.2';

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  gray: '\x1b[90m'
};

function c(color, text) {
  if (!process.stdout.isTTY) return text;
  return `${COLORS[color] || ''}${text}${COLORS.reset}`;
}

function getFlag(args, name, defaultValue = null) {
  const eq = args.find(a => a.startsWith(`${name}=`));
  if (eq) return eq.split('=').slice(1).join('=');
  const i = args.indexOf(name);
  if (i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1];
  return defaultValue;
}

function hasFlag(args, name) {
  return args.includes(name) || args.some(a => a.startsWith(`${name}=`));
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

function help() {
  console.log(`\n${c('bold', 'TON Dev Skills v' + VERSION)}

Usage:
  ton-dev doctor [--json]
  ton-dev init [directory]
  ton-dev demo [--json] [--ci] [--out <dir>]
  ton-dev audit <file|dir> [--format table|json|sarif] [--out <file>]
  ton-dev rules --ton
  ton-dev --version

Judge quick path:
  npx -y @tesserae/ton-dev-skills doctor --json
  npx -y @tesserae/ton-dev-skills demo --ci --out ./.ton-dev-artifacts
`);
}

function canWrite(dir) {
  try {
    const p = path.join(dir, `.ton-dev-write-test-${Date.now()}`);
    fs.writeFileSync(p, 'ok');
    fs.unlinkSync(p);
    return true;
  } catch {
    return false;
  }
}

function cmdDoctor(args) {
  const checks = [
    { name: 'Node.js >= 18', ok: Number(process.versions.node.split('.')[0]) >= 18, detail: process.versions.node },
    { name: 'Platform', ok: true, detail: `${process.platform}/${process.arch}` },
    { name: 'Write access to cwd', ok: canWrite(process.cwd()), detail: process.cwd() }
  ];
  const allOk = checks.every(x => x.ok);

  if (hasFlag(args, '--json')) {
    console.log(JSON.stringify({ ok: allOk, checks, version: VERSION }, null, 2));
    process.exit(allOk ? 0 : 1);
  }

  console.log(`\n${c('bold', 'TON Dev Doctor')}\n`);
  for (const chk of checks) {
    const icon = chk.ok ? c('green', '✓') : c('red', '✗');
    console.log(` ${icon} ${chk.name} ${c('gray', '(' + chk.detail + ')')}`);
  }
  console.log('');
  console.log(allOk ? c('green', 'Environment looks good.') : c('red', 'Environment check failed.'));
  process.exit(allOk ? 0 : 1);
}

function cmdInit(dir = '.') {
  const root = path.resolve(process.cwd(), dir);
  fs.mkdirSync(path.join(root, 'contracts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'reports'), { recursive: true });

  const samplePath = path.join(root, 'contracts', 'sample.fc');
  if (!fs.existsSync(samplePath)) {
    fs.writeFileSync(samplePath, `;; sample.fc\n() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {\n  ;; TODO: add sender checks and op dispatch\n}\n`);
  }

  const configPath = path.join(root, 'ton-dev.config.json');
  if (!fs.existsSync(configPath)) {
    writeJson(configPath, {
      version: 1,
      scanner: { format: 'table', failOn: 'high' },
      paths: { contracts: 'contracts', reports: 'reports' }
    });
  }

  console.log(c('green', `Initialized TON Dev project at ${root}`));
  console.log(`Next: ton-dev audit ${path.relative(process.cwd(), samplePath)} --format table`);
}

const TON_RULES = [
  { id: 'TON-BOUNCE-001', sev: 'high', title: 'Missing bounced-message handling on state-changing flow' },
  { id: 'TON-AUTH-001', sev: 'critical', title: 'Privileged operation without sender authorization check' },
  { id: 'TON-GAS-001', sev: 'medium', title: 'No explicit gas/value validation before heavy compute/send' },
  { id: 'TON-EXT-001', sev: 'high', title: 'External entry path without replay/seqno protection' },
  { id: 'TON-SEND-001', sev: 'medium', title: 'Potentially unsafe send mode usage' }
];

function cmdRules(args) {
  if (!args.includes('--ton')) {
    console.log('Use: ton-dev rules --ton');
    process.exit(1);
  }
  console.log(`\n${c('bold', 'TON-native rulepack')} (${TON_RULES.length} starter rules)\n`);
  TON_RULES.forEach(r => console.log(`- ${r.id} [${r.sev}] ${r.title}`));
}

function collectFiles(inputPath) {
  const p = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(p)) throw new Error(`Path not found: ${inputPath}`);
  const stat = fs.statSync(p);
  if (stat.isFile()) return [p];
  const out = [];
  const walk = d => {
    for (const n of fs.readdirSync(d)) {
      const fp = path.join(d, n);
      const st = fs.statSync(fp);
      if (st.isDirectory()) walk(fp);
      else if (/\.(fc|func|tact|tolk)$/i.test(n)) out.push(fp);
    }
  };
  walk(p);
  return out;
}

function lineOf(text, needle) {
  const idx = text.indexOf(needle);
  if (idx < 0) return 1;
  return text.slice(0, idx).split('\n').length;
}

function scanFile(fp) {
  const text = fs.readFileSync(fp, 'utf8');
  const findings = [];

  const hasStateMutation = /(set_data|save_data|total_supply\s*[+\-]=|store_)/i.test(text);
  const hasBounceCheck = /(flags\s*&\s*1|bounc|0xffffffff)/i.test(text);
  if (hasStateMutation && !hasBounceCheck) findings.push({ id: 'TON-BOUNCE-001', severity: 'high', message: 'State mutation without explicit bounced-message handling', line: 1 });

  const hasAdminLike = /(mint|burn|set_code|upgrade|owner|admin)/i.test(text);
  const hasSenderCheck = /(equal_slice_bits\(|sender\(\)|throw_unless\([^\n]*unauthor|require\([^\n]*owner|require\([^\n]*admin)/i.test(text);
  if (hasAdminLike && !hasSenderCheck) findings.push({ id: 'TON-AUTH-001', severity: 'critical', message: 'Potential privileged path without clear sender authorization', line: 1 });

  const hasSend = /(send_raw_message|message\(|send\()/i.test(text);
  const hasGasCheck = /(msg_value\s*[><=]|context\(\)\.value|throw_unless\([^\n]*gas|getComputeFee|raw_reserve|nativeReserve)/i.test(text);
  if (hasSend && !hasGasCheck) findings.push({ id: 'TON-GAS-001', severity: 'medium', message: 'Cross-contract send path without visible gas/value checks', line: lineOf(text, 'send') });

  const external = /(recv_external|onExternalMessage)/i.test(text);
  const replay = /(seqno|check_signature|signature)/i.test(text);
  if (external && !replay) findings.push({ id: 'TON-EXT-001', severity: 'high', message: 'External message handler without replay/signature checks', line: lineOf(text, 'recv_external') });

  return findings.map(f => ({ ...f, file: fp }));
}

function toSarif(results) {
  const rules = [];
  const seen = new Set();
  for (const r of results) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    rules.push({ id: r.id, shortDescription: { text: r.message } });
  }
  return {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'ton-dev-skills', rules } },
      results: results.map(r => ({
        ruleId: r.id,
        level: r.severity === 'critical' || r.severity === 'high' ? 'error' : 'warning',
        message: { text: r.message },
        locations: [{ physicalLocation: { artifactLocation: { uri: r.file }, region: { startLine: r.line || 1 } } }]
      }))
    }]
  };
}

function exitCodeFor(findings) {
  if (findings.some(f => f.severity === 'critical')) return 2;
  if (findings.length > 0) return 1;
  return 0;
}

function runAudit(input) {
  const files = collectFiles(input);
  let findings = [];
  files.forEach(f => findings = findings.concat(scanFile(f)));
  const summary = {
    scannedFiles: files.length,
    findings: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
    generatedAt: new Date().toISOString(),
    version: VERSION
  };
  return { summary, findings };
}

function cmdAudit(args) {
  const input = args.find(a => !a.startsWith('--'));
  if (!input) {
    console.error('Usage: ton-dev audit <file|dir> [--format table|json|sarif] [--out <file>]');
    process.exit(1);
  }

  const format = getFlag(args, '--format', 'table');
  const outFile = getFlag(args, '--out', null);
  const result = runAudit(input);

  let payload;
  if (format === 'sarif') payload = toSarif(result.findings);
  else if (format === 'json') payload = result;

  if (payload) {
    const text = JSON.stringify(payload, null, 2);
    if (outFile) {
      writeJson(path.resolve(process.cwd(), outFile), payload);
      console.log(`Wrote ${format.toUpperCase()} report: ${outFile}`);
    } else {
      console.log(text);
    }
  } else {
    console.log(`\n${c('bold', 'TON Dev Skills — Security Audit')}\n`);
    console.log(`Scanned files: ${result.summary.scannedFiles}`);
    console.log(`Findings: ${result.summary.findings} (${result.summary.critical} critical, ${result.summary.high} high, ${result.summary.medium} medium)\n`);
    if (result.findings.length === 0) console.log(c('green', 'No findings.'));
    else result.findings.forEach(f => {
      const sevColor = f.severity === 'critical' || f.severity === 'high' ? 'red' : 'yellow';
      console.log(`- ${c(sevColor, '[' + f.severity.toUpperCase() + ']')} ${f.id}: ${f.message}`);
      console.log(`  ${c('gray', path.relative(process.cwd(), f.file) + ':' + (f.line || 1))}`);
    });
  }

  process.exit(exitCodeFor(result.findings));
}

function cmdDemo(args) {
  const ci = hasFlag(args, '--ci');
  const json = hasFlag(args, '--json');
  const outDir = path.resolve(process.cwd(), getFlag(args, '--out', './.ton-dev-artifacts'));
  const sample = path.join(__dirname, 'examples', 'jetton.fc');
  const result = runAudit(sample);
  const code = exitCodeFor(result.findings);

  const summary = {
    demo: 'ton-dev-skills',
    sample: path.relative(process.cwd(), sample),
    pass: code === 0,
    exitCode: code,
    summary: result.summary,
    topFindings: result.findings.slice(0, 3)
  };

  if (ci) {
    const jsonPath = path.join(outDir, 'demo-summary.json');
    const sarifPath = path.join(outDir, 'demo.sarif');
    writeJson(jsonPath, summary);
    writeJson(sarifPath, toSarif(result.findings));
    console.log(`CI_RESULT=${summary.pass ? 'PASS' : 'FAIL'} EXIT_CODE=${code} SUMMARY=${jsonPath} SARIF=${sarifPath}`);
    process.exit(code);
  }

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`\n${c('bold', 'TON Dev Skills — Demo')}\n`);
    console.log(`Sample: ${summary.sample}`);
    console.log(`Findings: ${result.summary.findings} (${result.summary.critical} critical, ${result.summary.high} high, ${result.summary.medium} medium)`);
    console.log('Tip: ton-dev demo --ci --out ./.ton-dev-artifacts');
  }

  process.exit(code);
}

function main() {
  const [, , cmd, ...args] = process.argv;
  if (!cmd || ['help', '--help', '-h'].includes(cmd)) return help();
  if (['--version', '-v'].includes(cmd)) return console.log(VERSION);

  try {
    if (cmd === 'doctor') return cmdDoctor(args);
    if (cmd === 'init') return cmdInit(args[0] || '.');
    if (cmd === 'rules') return cmdRules(args);
    if (cmd === 'audit') return cmdAudit(args);
    if (cmd === 'demo') return cmdDemo(args);
    console.error(`Unknown command: ${cmd}`);
    help();
    process.exit(1);
  } catch (err) {
    console.error(c('red', `Error: ${err.message}`));
    process.exit(1);
  }
}

main();
