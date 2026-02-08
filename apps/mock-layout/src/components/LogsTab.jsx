import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'

export default function LogsTab({ logs }) {
  const getIcon = (level) => {
    switch (level) {
      case 'error':
        return <XCircle size={16} />
      case 'warning':
        return <AlertCircle size={16} />
      case 'success':
        return <CheckCircle size={16} />
      default:
        return <Info size={16} />
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'success':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Execution Logs
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              Clear
            </button>
            <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              Export
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs">
            <button className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded">
              All
            </button>
            <button className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Info
            </button>
            <button className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Success
            </button>
            <button className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Warning
            </button>
            <button className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              Error
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors font-mono"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[100px]">
                    {formatTime(log.timestamp)}
                  </span>
                  <div className={clsx("mt-0.5", getLevelColor(log.level))}>
                    {getIcon(log.level)}
                  </div>
                  <span className={clsx("flex-1 text-sm", getLevelColor(log.level))}>
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Info size={16} />
              <span className="text-xs font-medium">Info</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {logs.filter(l => l.level === 'info').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
              <CheckCircle size={16} />
              <span className="text-xs font-medium">Success</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {logs.filter(l => l.level === 'success').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
              <AlertCircle size={16} />
              <span className="text-xs font-medium">Warning</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
              <XCircle size={16} />
              <span className="text-xs font-medium">Error</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
