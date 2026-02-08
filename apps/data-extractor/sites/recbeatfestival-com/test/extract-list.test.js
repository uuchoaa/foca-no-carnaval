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

  test('should extract item fields', () => {
    const result = extractList(document);
    const firstItem = result.items[0];

    // Check required fields
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('date');
    expect(firstItem).toHaveProperty('time');
    expect(firstItem).toHaveProperty('location');
    expect(firstItem).toHaveProperty('artist');

    // Check types
    expect(typeof firstItem.id).toBe('string');
    expect(typeof firstItem.title).toBe('string');
    expect(typeof firstItem.date).toBe('string');
    expect(typeof firstItem.time).toBe('string');
    expect(typeof firstItem.location).toBe('string');
    expect(typeof firstItem.artist).toBe('string');
  });

  test('should extract correct number of shows', () => {
    const result = extractList(document);

    // Should extract shows (actual count based on fixture)
    expect(result.items.length).toBeGreaterThan(80);
    expect(result.items.length).toBeLessThan(120);
  });

  test('should extract festival dates correctly', () => {
    const result = extractList(document);
    const dates = [...new Set(result.items.map(item => item.date))].sort();

    // Should have shows on Feb 14, 15, 16, 17
    expect(dates).toEqual(['2026-02-14', '2026-02-15', '2026-02-16', '2026-02-17']);
  });

  test('should extract location correctly', () => {
    const result = extractList(document);
    const locations = [...new Set(result.items.map(item => item.location))];

    // All shows should be at Cais da Alfândega
    expect(locations).toEqual(['Cais da Alfândega']);
  });

  test('all items should have required fields', () => {
    const result = extractList(document);

    result.items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('time');
      expect(item).toHaveProperty('location');
      expect(item).toHaveProperty('artist');
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.date).toBeTruthy();
      expect(item.time).toBeTruthy();
      expect(item.location).toBeTruthy();
      expect(item.artist).toBeTruthy();
    });
  });

  test('should have URL field', () => {
    const result = extractList(document);

    // All items should have url field (even if empty)
    result.items.forEach(item => {
      expect(item).toHaveProperty('url');
      expect(typeof item.url).toBe('string');
    });
  });

  test('should extract specific event values correctly', () => {
    const result = extractList(document);

    // Find a specific event - Paulete Lindacelva on Feb 14th
    const pauleteEvent = result.items.find(item =>
      item.artist === 'Paulete Lindacelva' &&
      item.date === '2026-02-14'
    );

    expect(pauleteEvent).toBeDefined();
    expect(pauleteEvent.title).toBe('Paulete Lindacelva (PE)');
    expect(pauleteEvent.time).toBe('18:00');
    expect(pauleteEvent.location).toBe('Cais da Alfândega');
    expect(pauleteEvent.state).toBe('PE');
    expect(pauleteEvent.id).toMatch(/^20260214-1800-paulete-lindacelva$/);
  });

  test('should extract international artist event correctly', () => {
    const result = extractList(document);

    // Find an international artist event - Momi Maiga Quartet (Senegal)
    const momiEvent = result.items.find(item =>
      item.artist === 'Momi Maiga Quartet' &&
      item.date === '2026-02-15'
    );

    expect(momiEvent).toBeDefined();
    expect(momiEvent.title).toBe('Momi Maiga Quartet (Senegal)');
    expect(momiEvent.time).toBe('20:40');
    expect(momiEvent.location).toBe('Cais da Alfândega');
    expect(momiEvent.state).toBe('Senegal');
    expect(momiEvent.id).toMatch(/^20260215-2040-momi-maiga-quartet$/);
  });
});
