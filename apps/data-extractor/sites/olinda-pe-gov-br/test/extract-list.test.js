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
    expect(result.items.length).toBe(33);
  });

  test('should extract item fields', () => {
    const result = extractList(document);
    const firstItem = result.items[0];
    
    expect(firstItem).toEqual({
      id: '12-02-2026-cortejo-ta-todo-mundo-aqui',
      title: 'Cortejo “Tá Todo Mundo Aqui”',
      date: '12/02/2026',
      dayOfWeek: 'QUINTA-FEIRA',
      stage: 'Palco Pernambuco meu País – Erasto Vasconcelos',
      url: 'https://www.olinda.pe.gov.br/programacao-do-carnaval-2026-coloca-todo-mundo-na-folia-em-olinda/'
    });
  });

  test('all items should have required fields', () => {
    const result = extractList(document);
    
    result.items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('dayOfWeek');
      expect(item).toHaveProperty('stage');
      expect(item).toHaveProperty('url');
      
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.date).toBe('string');
      expect(typeof item.dayOfWeek).toBe('string');
      expect(typeof item.stage).toBe('string');
      expect(typeof item.url).toBe('string');
    });
  });

  test('should extract URLs correctly', () => {
    const result = extractList(document);
    
    const itemsWithUrl = result.items.filter(item => item.url && item.url.length > 0);
    expect(itemsWithUrl.length).toBe(33);
    
    result.items.forEach(item => {
      expect(item.url).toBe('https://www.olinda.pe.gov.br/programacao-do-carnaval-2026-coloca-todo-mundo-na-folia-em-olinda/');
    });
  });

  test('should extract last item correctly', () => {
    const result = extractList(document);
    const lastItem = result.items[result.items.length - 1];
    
    expect(lastItem).toEqual({
      id: '17-02-2026-cordel-do-fogo-encantado',
      title: 'Cordel do Fogo Encantado',
      date: '17/02/2026',
      dayOfWeek: 'TERÇA',
      stage: 'Palco Pernambuco meu País – Erasto Vasconcelos',
      url: 'https://www.olinda.pe.gov.br/programacao-do-carnaval-2026-coloca-todo-mundo-na-folia-em-olinda/'
    });
  });

  test('should extract events grouped by date', () => {
    const result = extractList(document);
    
    const quinta = result.items.filter(item => item.date === '12/02/2026');
    const terca = result.items.filter(item => item.date === '17/02/2026');
    
    expect(quinta.length).toBe(5);
    expect(terca.length).toBe(6);
    
    expect(quinta[0].title).toBe('Cortejo “Tá Todo Mundo Aqui”');
    expect(quinta[1].title).toBe('Orquestra Henrique Dias, com participação de Isadora Mello, Ricardo Pessoa, Juba e Larissa Lisboa');
    expect(quinta[4].title).toBe('Nação Zumbi');
  });
});
