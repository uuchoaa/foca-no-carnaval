# Site Generator - Usage Guide

The site generator creates a complete extraction site structure from a URL.

## Usage

```bash
npm run generate:site -- https://example.com/list-page
```

## What Gets Generated

### Directory Structure (13 files + auto-generated fixture)

```
sites/{site-name}/
├── README.md                      - Site overview and documentation
├── config.json                    - Configuration with pipeline
├── interactions/
│   ├── README.md
│   └── load-all-items.js         - Browser automation boilerplate
├── readers/
│   ├── README.md
│   ├── extract-list.js           - List extraction boilerplate
│   └── extract-details.js        - Detail extraction boilerplate
├── test/
│   ├── README.md
│   ├── extract-list.test.js      - Runnable test scaffold
│   ├── extract-details.test.js   - Runnable test scaffold
│   ├── __fixtures__/
│   │   ├── README.md
│   │   └── list.html             - AUTO-GENERATED from URL
│   └── utils/
│       └── README.md
└── writers/
    └── README.md
```

## Features

1. **Auto-infers site name** from URL domain
   - `penocarnaval.com.br` → `penocarnaval-com-br`
   - `example.com` → `example-com`

2. **Auto-generates list.html fixture** by fetching and sanitizing the provided URL

3. **Working boilerplate code** based on pe-no-carnaval structure
   - Generic selectors with TODO markers
   - Complete function structure
   - Module exports for both Node.js and browser

4. **Runnable test scaffolds**
   - Tests work immediately (even if assertions need adjustment)
   - Placeholder expectations
   - Fixture loading pattern

5. **Complete documentation**
   - Root README with config.json explanation
   - Folder-specific READMEs
   - Instructions for generating detail fixtures

## User Workflow After Generation

1. Run tests to see what's extracted:
   ```bash
   npm test -- sites/{site-name}/test/extract-list
   ```

2. Customize selectors in `readers/extract-list.js` to match site HTML

3. Adjust test expectations based on actual extracted data

4. Generate detail fixture manually (documented in README.md)

5. Customize `readers/extract-details.js`

## Example

```bash
# Generate site
npm run generate:site -- https://penocarnaval.com.br/programacao/

# Output:
# ✓ Created site structure: penocarnaval-com-br
# ✓ Generated 14 files
# ✓ Auto-generated fixture: test/__fixtures__/list.html

# Run tests
npm test -- sites/penocarnaval-com-br/test/extract-list
```

## Notes

- Site name is sanitized (only alphanumeric and hyphens)
- Fixture generation uses `npx electron` to run snapshot-url.js
- If fixture generation fails, instructions are provided for manual generation
- All boilerplate includes TODO comments for site-specific customization
