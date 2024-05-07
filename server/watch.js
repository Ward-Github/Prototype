import chokidar from 'chokidar';
import { spawn } from 'child_process';

let process = null;

const restart = () => {
  if (process) {
    process.kill();
  }

  process = spawn('bun', ['server.mjs'], { stdio: 'inherit' });
};

chokidar.watch('./*.mjs').on('change', restart);

restart();