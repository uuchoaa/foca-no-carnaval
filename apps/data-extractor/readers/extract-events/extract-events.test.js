const fs = require('fs');
const path = require('path');
const extractEvents = require('./extract-events');

describe('extractEvents', () => {
  let htmlContent;
  
  beforeAll(() => {
    // Read the actual HTML content
    const htmlPath = path.join(__dirname, 'content.html');
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  });

  test('should extract all events from HTML', () => {
    const result = extractEvents(htmlContent);
    
    expect(result).toHaveProperty('events');
    expect(Array.isArray(result.events)).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
  });

  test('should extract correct number of events', () => {
    const result = extractEvents(htmlContent);
    
    // Based on content.html: 5 events on 18/02/2026 + 1 event on 22/02/2026 = 6 events
    expect(result.events.length).toBe(6);
  });

  test('should extract first event correctly', () => {
    const result = extractEvents(htmlContent);
    const firstEvent = result.events[0];
    
    expect(firstEvent.name).toBe('Bacalhau do Batata');
    expect(firstEvent.date).toBe('18/02/2026');
    expect(firstEvent.dateISO).toBe('2026-02-18T08:00:00');
    expect(firstEvent.dayOfWeek).toBe('quarta-feira');
    expect(firstEvent.time).toBe('08:00');
    expect(firstEvent.category).toBe('blocos');
    expect(firstEvent.city).toBe('olinda');
    expect(firstEvent.location).toBe('Ladeira da Sé');
    expect(firstEvent.isFree).toBe(true);
    expect(firstEvent.url).toContain('penocarnaval.com.br/programacao');
  });

  test('should parse types array correctly', () => {
    const result = extractEvents(htmlContent);
    const firstEvent = result.events[0];
    
    expect(Array.isArray(firstEvent.types)).toBe(true);
    expect(firstEvent.types).toEqual(['indicamos', 'tradicional']);
  });

  test('should handle empty types', () => {
    const result = extractEvents(htmlContent);
    // Second event (Bloco do Barão) has empty data-tipo-evento
    const secondEvent = result.events[1];
    
    expect(Array.isArray(secondEvent.types)).toBe(true);
    expect(secondEvent.types.length).toBe(0);
  });

  test('should extract event ID from URL', () => {
    const result = extractEvents(htmlContent);
    const firstEvent = result.events[0];
    
    expect(firstEvent.id).toBeTruthy();
    expect(typeof firstEvent.id).toBe('string');
  });

  test('should parse date correctly for all events', () => {
    const result = extractEvents(htmlContent);
    
    result.events.forEach(event => {
      expect(event.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(event.dateISO).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  test('should extract second date group correctly', () => {
    const result = extractEvents(htmlContent);
    const lastEvent = result.events[result.events.length - 1];
    
    expect(lastEvent.name).toBe('O Invejado');
    expect(lastEvent.date).toBe('22/02/2026');
    expect(lastEvent.dateISO).toBe('2026-02-22T16:00:00');
    expect(lastEvent.dayOfWeek).toBe('domingo');
    expect(lastEvent.time).toBe('16:00');
  });

  test('should handle late night events correctly', () => {
    const result = extractEvents(htmlContent);
    // Find "Segura a Coisa" with time 23:59
    const lateEvent = result.events.find(e => e.name === 'Segura a Coisa');
    
    expect(lateEvent).toBeDefined();
    expect(lateEvent.time).toBe('23:59');
    expect(lateEvent.dateISO).toBe('2026-02-18T23:59:00');
  });

  test('all events should have required fields', () => {
    const result = extractEvents(htmlContent);
    
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
    const result = extractEvents(htmlContent);
    
    // All events in the sample HTML are free
    result.events.forEach(event => {
      expect(event.isFree).toBe(true);
    });
  });

  test('should extract location for all events', () => {
    const result = extractEvents(htmlContent);
    
    result.events.forEach(event => {
      expect(typeof event.location).toBe('string');
      // All events in sample should have a location
      expect(event.location.length).toBeGreaterThan(0);
    });
  });

  test('should extract correct categories', () => {
    const result = extractEvents(htmlContent);
    
    // All events in sample are "blocos"
    result.events.forEach(event => {
      expect(event.category).toBe('blocos');
    });
  });

  test('should extract correct cities', () => {
    const result = extractEvents(htmlContent);
    
    // All events in sample are in "olinda"
    result.events.forEach(event => {
      expect(event.city).toBe('olinda');
    });
  });
});
