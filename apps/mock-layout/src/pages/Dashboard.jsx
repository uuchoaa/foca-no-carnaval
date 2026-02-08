import { Play, Eye, FileJson, Plus, Clock } from 'lucide-react'
import { mockSites } from '../data/mockData'
import clsx from 'clsx'

export default function Dashboard({ onSelectSite }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your data extraction sites</p>
      </div>

      <div className="mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span className="font-medium">Add New Site</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSites.map(site => (
          <div
            key={site.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectSite(site)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {site.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {site.description}
                </p>
                <a
                  href={site.url}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  {site.url}
                </a>
              </div>
              <div className={clsx(
                "px-2 py-1 rounded text-xs font-medium",
                site.status === 'idle' && "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                site.status === 'running' && "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
                site.status === 'error' && "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              )}>
                {site.status}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Clock size={14} />
              <span>Last run: {formatDate(site.lastRun)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Events</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{site.eventsCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tokens</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{site.tokens}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={e => e.stopPropagation()}
              >
                <Play size={14} />
                <span>Run</span>
              </button>
              <button
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Eye size={16} />
              </button>
              <button
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <FileJson size={16} />
              </button>
            </div>

            {site.lastRunStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-700 dark:text-red-400">Last extraction failed</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {mockSites.map(site => (
            <div key={site.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-2 h-2 rounded-full",
                  site.lastRunStatus === 'success' && "bg-green-400",
                  site.lastRunStatus === 'error' && "bg-red-400"
                )} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{site.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(site.lastRun)}</p>
                </div>
              </div>
              <span className={clsx(
                "text-xs font-medium",
                site.lastRunStatus === 'success' && "text-green-600 dark:text-green-400",
                site.lastRunStatus === 'error' && "text-red-600 dark:text-red-400"
              )}>
                {site.lastRunStatus === 'success' ? `${site.eventsCount} events` : 'Failed'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
