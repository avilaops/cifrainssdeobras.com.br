import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export type CertificateContext = {
  homeDir: string;
  nssdbDir: string;
  cleanup: () => void;
};

/**
 * Creates a temporary nssdb, imports the given PFX certificate, 
 * and returns the HOME directory that should be passed to Puppeteer.
 */
export function createCertificateContext(pfxBuffer: Buffer, password: string): CertificateContext {
  const sessionId = crypto.randomUUID();
  const homeDir = path.join(os.tmpdir(), `ecac_session_${sessionId}`);
  const nssdbDir = path.join(homeDir, '.pki', 'nssdb');
  const pfxPath = path.join(homeDir, 'cert.pfx');

  // Create directories
  mkdirSync(nssdbDir, { recursive: true });

  // Write PFX to disk temporarily
  writeFileSync(pfxPath, pfxBuffer);

  try {
    // Initialize nssdb
    execSync(`certutil -d sql:${nssdbDir} -N --empty-password`);
    
    // Import the PFX
    // pk12util requires passing the password. We can pass it via command line
    execSync(`pk12util -d sql:${nssdbDir} -i ${pfxPath} -W "${password}" -K ""`);

    return {
      homeDir,
      nssdbDir,
      cleanup: () => {
        try {
          rmSync(homeDir, { recursive: true, force: true });
        } catch (e) {
          console.error(`Failed to cleanup session directory: ${homeDir}`, e);
        }
      }
    };
  } catch (error) {
    // Cleanup on failure
    rmSync(homeDir, { recursive: true, force: true });
    throw new Error(`Failed to configure certificate: ${error instanceof Error ? error.message : String(error)}`);
  }
}
