import { useState } from 'react'
import { Play, Settings, Trash2, StopCircle } from 'lucide-react'
import { mockPipeline, mockOutput, mockLogs, mockTests } from '../data/mockData'
import PipelineTab from '../components/PipelineTab'
import OutputTab from '../components/OutputTab'
import SnapshotTab from '../components/SnapshotTab'
import LogsTab from '../components/LogsTab'
import TestsTab from '../components/TestsTab'
import clsx from 'clsx'

export default function SiteDetail({ site, onEditConfig }) {
  const [activeTab, setActiveTab] = useState('pipeline')
  const [isRunning, setIsRunning] = useState(false)

  const tabs = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'output', label: 'Output' },
    { id: 'snapshot', label: 'Snapshot' },
    { id: 'logs', label: 'Logs' },
    { id: 'tests', label: 'Tests' }
  ]

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 5000)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {site?.name || 'pe-no-carnaval'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {site?.description || 'Pernambuco carnival events'}
            </p>
            <a
              href={site?.url || 'https://www.penocarnaval.pe.gov.br'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {site?.url || 'https://www.penocarnaval.pe.gov.br'}
            </a>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isRunning ? <StopCircle size={18} /> : <Play size={18} />}
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
            <button
              onClick={onEditConfig}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings size={18} />
            </button>
            <button className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{site?.eventsCount || 156}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tokens</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{site?.tokens || 1250}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Est. Cost</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${site?.estimatedCost || 0.0375}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <p className={clsx(
              "text-2xl font-bold capitalize",
              site?.status === 'idle' && "text-gray-600 dark:text-gray-400",
              site?.status === 'running' && "text-green-600 dark:text-green-400",
              site?.status === 'error' && "text-red-600 dark:text-red-400"
            )}>
              {site?.status || 'idle'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-6 py-3 font-medium text-sm transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        {activeTab === 'pipeline' && <PipelineTab pipeline={mockPipeline} />}
        {activeTab === 'output' && <OutputTab data={mockOutput} />}
        {activeTab === 'snapshot' && <SnapshotTab />}
        {activeTab === 'logs' && <LogsTab logs={mockLogs} />}
        {activeTab === 'tests' && <TestsTab tests={mockTests} />}
      </div>
    </div>
  )
}
