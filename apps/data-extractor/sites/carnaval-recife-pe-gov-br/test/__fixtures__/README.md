# Test Fixtures

HTML snapshots used for testing extractors.

## Generating Fixtures

### List Page (Already Generated)

The `list.html` fixture was automatically generated during site setup.

### Detail Page

To generate a detail page fixture:

1. Run the list extraction test to get item URLs
2. Pick a detail URL from the results
3. Generate the fixture:

```bash
electron scripts/snapshot-url.js <detail-url> sites/carnaval-recife-pe-gov-br/test/__fixtures__/detail.html --sanitize
```

4. Update `test/extract-details.test.js` if needed
