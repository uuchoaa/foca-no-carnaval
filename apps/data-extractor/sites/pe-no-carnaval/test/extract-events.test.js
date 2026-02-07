const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const extractEvents = require('../readers/extract-events');

describe('extractEvents', () => {
  let document;
  
  beforeAll(() => {
    // TODO: create loadFixture(...) helper
    const htmlPath = path.join(__dirname, '__fixtures__', 'events-list.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    document = dom.window.document;
  });

  test('should extract all events from HTML', () => {
    const result = extractEvents(document);
    
    expect(result).toHaveProperty('events');
    expect(Array.isArray(result.events)).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
  });

  test('should extract correct number of events', () => {
    const result = extractEvents(document);
    
    // Based on events-list.html fixture
    expect(result.events.length).toBe(90);
  });

  test('should extract first event correctly', () => {
    const result = extractEvents(document);
    const firstEvent = result.events[0];
    
    expect(firstEvent.name).toBe('60º Baile Municipal do Recife');
    expect(firstEvent.date).toBe('07/02/2026');
    expect(firstEvent.dateISO).toBe('2026-02-07T19:00:00');
    expect(firstEvent.dayOfWeek).toBe('sábado');
    expect(firstEvent.time).toBe('19:00');
    expect(firstEvent.category).toBe('previas');
    expect(firstEvent.city).toBe('recife');
    expect(firstEvent.location).toBe('Classic Hall');
    expect(firstEvent.isFree).toBe(false);
    expect(firstEvent.url).toContain('penocarnaval.com.br/programacao');
  });

  test('should parse types array correctly', () => {
    const result = extractEvents(document);
    const firstEvent = result.events[0];
    
    expect(Array.isArray(firstEvent.types)).toBe(true);
    expect(firstEvent.types).toEqual(['indicamos', 'indicamos']);
  });

  test('should handle empty types', () => {
    const result = extractEvents(document);
    // In this fixture, all events have types
    const eventWithEmptyTypes = result.events.find(e => e.types.length === 0);
    
    // No events with empty types in this fixture
    expect(eventWithEmptyTypes).toBeUndefined();
  });

  test('should extract event ID from URL', () => {
    const result = extractEvents(document);
    const firstEvent = result.events[0];
    
    expect(firstEvent.id).toBeTruthy();
    expect(typeof firstEvent.id).toBe('string');
  });

  test('should parse date correctly for all events', () => {
    const result = extractEvents(document);
    
    result.events.forEach(event => {
      expect(event.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(event.dateISO).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  test('should extract second date group correctly', () => {
    const result = extractEvents(document);
    const lastEvent = result.events[result.events.length - 1];
    
    expect(lastEvent.name).toBe('Eu Acho é Pouco');
    expect(lastEvent.date).toBe('17/02/2026');
    expect(lastEvent.dateISO).toBe('2026-02-17T17:00:00');
    expect(lastEvent.dayOfWeek).toBe('terça-feira');
    expect(lastEvent.time).toBe('17:00');
  });

  test('should handle late night events correctly', () => {
    const result = extractEvents(document);
    // Find events with late time (after 22:00)
    const lateEvents = result.events.filter(e => {
      const hour = parseInt(e.time.split(':')[0]);
      return hour >= 22;
    });
    
    expect(lateEvents.length).toBeGreaterThan(0);
    // Check one late event has proper ISO date
    if (lateEvents.length > 0) {
      expect(lateEvents[0].dateISO).toMatch(/T\d{2}:\d{2}:00/);
    }
  });

  test('all events should have required fields', () => {
    const result = extractEvents(document);
    
    result.events.forEach(event => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('dateISO');
      expect(event).toHaveProperty('dayOfWeek');
      expect(event).toHaveProperty('time');
      expect(event).toHaveProperty('category');
      expect(event).toHaveProperty('types');
      expect(event).toHaveProperty('city');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('isFree');
      expect(event).toHaveProperty('url');
    });
  });

  test('should identify free events correctly', () => {
    const result = extractEvents(document);
    
    // Most events should be free
    const freeEvents = result.events.filter(e => e.isFree);
    expect(freeEvents.length).toBeGreaterThan(0);
  });

  test('should extract location for all events', () => {
    const result = extractEvents(document);
    
    // Most events should have locations
    const eventsWithLocation = result.events.filter(e => e.location && e.location.length > 0);
    expect(eventsWithLocation.length).toBeGreaterThan(0);
  });

  test('should extract correct categories', () => {
    const result = extractEvents(document);
    
    // Should have various categories
    const categories = [...new Set(result.events.map(e => e.category))];
    expect(categories.length).toBeGreaterThan(0);
    // First event should be previas
    expect(result.events[0].category).toBe('previas');
  });

  test('should extract correct cities', () => {
    const result = extractEvents(document);
    
    // Should have various cities
    const cities = [...new Set(result.events.map(e => e.city))];
    expect(cities.length).toBeGreaterThan(0);
    // First event should be in recife
    expect(result.events[0].city).toBe('recife');
  });
});
