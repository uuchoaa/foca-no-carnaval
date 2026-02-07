const fs = require('fs');
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
      console.log('   electron scripts/snapshot-url.js <detail-url> sites/carnaval-recife-pe-gov-br/test/__fixtures__/detail.html --sanitize');
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
