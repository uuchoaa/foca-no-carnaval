export default function SnapshotTab() {
  const mockHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Carnaval Events</title>
</head>
<body>
  <div class="container">
    <header>
      <h1>Carnaval de Pernambuco 2026</h1>
      <p>Eventos oficiais</p>
    </header>
    
    <div class="events-grid">
      <article class="event-card">
        <h2>Galo da Madrugada</h2>
        <div class="event-info">
          <span class="date">21/02/2026</span>
          <span class="time">06:00</span>
          <span class="location">Recife Antigo</span>
        </div>
        <p class="description">O maior bloco de carnaval do mundo</p>
      </article>
      
      <article class="event-card">
        <h2>Bacalhau do Batata</h2>
        <div class="event-info">
          <span class="date">20/02/2026</span>
          <span class="time">14:00</span>
          <span class="location">Rua da Aurora</span>
        </div>
        <p class="description">Tradicional encontro de carnaval</p>
      </article>
      
      <article class="event-card">
        <h2>Encontro dos Bonecos Gigantes</h2>
        <div class="event-info">
          <span class="date">19/02/2026</span>
          <span class="time">16:00</span>
          <span class="location">Largo do Amparo</span>
        </div>
        <p class="description">Desfile dos famosos bonecos de Olinda</p>
      </article>
    </div>
  </div>
</body>
</html>`

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sanitized HTML Snapshot
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Characters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">5,000</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Tokens</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">content.html</span>
          </div>
          <pre className="p-4 overflow-auto max-h-[400px] text-xs">
            <code className="text-gray-900 dark:text-gray-100">{mockHtml}</code>
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Sanitization Applied</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">✓</div>
              <span>Scripts removed</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">✓</div>
              <span>Styles removed</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">✓</div>
              <span>Comments removed</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">✓</div>
              <span>SVGs removed</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">✓</div>
              <span>Iframes removed</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">✓</div>
              <span>Hidden elements removed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
