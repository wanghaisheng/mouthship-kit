const { spawn } = require('child_process');
const path = require('path');

console.log('Starting development server...');

// Start Next.js development server
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

nextDev.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});

nextDev.on('error', (err) => {
  console.error('Failed to start development server:', err);
});
