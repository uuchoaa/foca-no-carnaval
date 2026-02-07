const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const extractEventDetails = require('./extract-event-details');

describe('extractEventDetails', () => {
  let document;
  const sampleEvent = {
    id: 'corrida-dos-bonecos-gigantes',
    name: 'Corrida dos Bonecos Gigantes',
    date: '07/02/2026',
    dateISO: '2026-02-07T09:00:00',
    dayOfWeek: 'sábado',
    time: '09:00',
    category: 'previas',
    types: ['indicamos', 'tradicional'],
    city: 'olinda',
    location: 'Mercado da Ribeira',
    isFree: true,
    url: 'https://penocarnaval.com.br/programacao/corrida-dos-bonecos-gigantes/'
  };

  beforeAll(() => {
    const html = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'event-detail.html'),
      'utf-8'
    );
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('should return an object with extracted details', () => {
    const result = extractEventDetails(document, sampleEvent);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  test('should log the event name and URL', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    extractEventDetails(document, sampleEvent);

    const logs = consoleSpy.mock.calls.map(c => c[0]);
    expect(logs.some(l => l.includes('Corrida dos Bonecos Gigantes'))).toBe(true);
    expect(logs.some(l => l.includes(sampleEvent.url))).toBe(true);

    consoleSpy.mockRestore();
  });

  test('should include page title', () => {
    const result = extractEventDetails(document, sampleEvent);
    expect(result.pageTitle).toBe('Corrida dos Bonecos Gigantes | PE no Carnaval');
  });

  test('should include content length', () => {
    const result = extractEventDetails(document, sampleEvent);
    expect(result.contentLength).toBe(37398);
  });

  test('should include extractedAt timestamp', () => {
    const result = extractEventDetails(document, sampleEvent);
    expect(result.extractedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
