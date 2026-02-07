# Data Extractor Platform

A pipeline-driven web data extraction platform built with Electron.

## Architecture

This platform allows you to create reusable extractors for different websites. Each site has its own directory under `sites/` with:

- **config.json**: Pipeline definition and metadata
- **content.html**: Sanitized HTML snapshot (generated)
- **output.json**: Extracted data (generated)
- **interactions/**: Scripts that modify page state (clicks, navigation)
- **readers/**: Scripts that extract data from the page
- **writers/**: Scripts that modify page content before extraction (not implemented)
- **test/**: Test files with fixtures and utilities

## Directory Structure

```
apps/data-extractor/
├── core/
│   ├── registry.js         # Auto-discovers sites
│   ├── pipeline-runner.js  # Executes pipeline steps
│   ├── snapshot.js         # Captures & sanitizes HTML
│   ├── sanitizer.js        # HTML cleaning utilities
│   ├── token-counter.js    # LLM token estimation
│   └── browser-pool.js     # Manages parallel extraction
├── sites/
│   ├── pe-no-carnaval/
│   │   ├── config.json
│   │   ├── content.html
│   │   ├── output.json
│   │   ├── interactions/
│   │   ├── readers/
│   │   ├── writers/
│   │   └── test/
│   └── carnaval-recife-pe-gov-br/
│       ├── config.json
│       ├── readers/
│       ├── interactions/
│       └── test/
├── main.js                 # Electron main process
├── preload.js              # Pipeline executor
└── log-preload.js          # Log window preload
```

## Usage

### Run an extraction

```bash
# Extract from default site (pe-no-carnaval)
npm run extract

# Extract from specific site
npm run extract -- carnaval-recife-pe-gov-br

# Run in headless mode
npm run extract:headless

# Run specific site headless
npm run extract:headless -- pe-no-carnaval
```

### Run tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## Pipeline Steps

Each site's `config.json` defines a pipeline with these step types:

### 1. Interaction
Modifies the page state (clicks, scrolls, waits). Must call `done()` when finished.

```javascript
module.exports = function(document, done) {
  const button = document.querySelector('.load-more');
  if (button) {
    button.click();
    setTimeout(() => done(), 1000);
  } else {
    done();
  }
};
```

### 2. Snapshot
Captures current DOM, sanitizes it, saves to `content.html`, and estimates token count for LLM analysis.

```json
{ "type": "snapshot" }
```

### 3. Reader
Extracts data from the page and returns JSON. Never modifies the DOM. Output saved to `output.json`.

```javascript
module.exports = function(document) {
  const events = Array.from(document.querySelectorAll('.event')).map(el => ({
    title: el.querySelector('h2').textContent,
    url: el.querySelector('a').href
  }));
  return { events };
};
```

```json
{ "type": "reader", "module": "readers/extract-events.js" }
```

### 4. Parallel
Runs a reader against multiple URLs concurrently using a browser pool.

```json
{
  "type": "parallel",
  "concurrency": 30,
  "module": "readers/extract-event-details.js",
  "input": "output.json",
  "itemsPath": "events",
  "urlField": "url",
  "output": "output-with-details.json"
}
```

Reads items from `output.json`, extracts URL from each item at `events[].url`, runs the reader against each URL in parallel (max 30 concurrent), then merges results into `output-with-details.json`.

### 5. Writer (not implemented)
Would modify DOM nodes before extraction.

```javascript
module.exports = function(document) {
  // Modify DOM directly
};
```

## Creating a New Site Extractor

1. Create directory structure:
```bash
mkdir -p sites/my-site/{interactions,readers,writers,test}
```

2. Create `config.json`:
```json
{
  "name": "my-site",
  "url": "https://example.com",
  "description": "Description",
  "snapshot": {
    "sanitize": {
      "removeScripts": true,
      "removeStyles": true,
      "removeComments": true,
      "removeSVG": true,
      "removeIframes": true,
      "removeHidden": true,
      "additionalSelectors": [".ads", "nav"]
    }
  },
  "pipeline": [
    { "type": "interaction", "module": "interactions/load-page.js" },
    { "type": "reader", "module": "readers/extract-data.js" }
  ],
  "metadata": {}
}
```

3. Create your modules:

**interactions/load-page.js:**
```javascript
module.exports = function(document, done) {
  // Interact with page if needed
  done();
};
```

**readers/extract-data.js:**
```javascript
module.exports = function(document) {
  return { data: [] };
};
```

4. Add tests:
```javascript
// test/extract-data.test.js
const extractData = require('../readers/extract-data');
const { loadFixture } = require('./utils/load-fixture');

describe('extract-data', () => {
  test('extracts data', () => {
    const doc = loadFixture('page.html');
    const result = extractData(doc);
    expect(result.data).toBeDefined();
  });
});
```

5. Run extraction:
```bash
npm run extract -- my-site
```

## Token Estimation

The snapshot step estimates LLM token count for the sanitized HTML. This helps estimate the cost of using LLMs to analyze or generate extraction code.

Metadata is saved to `config.json`:
```json
{
  "metadata": {
    "tokens": 1250,
    "characters": 5000,
    "snapshotDate": "2026-02-07T20:00:00Z",
    "estimatedCost": {
      "gpt4": 0.0375,
      "gpt35": 0.0019,
      "claude": 0.01
    }
  }
}
```

## HTML Sanitization

Snapshots are sanitized to reduce token count by removing:
- Scripts and styles
- Comments
- SVGs and iframes
- Hidden elements (`display: none`, `visibility: hidden`)
- Custom selectors (configured per site in `additionalSelectors`)

Uses JSDOM for DOM manipulation in Node.js environment.

## Testing

Each site has a `test/` directory:
- **`__fixtures__/`**: Saved HTML snapshots for testing
- **`utils/`**: Test utilities (e.g., `load-fixture.js`)
- Test files for readers and interactions

```bash
npm test                # All tests
npm run test:watch      # Watch mode
```

## IPC Communication

The platform uses Electron IPC to coordinate between main and renderer processes:

**Interaction:**
- `pipeline:run-interaction` - Execute interaction
- `pipeline:interaction-done` - Interaction complete

**Snapshot:**
- `pipeline:capture-snapshot` - Request HTML snapshot
- `pipeline:snapshot-data` - Send HTML to main
- `pipeline:snapshot-done` - Processing complete

**Reader:**
- `pipeline:run-reader` - Execute reader
- `pipeline:reader-data` - Send extracted data
- `pipeline:reader-done` - Completion signal

**Logging:**
- `pipeline:log` - Forward console logs to log window

## Architecture Details

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## LLM-Assisted Workflow

1. **Generate site scaffold:**
   ```bash
   npm run generate:site -- https://carnaval.recife.pe.gov.br/
   ```
   Creates initial snapshot, tests, and implementation boilerplate for the list view.

2. **LLM-assisted implementation:**
   1. Analyze the generated snapshot to identify data structure
   2. Model the data as JSON in memory
   3. Update tests based on the JSON model
   4. Implement extraction logic (without modifying tests or fixtures)
