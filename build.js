import * as esbuild from 'esbuild';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./Backend/package.json', 'utf-8'));
const externals = Object.keys(pkg.dependencies || {});

esbuild.build({
  entryPoints: ['./Backend/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: './Backend/hostinger-entry.js',
  external: [...externals, 'path', 'url', 'child_process', 'fs', 'crypto'],
  logLevel: 'info',
}).catch(() => process.exit(1));
