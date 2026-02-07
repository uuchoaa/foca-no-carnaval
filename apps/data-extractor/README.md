# Data Extractor Platform

A pipeline-driven web data extraction platform built with Electron.

## Architecture

This platform allows you to create reusable extractors for different websites. Each site has its own directory under `sites/` with:

- **config.json**: Pipeline definition and metadata
- **content.html**: Sanitized HTML snapshot
- **interactions/**: Scripts that modify page state (clicks, navigation)
- **readers/**: Scripts that extract data from the page
- **writers/**: Scripts that modify page content before extraction

## Directory Structure

```
apps/data-extractor/
├── core/
│   ├── registry.js         # Auto-discovers sites
│   ├── pipeline-runner.js  # Executes pipeline steps
│   ├── snapshot.js         # Captures & sanitizes HTML
│   ├── sanitizer.js        # HTML cleaning utilities
│   └── token-counter.js    # LLM token estimation
├── sites/
│   └── pe-no-carnaval/
│       ├── config.json     # Pipeline definition
│       ├── content.html    # HTML snapshot
│       ├── output.json     # Extracted data
│       ├── interactions/
│       │   └── load-all-events.js
│       └── readers/
│           ├── extract-events.js
│           └── extract-events.test.js
├── main.js                 # Electron main process
└── preload.js             # Pipeline executor
```

## Usage

### Run an extraction

```bash
# Extract data from pe-no-carnaval site
npm run extract

# Extract from a different site
npm run extract -- another-site
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
  // Click buttons, navigate, etc.
  done();
};
```

### 2. Snapshot
Captures current DOM, sanitizes it, saves to `content.html`, and estimates token count for LLM analysis.

### 3. Reader
Extracts data from the page and returns JSON. Never modifies the DOM.

```javascript
module.exports = function(document) {
  return { data: [...] };
};
```

### 4. Writer (future)
Modifies DOM nodes before extraction. Runs before readers.

```javascript
module.exports = function(document) {
  // Modify DOM
};
```

## Creating a New Site Extractor

1. Create directory structure:
```bash
mkdir -p sites/my-site/{interactions,readers,writers}
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
      "additionalSelectors": [".ads", "nav"]
    }
  },
  "pipeline": [
    { "type": "interaction", "module": "interactions/my-interaction.js" },
    { "type": "snapshot" },
    { "type": "reader", "module": "readers/my-reader.js" }
  ]
}
```

3. Create your modules (interactions, readers)

4. Add tests:
```javascript
// sites/my-site/readers/my-reader.test.js
const myReader = require('./my-reader');
// ... tests
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
- Hidden elements
- Custom selectors (configured per site)

## IPC Communication

The platform uses Electron IPC to coordinate between main and renderer processes:

- `pipeline:run-interaction` - Execute interaction
- `pipeline:interaction-done` - Interaction complete
- `pipeline:capture-snapshot` - Request HTML snapshot
- `pipeline:snapshot-data` - Send HTML to main
- `pipeline:run-reader` - Execute reader
- `pipeline:reader-data` - Send extracted data
- `pipeline:run-writer` - Execute writer
- `pipeline:writer-done` - Writer complete
