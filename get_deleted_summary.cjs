const { execSync } = require('child_process');

try {
  const output = execSync('git diff-tree --no-commit-id --name-status -r 8fb124514', {
    cwd: 'C:/Users/aaaho/.gemini/antigravity-ide/scratch/jason-coleman-network',
    maxBuffer: 100 * 1024 * 1024,
    encoding: 'utf8'
  });

  const lines = output.split('\n');
  const deleted = [];
  const added = [];
  const modified = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const [status, path] = line.split('\t');
    if (status === 'D') deleted.push(path);
    else if (status === 'A') added.push(path);
    else if (status === 'M') modified.push(path);
  }

  console.log(`Commit 8fb124514 diff summary:`);
  console.log(`Deleted files: ${deleted.length}`);
  console.log(`Added files: ${added.length}`);
  console.log(`Modified files: ${modified.length}`);

  const deletedPrefixes = {};
  for (const d of deleted) {
    const parts = d.split('/');
    const folder = parts[1] || 'root';
    const prefix = folder.split('-')[0] || folder;
    deletedPrefixes[prefix] = (deletedPrefixes[prefix] || 0) + 1;
  }
  console.log('Deleted file count by folder prefix:', deletedPrefixes);

  console.log('Sample deleted paths (first 10):');
  for (let i = 0; i < Math.min(10, deleted.length); i++) {
    console.log(' ', deleted[i]);
  }
} catch (err) {
  console.error('Error:', err);
}
