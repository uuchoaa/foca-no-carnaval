/**
 * Snapshot a single URL - saves sanitized HTML as a fixture file
 * 
 * Usage:
 *   electron scripts/snapshot-url.js <url> [output-path] [--sanitize]
 * 
 * Examples:
 *   electron scripts/snapshot-url.js https://example.com/event/123 sites/pe-no-carnaval/readers/__fixtures__/event-detail.html
 *   electron scripts/snapshot-url.js https://example.com/event/123 --sanitize
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { cleanHTMLDocument } = require('../core/sanitizer');
const { countHTMLTokens, formatTokenSummary } = require('../core/token-counter');

const args = process.argv.slice(2);
const url = args.find(a => a.startsWith('http'));
const sanitize = args.includes('--sanitize');
const outputArg = args.find(a => !a.startsWith('--') && !a.startsWith('http'));

if (!url) {
  console.error('Usage: electron scripts/snapshot-url.js <url> [output-path] [--sanitize]');
  process.exit(1);
}

// Default output: __fixtures__/snapshot-<timestamp>.html in cwd
const defaultOutput = path.join('__fixtures__', `snapshot-${Date.now()}.html`);
const outputPath = outputArg
  ? (path.isAbsolute(outputArg) ? outputArg : path.join(process.cwd(), outputArg))
  : path.join(process.cwd(), defaultOutput);

app.whenReady().then(async () => {
  console.log(`[SNAPSHOT-URL] URL: ${url}`);
  console.log(`[SNAPSHOT-URL] Output: ${outputPath}`);
  console.log(`[SNAPSHOT-URL] Sanitize: ${sanitize}`);

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Log renderer console
  win.webContents.on('console-message', (event, level, message) => {
    const levels = ['LOG', 'WARNING', 'ERROR'];
    console.log(`[RENDERER ${levels[level] || 'LOG'}] ${message}`);
  });

  try {
    console.log(`[SNAPSHOT-URL] Loading ${url}...`);
    await win.loadURL(url);

    // Wait for page to settle
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Grab the full HTML
    const rawHTML = await win.webContents.executeJavaScript(
      'document.documentElement.outerHTML'
    );

    console.log(`[SNAPSHOT-URL] Captured ${rawHTML.length} characters`);

    let finalHTML = rawHTML;

    if (sanitize) {
      finalHTML = cleanHTMLDocument(rawHTML, {
        removeScripts: true,
        removeStyles: true,
        removeComments: true,
        removeSVG: true,
        removeIframes: true,
        removeHidden: true
      });
      console.log(`[SNAPSHOT-URL] Sanitized: ${finalHTML.length} characters`);
    }

    // Token info
    const tokenInfo = countHTMLTokens(finalHTML, { includeMarkup: true });
    console.log(`[SNAPSHOT-URL] ${formatTokenSummary(tokenInfo)}`);

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, finalHTML, 'utf-8');
    console.log(`[SNAPSHOT-URL] Saved to ${outputPath}`);

  } catch (err) {
    console.error(`[SNAPSHOT-URL] Error: ${err.message}`);
  } finally {
    win.close();
    app.quit();
  }
});
