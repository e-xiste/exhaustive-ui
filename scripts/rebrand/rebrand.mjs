#!/usr/bin/env node
/**
 * Applies the ExhaustiveUI rebranding rules.
 *
 *   node scripts/rebrand/rebrand.mjs <file...>     rewrite the given files in place
 *   node scripts/rebrand/rebrand.mjs --all --force  rewrite every git-tracked text file (initial rebrand only:
 *                                                   the rebranded tree legitimately mentions Optimus UI as upstream)
 *   node scripts/rebrand/rebrand.mjs --stdin        rewrite stdin to stdout (e.g. a `git format-patch` file)
 *
 * See scripts/rebrand/README.md for how this is used to port upstream commits.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { rebrand } from './rules.mjs';

const SKIP = [/^pnpm-lock\.yaml$/, /\.(png|jpg|jpeg|gif|ico|woff2?|ttf|eot|zip)$/i, /^scripts\/rebrand\//];

const args = process.argv.slice(2);

if (args.includes('--stdin')) {
    const input = readFileSync(0, 'utf8');
    process.stdout.write(rebrand(input));
    process.exit(0);
}

if (args.includes('--all') && !args.includes('--force')) {
    console.error('rebrand: --all rewrites the whole tree and is meant for the initial rebrand only; pass --force if you really mean it.');
    process.exit(1);
}

const files = args.includes('--all')
    ? execSync('git ls-files -z', { encoding: 'utf8' }).split('\0').filter(Boolean)
    : args;

let changed = 0;
for (const file of files) {
    if (SKIP.some((re) => re.test(file))) continue;
    let text;
    try {
        text = readFileSync(file, 'utf8');
    } catch {
        continue;
    }
    if (text.includes('\0')) continue;
    const out = rebrand(text);
    if (out !== text) {
        writeFileSync(file, out);
        changed++;
    }
}
console.log(`rebrand: ${changed} file(s) rewritten`);
