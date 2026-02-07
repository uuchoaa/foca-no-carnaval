# carnaval-recife-pe-gov-br

Data extraction for https://carnaval.recife.pe.gov.br/

## Structure

```
carnaval-recife-pe-gov-br/
├── config.json          - Site configuration and extraction pipeline
├── interactions/        - Browser automation scripts
├── readers/             - HTML parsers and data extractors
├── test/                - Tests and fixtures
└── writers/             - Output formatters (future)
```

## config.json

- **name**: Site identifier
- **url**: Source URL for data extraction
- **snapshot.sanitize**: HTML cleaning rules before extraction
- **pipeline**: Sequential steps for data extraction
  - `interaction`: Browser automation (load more content, etc.)
  - `reader`: Extract data from HTML
  - `parallel`: Process multiple URLs concurrently

## Usage

### Run Tests

```bash
npm test -- sites/carnaval-recife-pe-gov-br/test/extract-list.test.js
```

### Generate Detail Fixture

After running extract-list tests to get item URLs:

```bash
electron scripts/snapshot-url.js <detail-url> sites/carnaval-recife-pe-gov-br/test/__fixtures__/detail.html --sanitize
```

Then update `test/extract-details.test.js` to load this fixture.

## Customization

1. **Update selectors** in `readers/extract-list.js` to match the site's HTML structure
2. **Run tests** to see extracted data
3. **Adjust expectations** in test files based on actual data
4. **Customize detail extraction** in `readers/extract-details.js`
