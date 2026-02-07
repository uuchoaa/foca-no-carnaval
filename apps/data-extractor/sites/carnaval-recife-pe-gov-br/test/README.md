# Tests

Unit tests for data extraction functions.

## Structure

- `__fixtures__/` - HTML snapshots for testing
- `utils/` - Test utilities
- `*.test.js` - Test files matching their corresponding reader functions

## Running Tests

```bash
npm test -- sites/carnaval-recife-pe-gov-br/test/extract-list.test.js
npm test -- sites/carnaval-recife-pe-gov-br/test/extract-details.test.js
```
