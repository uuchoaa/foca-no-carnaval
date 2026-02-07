#!/usr/bin/env node

/**
 * Site Structure Generator
 * 
 * Usage: npm run generate:site -- https://example.com/list-of-something
 * 
 * Generates a complete site structure with:
 * - config.json
 * - interactions, readers, writers, test folders
 * - Boilerplate code files
 * - Auto-generated list.html fixture via snapshot
 * - README files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse CLI args
const args = process.argv.slice(2);
const url = args.find(a => a.startsWith('http'));

if (!url) {
  console.error('❌ Error: URL is required');
  console.error('Usage: npm run generate:site -- https://example.com/list');
  process.exit(1);
}

// Infer and sanitize site name from URL
function inferSiteName(url) {
  try {
    const urlObj = new URL(url);
    // Extract hostname and sanitize: penocarnaval.com.br -> penocarnaval-com-br
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const sanitized = hostname.replace(/\./g, '-').replace(/[^a-z0-9-]/gi, '');
    return sanitized;
  } catch (error) {
    console.error('❌ Error: Invalid URL format');
    process.exit(1);
  }
}

const siteName = inferSiteName(url);
const sitePath = path.join(__dirname, '..', 'sites', siteName);

console.log(`\n🚀 Generating site structure...`);
console.log(`   Name: ${siteName}`);
console.log(`   URL: ${url}`);
console.log(`   Path: ${sitePath}\n`);

// Check if site already exists
if (fs.existsSync(sitePath)) {
  console.error(`❌ Error: Site '${siteName}' already exists at ${sitePath}`);
  process.exit(1);
}

// Create directory structure
const dirs = [
  '',
  'interactions',
  'readers',
  'writers',
  'test',
  'test/__fixtures__',
  'test/utils'
];

console.log('📁 Creating directories...');
dirs.forEach(dir => {
  const dirPath = path.join(sitePath, dir);
  fs.mkdirSync(dirPath, { recursive: true });
  console.log(`   ✓ ${dir || '(root)'}`);
});

// File templates
const templates = {
  // Root README.md
  'README.md': `# ${siteName}

Data extraction for ${url}

## Structure

\`\`\`
${siteName}/
├── config.json          - Site configuration and extraction pipeline
├── interactions/        - Browser automation scripts
├── readers/             - HTML parsers and data extractors
├── test/                - Tests and fixtures
└── writers/             - Output formatters (future)
\`\`\`

## config.json

- **name**: Site identifier
- **url**: Source URL for data extraction
- **snapshot.sanitize**: HTML cleaning rules before extraction
- **pipeline**: Sequential steps for data extraction
  - \`interaction\`: Browser automation (load more content, etc.)
  - \`reader\`: Extract data from HTML
  - \`parallel\`: Process multiple URLs concurrently

## Usage

### Run Tests

\`\`\`bash
npm test -- sites/${siteName}/test/extract-list.test.js
\`\`\`

### Generate Detail Fixture

After running extract-list tests to get item URLs:

\`\`\`bash
electron scripts/snapshot-url.js <detail-url> sites/${siteName}/test/__fixtures__/detail.html --sanitize
\`\`\`

Then update \`test/extract-details.test.js\` to load this fixture.

## Customization

1. **Update selectors** in \`readers/extract-list.js\` to match the site's HTML structure
2. **Run tests** to see extracted data
3. **Adjust expectations** in test files based on actual data
4. **Customize detail extraction** in \`readers/extract-details.js\`
`,

  // config.json
  'config.json': JSON.stringify({
    name: siteName,
    url: url,
    description: `Data extraction for ${siteName}`,
    snapshot: {
      sanitize: {
        removeScripts: true,
        removeStyles: true,
        removeComments: true,
        removeSVG: true,
        removeIframes: true,
        removeHidden: true,
        additionalSelectors: []
      }
    },
    pipeline: [
      {
        type: 'interaction',
        module: 'interactions/load-all-items.js'
      },
      {
        type: 'reader',
        module: 'readers/extract-list.js'
      },
      {
        type: 'parallel',
        concurrency: 30,
        module: 'readers/extract-details.js',
        input: 'output.json',
        itemsPath: 'items',
        urlField: 'url',
        output: 'output-with-details.json'
      }
    ],
    metadata: {}
  }, null, 2),

  // interactions/load-all-items.js
  'interactions/load-all-items.js': `/**
 * Interaction: Load all items by clicking "Load More" button
 * This interaction repeatedly clicks the load more button until it's no longer present
 */
function loadAllItems(document, done) {
  console.log('[INTERACTION] Starting load-all-items...');
  
  let clickCount = 0;
  const maxClicks = 50; // Safety limit
  
  function clickLoadMoreButton() {
    // TODO: Update button text to match your site
    // Search for the "Load More" button
    const buttons = document.querySelectorAll('button, a, div[role="button"], span[role="button"]');
    let loadMoreButton = null;

    for (let button of buttons) {
      const text = button.textContent.trim();
      // TODO: Update these text matches for your site
      if (text.includes('Load more') || text.includes('load more') || 
          text.includes('Ver mais') || text.includes('Carregar mais')) {
        // Check if button is visible
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        const isVisible = rect.width > 0 && 
                         rect.height > 0 && 
                         style.display !== 'none' && 
                         style.visibility !== 'hidden' &&
                         style.opacity !== '0';
        
        if (isVisible) {
          loadMoreButton = button;
          break;
        }
      }
    }

    if (loadMoreButton && clickCount < maxClicks) {
      clickCount++;
      console.log(\`[INTERACTION] Found load more button, clicking... (\${clickCount})\`);
      loadMoreButton.click();
      
      // Wait for content to load, then check again
      setTimeout(() => {
        console.log('[INTERACTION] Waiting for new items to load...');
        clickLoadMoreButton();
      }, 3000);
    } else {
      if (clickCount >= maxClicks) {
        console.log(\`[INTERACTION] Reached maximum clicks (\${maxClicks})\`);
      } else {
        console.log('[INTERACTION] Load more button not found or not visible. All items loaded!');
      }
      console.log(\`[INTERACTION] Total clicks: \${clickCount}\`);
      console.log('[INTERACTION] Interaction completed successfully');
      done();
    }
  }
  
  // Start the process after a short delay to ensure page is ready
  setTimeout(() => {
    clickLoadMoreButton();
  }, 2000);
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = loadAllItems;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.loadAllItems = loadAllItems;
}
`,

  // readers/extract-list.js
  'readers/extract-list.js': `/**
 * Extract list items from HTML content
 */
function extractList(content) {
  let document;
  
  // Handle both Document and HTML string
  if (typeof content === 'string') {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      document = parser.parseFromString(content, 'text/html');
    } else {
      throw new Error('DOMParser not available. Please provide a Document object or use jsdom.');
    }
  } else {
    document = content;
  }

  const items = [];
  
  // TODO: Update these selectors to match your site's HTML structure
  // Find all item containers
  const containers = document.querySelectorAll('.data-container, .items-list, .results');
  
  containers.forEach(container => {
    // TODO: Update selector for individual items
    const itemElements = container.querySelectorAll('li, .item, article');
    
    itemElements.forEach(el => {
      try {
        // TODO: Extract actual fields from your site
        // This is a generic template - customize based on your HTML structure
        
        // Extract link/URL
        const link = el.querySelector('a');
        const url = link ? link.getAttribute('href') || '' : '';
        
        // Extract title
        const titleEl = el.querySelector('.title, h2, h3, .name');
        const title = titleEl ? titleEl.textContent.replace(/\\s+/g, ' ').trim() : '';
        
        // Extract description (if available)
        const descEl = el.querySelector('.description, .desc, p');
        const description = descEl ? descEl.textContent.replace(/\\s+/g, ' ').trim() : '';
        
        // Generate ID from URL if possible
        let id = '';
        if (url) {
          const urlMatch = url.match(/\\/([^\\/]+)\\/?$/);
          if (urlMatch) {
            id = urlMatch[1];
          }
        }
        
        // Skip if no essential data
        if (!title) return;
        
        // Build item object
        const item = {
          id: id || \`item-\${items.length + 1}\`,
          title: title,
          description: description,
          url: url
        };
        
        items.push(item);
      } catch (error) {
        console.error('Error parsing item:', error);
      }
    });
  });
  
  return {
    items: items
  };
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractList;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.extractList = extractList;
}
`,

  // readers/extract-details.js
  'readers/extract-details.js': `/**
 * Extract detailed information from an individual item page
 * This reader is called for each item URL in parallel
 * 
 * @param {Document} document - The item page DOM
 * @param {Object} item - The original item data from output.json
 * @returns {Object} Detailed item information
 */
function extractDetails(document, item) {
  console.log(\`[DETAIL-READER] Processing item: \${item.title} (\${item.id})\`);
  console.log(\`[DETAIL-READER] URL: \${item.url}\`);
  console.log(\`[DETAIL-READER] Page title: \${document.title}\`);
  
  // TODO: Extract actual detail fields from the page
  // This is a placeholder - customize based on your HTML structure
  
  return {
    pageTitle: document.title,
    contentLength: document.body.innerHTML.length,
    extractedAt: new Date().toISOString()
  };
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractDetails;
}

// Export for browser/window
if (typeof window !== 'undefined') {
  window.extractDetails = extractDetails;
}
`,

  // test/extract-list.test.js
  'test/extract-list.test.js': `const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const extractList = require('../readers/extract-list');

describe('extractList', () => {
  let document;
  
  beforeAll(() => {
    const htmlPath = path.join(__dirname, '__fixtures__', 'list.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  test('should extract items from HTML', () => {
    const result = extractList(document);
    
    expect(result).toHaveProperty('items');
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
  });

  test('should extract item fields', () => {
    const result = extractList(document);
    const firstItem = result.items[0];
    
    // TODO: Update these expectations based on actual extracted data
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('url');
    
    // Check types
    expect(typeof firstItem.id).toBe('string');
    expect(typeof firstItem.title).toBe('string');
    expect(typeof firstItem.url).toBe('string');
  });

  test('all items should have required fields', () => {
    const result = extractList(document);
    
    result.items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
    });
  });

  test('should extract URLs correctly', () => {
    const result = extractList(document);
    
    const itemsWithUrl = result.items.filter(item => item.url && item.url.length > 0);
    expect(itemsWithUrl.length).toBeGreaterThan(0);
  });
});
`,

  // test/extract-details.test.js
  'test/extract-details.test.js': `const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const extractDetails = require('../readers/extract-details');

describe('extractDetails', () => {
  let document;
  
  beforeAll(() => {
    const htmlPath = path.join(__dirname, '__fixtures__', 'detail.html');
    
    // Skip tests if fixture doesn't exist yet
    if (!fs.existsSync(htmlPath)) {
      console.log('⚠️  detail.html fixture not found. Generate it first:');
      console.log('   electron scripts/snapshot-url.js <detail-url> sites/${siteName}/test/__fixtures__/detail.html --sanitize');
      return;
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  test('should extract detail fields', () => {
    if (!document) {
      console.log('Skipping test - no fixture');
      return;
    }
    
    const mockItem = {
      id: 'test-item',
      title: 'Test Item',
      url: 'https://example.com/item/test'
    };
    
    const result = extractDetails(document, mockItem);
    
    // TODO: Update these expectations based on actual extracted data
    expect(result).toHaveProperty('pageTitle');
    expect(typeof result.pageTitle).toBe('string');
  });
});
`,

  // README files
  'interactions/README.md': `# Interactions

Browser automation scripts for navigating and interacting with the site.

## Files

- \`load-all-items.js\` - Loads all items by scrolling/clicking through paginated content
`,

  'readers/README.md': `# Readers

HTML parsers that extract structured data from page content.

## Files

- \`extract-list.js\` - Extracts item list from listing page
- \`extract-details.js\` - Extracts detailed information from individual item pages
`,

  'test/README.md': `# Tests

Unit tests for data extraction functions.

## Structure

- \`__fixtures__/\` - HTML snapshots for testing
- \`utils/\` - Test utilities
- \`*.test.js\` - Test files matching their corresponding reader functions

## Running Tests

\`\`\`bash
npm test -- sites/${siteName}/test/extract-list.test.js
npm test -- sites/${siteName}/test/extract-details.test.js
\`\`\`
`,

  'test/__fixtures__/README.md': `# Test Fixtures

HTML snapshots used for testing extractors.

## Generating Fixtures

### List Page (Already Generated)

The \`list.html\` fixture was automatically generated during site setup.

### Detail Page

To generate a detail page fixture:

1. Run the list extraction test to get item URLs
2. Pick a detail URL from the results
3. Generate the fixture:

\`\`\`bash
electron scripts/snapshot-url.js <detail-url> sites/${siteName}/test/__fixtures__/detail.html --sanitize
\`\`\`

4. Update \`test/extract-details.test.js\` if needed
`,

  'test/utils/README.md': `# Test Utils

Shared test utilities and helpers.

Currently empty - reserved for future test helper functions.
`,

  'writers/README.md': `# Writers

Output formatters that write extracted data to files.

Currently empty - reserved for JSON/CSV writers and data transformers.
`
};

// Write all files
console.log('\n📝 Creating files...');
let fileCount = 0;
Object.entries(templates).forEach(([filename, content]) => {
  const filePath = path.join(sitePath, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`   ✓ ${filename}`);
  fileCount++;
});

// Auto-generate list.html fixture
console.log('\n📸 Generating list.html fixture...');
console.log('   This may take a few seconds...');
try {
  const fixtureOutput = path.join(sitePath, 'test', '__fixtures__', 'list.html');
  const snapshotScript = path.join(__dirname, 'snapshot-url.js');
  const snapshotCmd = `npx electron "${snapshotScript}" "${url}" "${fixtureOutput}" --sanitize`;
  
  execSync(snapshotCmd, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('   ✓ Fixture generated successfully');
  fileCount++;
} catch (error) {
  console.error('   ⚠️  Could not auto-generate fixture');
  console.error('   You can generate it manually with:');
  console.error(`   npm run snapshot:url -- "${url}" sites/${siteName}/test/__fixtures__/list.html --sanitize`);
}

// Success message
console.log(`\n✅ Site structure created successfully!\n`);
console.log(`📊 Summary:`);
console.log(`   Name: ${siteName}`);
console.log(`   URL: ${url}`);
console.log(`   Files: ${fileCount}`);
console.log(`   Path: sites/${siteName}/\n`);

console.log(`📋 Next steps:\n`);
console.log(`1. Review sites/${siteName}/README.md for overview`);
console.log(`2. Customize selectors in readers/extract-list.js`);
console.log(`3. Run tests: npm test -- sites/${siteName}/test/extract-list`);
console.log(`4. Adjust test expectations based on actual data`);
console.log(`5. Generate detail fixture (see README.md)`);
console.log(`6. Customize readers/extract-details.js\n`);
