/**
 * Script JavaScript para extrair informações de eventos de elementos HTML <li>
 * e converter para JSON. Pode ser executado no console do navegador.
 */

/**
 * Extrai informações de um único elemento <li> de evento
 * @param {HTMLElement} liElement - O elemento <li> a ser processado
 * @param {string} dia - String do dia no formato "DD/MM/YYYY" (opcional)
 * @returns {Object} Objeto com as informações extraídas do evento
 */
function extractEventInfo(liElement, dia = '') {
  if (!liElement || liElement.tagName !== 'LI') {
    throw new Error('Elemento <li> não encontrado ou inválido');
  }

  // Inicializar objeto com dados dos atributos data-*
  const eventData = {
    nome: liElement.getAttribute('data-nome-evento') || '',
    horario: liElement.getAttribute('data-horario-evento') || '',
    categoria: liElement.getAttribute('data-categoria-evento') || '',
    tipo: (liElement.getAttribute('data-tipo-evento') || '').split(',').filter(Boolean),
    cidade: liElement.getAttribute('data-cidade-evento') || '',
    dia: dia // Adicionar o parâmetro dia
  };

  // Extrair dados dos spans internos
  const spans = liElement.querySelectorAll('span');
  spans.forEach(span => {
    const spanClass = span.className;
    let spanText = span.textContent.trim();

    // Remover texto de ícones FontAwesome
    const iconElement = span.querySelector('.fa');
    if (iconElement) {
      spanText = spanText.replace(iconElement.textContent, '').trim();
    }

    // Mapear classes para campos
    switch (spanClass) {
      case 'categoria':
        eventData.categoria_texto = spanText;
        break;
      case 'data':
        eventData.data = spanText;
        break;
      case 'diasemana':
        eventData.dia_semana = spanText;
        break;
      case 'titulo':
        eventData.titulo = spanText;
        break;
      case 'cidade':
        eventData.cidade_texto = spanText;
        break;
      case 'local':
        eventData.local = spanText;
        break;
      case 'horario':
        eventData.horario_texto = spanText;
        break;
      case 'tipo_evento':
        eventData.tipo_evento_texto = spanText;
        break;
    }
  });

  // Extrair URL do link
  const link = liElement.querySelector('a');
  if (link) {
    eventData.url = link.getAttribute('href') || '';
  }

  // Extrair dados do botão favorito
  const favoriteButton = liElement.querySelector('button.favorite-button');
  if (favoriteButton) {
    eventData.post_id = favoriteButton.getAttribute('data-post-id') || '';
    eventData.user_id = favoriteButton.getAttribute('data-user-id') || '';
  }

  return eventData;
}

/**
 * Extrai informações de todos os eventos <li> dentro de um elemento <ul>
 * @param {HTMLElement} ulElement - O elemento <ul> pai contendo os <li>s
 * @param {string} dia - String do dia no formato "DD/MM/YYYY" (opcional)
 * @returns {Array} Array de objetos com informações dos eventos
 */
function extractEventsFromUL(ulElement, dia = '') {
  if (!ulElement || ulElement.tagName !== 'UL') {
    throw new Error('Elemento <ul> não encontrado ou inválido');
  }

  const liElements = ulElement.querySelectorAll('li');
  const events = [];

  liElements.forEach(li => {
    try {
      const eventInfo = extractEventInfo(li, dia);
      events.push(eventInfo);
    } catch (error) {
      console.warn('Erro ao processar elemento li:', error.message, li);
    }
  });

  return events;
}

/**
 * Converte um array de eventos para JSON formatado
 * @param {Array} events - Array de objetos de eventos
 * @returns {string} JSON formatado
 */
function eventsToJSON(events) {
  return JSON.stringify(events, null, 2);
}

// Exemplo de uso - copie e cole no console do navegador:
/*
// Para um único LI:
const li = document.querySelector('li[data-nome-evento]');
const eventInfo = extractEventInfo(li, '07/02/2026'); // com dia opcional
console.log(JSON.stringify(eventInfo, null, 2));

// Para todos os LIs dentro de um UL:
const ul = document.querySelector('ul'); // ou especifique o seletor correto
const events = extractEventsFromUL(ul, '07/02/2026'); // com dia opcional
console.log(eventsToJSON(events));

// Ou diretamente:
console.log(eventsToJSON(extractEventsFromUL(document.querySelector('ul'), '07/02/2026')));

// Sem dia (valor padrão vazio):
console.log(eventsToJSON(extractEventsFromUL(document.querySelector('ul'))));
*/

// Exportar funções para uso global (útil no console)
if (typeof window !== 'undefined') {
  window.extractEventInfo = extractEventInfo;
  window.extractEventsFromUL = extractEventsFromUL;
  window.eventsToJSON = eventsToJSON;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractEventInfo,
    extractEventsFromUL,
    eventsToJSON
  };
}