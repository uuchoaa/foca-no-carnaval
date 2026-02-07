const fs = require('fs');
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

  test('should extract correct number of items', () => {
    const result = extractList(document);
    
    // Based on list.html fixture - contains 15 events visible
    expect(result.items.length).toBe(15);
  });

  test('should extract first item correctly', () => {
    const result = extractList(document);
    const firstItem = result.items[0];
    
    expect(firstItem.id).toBe('26866');
    expect(firstItem.title).toBe('PLATAFORMA RECIFE - CARNAVAL DE TODAS AS DANÇAS');
    expect(firstItem.date).toBe('08/02/2026');
    expect(firstItem.dayOfWeek).toBe('Domingo');
    expect(firstItem.time).toBe('15:00');
    expect(firstItem.stage).toBe('Praça Do Arsenal');
    expect(firstItem.stageId).toBe('812');
    expect(firstItem.type).toBe('Prévias');
    expect(firstItem.isStreet).toBe(false);
    expect(firstItem.url).toContain('carnaval.recife.pe.gov.br');
    expect(firstItem.url).toContain('attraction_id=26866');
  });

  test('should extract item fields', () => {
    const result = extractList(document);
    const firstItem = result.items[0];
    
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('url');
    expect(firstItem).toHaveProperty('date');
    expect(firstItem).toHaveProperty('dayOfWeek');
    expect(firstItem).toHaveProperty('time');
    expect(firstItem).toHaveProperty('stage');
    expect(firstItem).toHaveProperty('stageId');
    expect(firstItem).toHaveProperty('type');
    expect(firstItem).toHaveProperty('isStreet');
    
    // Check types
    expect(typeof firstItem.id).toBe('string');
    expect(typeof firstItem.title).toBe('string');
    expect(typeof firstItem.url).toBe('string');
    expect(typeof firstItem.date).toBe('string');
    expect(typeof firstItem.dayOfWeek).toBe('string');
    expect(typeof firstItem.time).toBe('string');
    expect(typeof firstItem.stage).toBe('string');
    expect(typeof firstItem.stageId).toBe('string');
    expect(typeof firstItem.type).toBe('string');
    expect(typeof firstItem.isStreet).toBe('boolean');
  });

  test('all items should have required fields', () => {
    const result = extractList(document);
    
    result.items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('dayOfWeek');
      expect(item).toHaveProperty('time');
      expect(item).toHaveProperty('stage');
      expect(item).toHaveProperty('stageId');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('isStreet');
    });
  });

  test('should extract URLs correctly', () => {
    const result = extractList(document);
    
    const itemsWithUrl = result.items.filter(item => item.url && item.url.length > 0);
    expect(itemsWithUrl.length).toBeGreaterThan(0);
    
    // All URLs should contain the base domain
    result.items.forEach(item => {
      expect(item.url).toContain('carnaval.recife.pe.gov.br');
      expect(item.url).toContain('attraction_id=');
    });
  });

  test('should parse dates correctly', () => {
    const result = extractList(document);
    
    result.items.forEach(item => {
      expect(item.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  test('should extract last item correctly', () => {
    const result = extractList(document);
    const lastItem = result.items[result.items.length - 1];
    
    expect(lastItem.id).toBe('26885');
    expect(lastItem.title).toBe('SUBIDA DO GALO');
    expect(lastItem.date).toBe('11/02/2026');
    expect(lastItem.dayOfWeek).toBe('Quarta');
    expect(lastItem.time).toBe('19:00');
    expect(lastItem.stage).toBe('Ponte Duarte Coelho');
    expect(lastItem.stageId).toBe('827');
    expect(lastItem.type).toBe('Prévias');
  });

  test('should identify street events correctly', () => {
    const result = extractList(document);
    
    const streetEvents = result.items.filter(item => item.isStreet);
    expect(streetEvents.length).toBeGreaterThan(0);
    
    // Event 27329 should be a street event
    const streetEvent = result.items.find(item => item.id === '27329');
    expect(streetEvent).toBeDefined();
    expect(streetEvent.isStreet).toBe(true);
  });

  test('should extract different event types', () => {
    const result = extractList(document);
    
    const types = [...new Set(result.items.map(item => item.type))];
    expect(types.length).toBeGreaterThan(0);
    
    // Should have at least "Prévias" and "Show"
    expect(types).toContain('Prévias');
  });

  test('should extract multiple stages', () => {
    const result = extractList(document);
    
    const stages = [...new Set(result.items.map(item => item.stage))];
    expect(stages.length).toBeGreaterThan(1);
    
    // Should contain various stages
    expect(stages).toContain('Praça Do Arsenal');
    expect(stages).toContain('Marco Zero');
  });

  test('should group events by date', () => {
    const result = extractList(document);
    
    const dates = [...new Set(result.items.map(item => item.date))];
    expect(dates.length).toBeGreaterThan(1);
    
    // Should have events from different days
    expect(dates).toContain('08/02/2026');
    expect(dates).toContain('11/02/2026');
  });
});
