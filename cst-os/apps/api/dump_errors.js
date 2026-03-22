const cp = require('child_process');
const fs = require('fs');
try {
  console.log('Running tsc...');
  cp.execSync('npx tsc --noEmit', { stdio: 'pipe' });
  fs.writeFileSync('build_errs.txt', 'Success');
} catch (e) {
  console.log('tsc failed, writing output...');
  fs.writeFileSync('build_errs.txt', e.stdout ? e.stdout.toString() : e.message);
}
