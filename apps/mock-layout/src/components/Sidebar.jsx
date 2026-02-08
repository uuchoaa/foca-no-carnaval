import { Home, Settings, Plus, ChevronLeft } from 'lucide-react'
import { mockSites } from '../data/mockData'
import clsx from 'clsx'

export default function Sidebar({ currentPage, onNavigate, selectedSite }) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Data Extractor</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Platform</p>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className={clsx(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-4 transition-colors",
            currentPage === 'dashboard'
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          <Home size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        {selectedSite && (
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2 mb-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
          >
            <ChevronLeft size={16} />
            <span>Back to sites</span>
          </button>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sites</h3>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Plus size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-1">
            {mockSites.map(site => (
              <button
                key={site.id}
                onClick={() => onNavigate('site-detail')}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedSite?.id === site.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    site.status === 'idle' && "bg-gray-400",
                    site.status === 'running' && "bg-green-400 animate-pulse",
                    site.status === 'error' && "bg-red-400"
                  )} />
                  <span className="truncate">{site.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
