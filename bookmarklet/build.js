// Builds a self-contained bookmarklet from extension/content.js + extension/content.css.
// Run with: node bookmarklet/build.js
// Regenerate this any time either of those source files changes.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsSource = fs.readFileSync(path.join(root, 'extension', 'content.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'extension', 'content.css'), 'utf8');

function stripCommentLines(src) {
  return src
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
}

function toSingleLine(src) {
  return src.replace(/\s+/g, ' ').trim();
}

const escapedCss = cssSource
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const styleInjection = `(function(){var s=document.createElement('style');s.textContent=\`${escapedCss}\`;document.head.appendChild(s);})();`;

const cleanedJs = toSingleLine(stripCommentLines(jsSource));

const combined = `${styleInjection}${cleanedJs}`;
const bookmarklet = `javascript:${combined}`;

const outDir = __dirname;
fs.writeFileSync(path.join(outDir, 'bookmarklet.txt'), bookmarklet, 'utf8');

console.log(`Bookmarklet written to bookmarklet/bookmarklet.txt (${bookmarklet.length} chars)`);
