import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();

console.log('Connecting to VPS...');

conn.on('ready', () => {
  console.log('Client :: ready');
  
  // The commands we want to execute on the VPS
  const commands = [
    'cd /root/cifra || cd ~/cifra || cd /var/www/cifra', // We need to figure out where the project is on the VPS. Assuming ~/cifra or similar based on previous runs.
    'git pull origin main',
    'docker compose build cifra-calculadora',
    'docker compose up -d'
  ];
  
  // Join them
  const cmd = commands.join(' && ');
  console.log(`Executing: ${cmd}`);

  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: 'cifrainssdeobras.com.br',
  port: 22,
  username: 'vinicius',
  password: 'D1s0rd5r',
  readyTimeout: 60000
});
