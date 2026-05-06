import { spawn } from 'child_process';

console.log("Starting DukanDost Pro via Hostinger Entry File...");

const child = spawn('npm', ['start'], { stdio: 'inherit', shell: true });

child.on('error', (err) => {
  console.error('Failed to start subprocess:', err);
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  process.exit(code);
});
