import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DB_NAME = process.env.DB_NAME || 'dukandost_pro';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

console.log(`Starting backup of ${DB_NAME} to ${backupPath}...`);

const command = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`Backup notice: ${stderr}`);
  }
  console.log(`Backup completed successfully at ${backupPath}`);
  
  // Optional: Clean up old backups (keep last 7 days)
  // ...
});
