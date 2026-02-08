export const mockSites = [
  {
    id: 1,
    name: 'pe-no-carnaval',
    url: 'https://www.penocarnaval.pe.gov.br',
    description: 'Pernambuco carnival events',
    status: 'idle',
    lastRun: '2026-02-07T10:30:00Z',
    lastRunStatus: 'success',
    eventsCount: 156,
    tokens: 1250,
    estimatedCost: 0.0375
  },
  {
    id: 2,
    name: 'carnaval-recife-pe-gov-br',
    url: 'https://carnaval.recife.pe.gov.br',
    description: 'Recife carnival official schedule',
    status: 'idle',
    lastRun: '2026-02-07T09:15:00Z',
    lastRunStatus: 'success',
    eventsCount: 89,
    tokens: 980,
    estimatedCost: 0.0294
  },
  {
    id: 3,
    name: 'olinda-carnaval',
    url: 'https://olinda.pe.gov.br/carnaval',
    description: 'Olinda carnival information',
    status: 'error',
    lastRun: '2026-02-06T18:45:00Z',
    lastRunStatus: 'error',
    eventsCount: 0,
    tokens: 0,
    estimatedCost: 0
  }
]

export const mockPipeline = [
  {
    id: 1,
    type: 'interaction',
    module: 'interactions/load-page.js',
    status: 'success',
    duration: 1250
  },
  {
    id: 2,
    type: 'interaction',
    module: 'interactions/click-load-more.js',
    status: 'success',
    duration: 2100
  },
  {
    id: 3,
    type: 'snapshot',
    status: 'success',
    duration: 450,
    tokens: 1250
  },
  {
    id: 4,
    type: 'reader',
    module: 'readers/extract-list.js',
    status: 'success',
    duration: 180
  },
  {
    id: 5,
    type: 'parallel',
    module: 'readers/extract-details.js',
    concurrency: 30,
    status: 'success',
    duration: 8500,
    itemsProcessed: 156
  }
]

export const mockLogs = [
  { timestamp: '2026-02-07T10:30:45Z', level: 'info', message: 'Pipeline started' },
  { timestamp: '2026-02-07T10:30:46Z', level: 'info', message: 'Running interaction: load-page.js' },
  { timestamp: '2026-02-07T10:30:47Z', level: 'info', message: 'Page loaded successfully' },
  { timestamp: '2026-02-07T10:30:48Z', level: 'info', message: 'Running interaction: click-load-more.js' },
  { timestamp: '2026-02-07T10:30:50Z', level: 'info', message: 'Loaded 50 more items' },
  { timestamp: '2026-02-07T10:30:51Z', level: 'info', message: 'Capturing snapshot...' },
  { timestamp: '2026-02-07T10:30:51Z', level: 'info', message: 'Snapshot saved: 1250 tokens' },
  { timestamp: '2026-02-07T10:30:52Z', level: 'info', message: 'Running reader: extract-list.js' },
  { timestamp: '2026-02-07T10:30:52Z', level: 'success', message: 'Extracted 156 events' },
  { timestamp: '2026-02-07T10:30:53Z', level: 'info', message: 'Starting parallel extraction (30 concurrent)' },
  { timestamp: '2026-02-07T10:31:01Z', level: 'success', message: 'Parallel extraction complete: 156/156 items' },
  { timestamp: '2026-02-07T10:31:01Z', level: 'success', message: 'Pipeline completed successfully' }
]

export const mockOutput = {
  events: [
    {
      id: 1,
      title: 'Galo da Madrugada',
      date: '2026-02-21',
      time: '06:00',
      location: 'Recife Antigo',
      url: 'https://example.com/event/1',
      description: 'O maior bloco de carnaval do mundo',
      participants: 2000000
    },
    {
      id: 2,
      title: 'Bacalhau do Batata',
      date: '2026-02-20',
      time: '14:00',
      location: 'Rua da Aurora',
      url: 'https://example.com/event/2',
      description: 'Tradicional encontro de carnaval',
      participants: 50000
    },
    {
      id: 3,
      title: 'Encontro dos Bonecos Gigantes',
      date: '2026-02-19',
      time: '16:00',
      location: 'Largo do Amparo',
      url: 'https://example.com/event/3',
      description: 'Desfile dos famosos bonecos de Olinda',
      participants: 30000
    }
  ]
}

export const mockConfig = {
  name: 'pe-no-carnaval',
  url: 'https://www.penocarnaval.pe.gov.br',
  description: 'Pernambuco carnival events',
  snapshot: {
    sanitize: {
      removeScripts: true,
      removeStyles: true,
      removeComments: true,
      removeSVG: true,
      removeIframes: true,
      removeHidden: true,
      additionalSelectors: ['.ads', 'nav', 'footer']
    }
  },
  pipeline: [
    { type: 'interaction', module: 'interactions/load-page.js' },
    { type: 'interaction', module: 'interactions/click-load-more.js' },
    { type: 'snapshot' },
    { type: 'reader', module: 'readers/extract-list.js' },
    {
      type: 'parallel',
      concurrency: 30,
      module: 'readers/extract-details.js',
      input: 'output.json',
      itemsPath: 'events',
      urlField: 'url',
      output: 'output-with-details.json'
    }
  ],
  metadata: {
    tokens: 1250,
    characters: 5000,
    snapshotDate: '2026-02-07T10:30:00Z',
    estimatedCost: {
      gpt4: 0.0375,
      gpt35: 0.0019,
      claude: 0.01
    }
  }
}

export const mockTests = [
  { name: 'extract-list.test.js', status: 'pass', duration: 125 },
  { name: 'extract-details.test.js', status: 'pass', duration: 89 },
  { name: 'load-page.test.js', status: 'pass', duration: 45 },
  { name: 'click-load-more.test.js', status: 'pass', duration: 67 }
]
