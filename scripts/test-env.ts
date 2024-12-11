import * as dotenv from 'dotenv';
import { join } from 'path';
import * as fs from 'fs';

// Load the .env.local file
dotenv.config({ path: join(process.cwd(), '.env.local') });

console.log('POSTGRES_URL:', process.env.POSTGRES_URL);

// Print contents of .env.local (with sensitive info redacted)
const envContent = fs.readFileSync(join(process.cwd(), '.env.local'), 'utf8');
console.log('Contents of .env.local:');
console.log(envContent.replace(/=.*/g, '=<redacted>'));