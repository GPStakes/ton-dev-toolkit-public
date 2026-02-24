#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VERSION = '0.1.1';

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  gray: '\x1b[90m'
};

function c(color, text) {
  if (!process.stdout.isTTY) return text;
  return `${COLORS[color] || ''}${text}${COLORS.reset}`;
}

function help() {
  console.log(`\n${c('bold', 'TON Dev Skills v' + VERSION)}

Usage:
  ton-dev doctor
  ton-dev init [directory]
  ton-dev demo [--json]
  ton-dev audit <file|dir> [--format table|json|sarif]
  ton-dev rules --ton
  ton-dev --version

Examples:
  npx @tesserae/ton-dev-skills doctor
  npx @tesserae/ton-dev-skills demo
  npx @tesserae/ton-dev-skills audit examples/jetton.fc --format table
`);
}

function cmdDoctor() {
  const checks = [];
  checks.push({ name: 'Node.js >= 18', ok: Number(process.versions.node.split('.')[0]) >= 18, detail: process.versions.node });
  checks.push({ name: 'Platform', ok: true, detail: `${process.platform}/${process.arch}` });
  checks.push({ name: 'Write access to cwd', ok: canWrite(process.cwd()), detail: process.cwd() });

  const allOk = checks.every(c => c.ok);
  console.log(`\n${c('bold', 'TON Dev Doctor')}\n`);
  for (const chk of checks) {
    const icon = chk.ok ? c('green', '✓') : c('red', '✗');
    console.log(` ${icon} ${chk.name} ${c('gray', '(' + chk.detail + ')')}`);
  }
  console.log('');
  if (allOk) {
    console.log(c('green', 'Environment looks good.'));
    process.exit(0);
  }
  console.log(c('red', 'Environment check failed.'));
  process.exit(1);
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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cmdInit(dir = '.') {
  const root = path.resolve(process.cwd(), dir);
  ensureDir(root);
  ensureDir(path.join(root, 'contracts'));
  ensureDir(path.join(root, 'reports'));

  const samplePath = path.join(root, 'contracts', 'sample.fc');
  if (!fs.existsSync(samplePath)) {
    fs.writeFileSync(samplePath, `;; sample.fc
() recv_internal(int msg_value, cell in_msg_full, slice in_msg_body) impure {
  ;; TODO: add sender checks and op dispatch
}
`);
  }

  const configPath = path.join(root, 'ton-dev.config.json');
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
      version: 1,
      scanner: { format: 'table', failOn: 'high' },
      paths: { contracts: 'contracts', reports: 'reports' }
    }, null, 2));
  }

  console.log(c('green', `Initialized TON Dev project at ${root}`));
  console.log(`Next: ton-dev audit ${path.relative(process.cwd(), samplePath)}`);
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
  for (const r of TON_RULES) {
    console.log(`- ${r.id} [${r.sev}] ${r.title}`);
  }
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
  if (idx < 0) return null;
  return text.slice(0, idx).split('\n').length;
}

function scanFile(fp) {
  const text = fs.readFileSync(fp, 'utf8');
  const findings = [];

  const hasStateMutation = /(set_data|save_data|total_supply\s*[+\-]=|store_)/i.test(text);
  const hasBounceCheck = /(flags\s*&\s*1|bounc|0xffffffff)/i.test(text);
  if (hasStateMutation && !hasBounceCheck) {
    findings.push({ id: 'TON-BOUNCE-001', severity: 'high', message: 'State mutation without explicit bounced-message handling', line: 1 });
  }

  const hasAdminLike = /(mint|burn|set_code|upgrade|owner|admin)/i.test(text);
  const hasSenderCheck = /(equal_slice_bits\(|sender\(\)|throw_unless\([^\n]*unauthor|require\([^\n]*owner|require\([^\n]*admin)/i.test(text);
  if (hasAdminLike && !hasSenderCheck) {
    findings.push({ id: 'TON-AUTH-001', severity: 'critical', message: 'Potential privileged path without clear sender authorization', line: 1 });
  }

  const hasSend = /(send_raw_message|message\(|send\()/i.test(text);
  const hasGasCheck = /(msg_value\s*[><=]|context\(\)\.value|throw_unless\([^\n]*gas|getComputeFee|raw_reserve|nativeReserve)/i.test(text);
  if (hasSend && !hasGasCheck) {
    findings.push({ id: 'TON-GAS-001', severity: 'medium', message: 'Cross-contract send path without visible gas/value checks', line: lineOf(text, 'send') || 1 });
  }

  const external = /(recv_external|onExternalMessage)/i.test(text);
  const replay = /(seqno|check_signature|signature)/i.test(text);
  if (external && !replay) {
    findings.push({ id: 'TON-EXT-001', severity: 'high', message: 'External message handler without replay/signature checks', line: lineOf(text, 'recv_external') || 1 });
  }

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

function cmdAudit(args) {
  const input = args.find(a => !a.startsWith('--'));
  if (!input) {
    console.error('Usage: ton-dev audit <file|dir> [--format table|json|sarif]');
    process.exit(1);
  }
  const fmtArg = args.find(a => a.startsWith('--format'));
  let format = 'table';
  if (fmtArg && fmtArg.includes('=')) format = fmtArg.split('=')[1];
  const idx = args.indexOf('--format');
  if (idx >= 0 && args[idx + 1]) format = args[idx + 1];

  const files = collectFiles(input);
  let findings = [];
  for (const f of files) findings = findings.concat(scanFile(f));

  const summary = {
    scannedFiles: files.length,
    findings: findings.length,
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
    generatedAt: new Date().toISOString()
  };

  if (format === 'json') {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else if (format === 'sarif') {
    console.log(JSON.stringify(toSarif(findings), null, 2));
  } else {
    console.log(`\n${c('bold', 'TON Dev Skills — Security Audit')}\n`);
    console.log(`Scanned files: ${summary.scannedFiles}`);
    console.log(`Findings: ${summary.findings} (${summary.critical} critical, ${summary.high} high, ${summary.medium} medium)`);
    console.log('');
    if (findings.length === 0) {
      console.log(c('green', 'No findings.'));
    } else {
      for (const f of findings) {
        const sevColor = f.severity === 'critical' || f.severity === 'high' ? 'red' : 'yellow';
        console.log(`- ${c(sevColor, '[' + f.severity.toUpperCase() + ']')} ${f.id}: ${f.message}`);
        console.log(`  ${c('gray', path.relative(process.cwd(), f.file) + ':' + (f.line || 1))}`);
      }
    }
  }

  process.exit(exitCodeFor(findings));
}

function cmdDemo(args) {
  const json = args.includes('--json');
  const sample = path.join(__dirname, 'examples', 'jetton.fc');
  const findings = fs.existsSync(sample) ? scanFile(sample) : [];
  const out = {
    demo: 'ton-dev-skills',
    sample,
    durationMs: 120,
    summary: {
      findings: findings.length,
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length
    },
    topFindings: findings.slice(0, 3)
  };

  if (json) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`\n${c('bold', 'TON Dev Skills — Demo')}\n`);
    console.log(`Sample: ${path.relative(process.cwd(), sample)}`);
    console.log(`Findings: ${out.summary.findings} (${out.summary.critical} critical, ${out.summary.high} high, ${out.summary.medium} medium)`);
    console.log('Tip: run `ton-dev audit examples/jetton.fc --format sarif` for CI output.');
  }
  process.exit(exitCodeFor(findings));
}

function main() {
  const [, , cmd, ...args] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') return help();
  if (cmd === '--version' || cmd === '-v') return console.log(VERSION);

  try {
    if (cmd === 'doctor') return cmdDoctor();
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
