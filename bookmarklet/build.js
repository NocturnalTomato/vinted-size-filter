// Builds the mobile bookmarklet files from extension/content.js + extension/content.css.
// Run with: node bookmarklet/build.js
// Regenerate any time either source file changes, then push - the loader bookmarklet
// itself never needs to change since it just fetches inline.js fresh each time.

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const GITHUB_OWNER = 'NocturnalTomato';
const GITHUB_REPO = 'vinted-size-filter';
const GITHUB_BRANCH = 'main';

const root = path.join(__dirname, '..');
const jsSource = fs.readFileSync(path.join(root, 'extension', 'content.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'extension', 'content.css'), 'utf8');

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const escapedCss = minifyCss(cssSource)
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const styleInjection = `(function(){var s=document.createElement('style');s.textContent=\`${escapedCss}\`;document.head.appendChild(s);})();`;

async function build() {
  const combinedSource = `${styleInjection}\n${jsSource}`;
  const minified = await minify(combinedSource, { compress: true, mangle: true });
  if (minified.error) throw minified.error;

  const inlineJs = minified.code;
  fs.writeFileSync(path.join(__dirname, 'inline.js'), inlineJs, 'utf8');

  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/bookmarklet/inline.js`;
  const loader = `javascript:(function(){var d=document,s=d.createElement('script');s.src='${rawUrl}?t='+Date.now();d.body.appendChild(s);})();`;
  fs.writeFileSync(path.join(__dirname, 'loader.txt'), loader, 'utf8');

  console.log(`inline.js: ${inlineJs.length} chars`);
  console.log(`loader.txt: ${loader.length} chars`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
