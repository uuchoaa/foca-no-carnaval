const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const extractDetails = require('../readers/extract-details');

describe('extractDetails', () => {
  let document;
  
  beforeAll(() => {
    const htmlPath = path.join(__dirname, '__fixtures__', 'details.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  test('should extract only NEW detail fields', () => {
    const mockItem = {
      id: '26866',
      title: 'PLATAFORMA RECIFE - CARNAVAL DE TODAS AS DANÇAS',
      url: 'https://carnaval.recife.pe.gov.br/?attraction_id=26866'
    };
    
    const result = extractDetails(document, mockItem);
    
    // Should only have NEW fields
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('address');
    
    // Should NOT repeat existing fields
    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('title');
    expect(result).not.toHaveProperty('date');
    expect(result).not.toHaveProperty('time');
    expect(result).not.toHaveProperty('stage');
    expect(result).not.toHaveProperty('type');
    expect(result).not.toHaveProperty('url');
  });

  test('should extract correct values', () => {
    const mockItem = {
      id: '26866',
      title: 'PLATAFORMA RECIFE - CARNAVAL DE TODAS AS DANÇAS',
      url: 'https://carnaval.recife.pe.gov.br/?attraction_id=26866'
    };
    
    const result = extractDetails(document, mockItem);
    
    expect(result.description).toContain('Plataforma Recife');
    expect(result.address).toBe('Rua São José, S/N. Esquina Com A Rua Do Observatório. Bairro Do Recife');
  });

  test('should have correct field types', () => {
    const mockItem = {
      id: '26866',
      title: 'PLATAFORMA RECIFE - CARNAVAL DE TODAS AS DANÇAS',
      url: 'https://carnaval.recife.pe.gov.br/?attraction_id=26866'
    };
    
    const result = extractDetails(document, mockItem);
    
    expect(typeof result.description).toBe('string');
    expect(typeof result.address).toBe('string');
  });
});
