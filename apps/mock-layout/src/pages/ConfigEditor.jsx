import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { mockConfig } from '../data/mockData'

export default function ConfigEditor({ site }) {
  const [config, setConfig] = useState(JSON.stringify(mockConfig, null, 2))
  const [isValid, setIsValid] = useState(true)

  const handleChange = (value) => {
    setConfig(value)
    try {
      JSON.parse(value)
      setIsValid(true)
    } catch {
      setIsValid(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Configuration Editor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit {site?.name || 'site'} configuration
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isValid}>
              <Save size={18} />
              <span>Save</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 p-6">
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">config.json</span>
              {!isValid && (
                <span className="text-xs text-red-600 dark:text-red-400">Invalid JSON</span>
              )}
            </div>
            <textarea
              value={config}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 p-4 font-mono text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configuration Guide
          </h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Pipeline Steps</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">interaction</code> - Modify page state</li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">snapshot</code> - Capture DOM</li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">reader</code> - Extract data</li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">parallel</code> - Parallel extraction</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sanitization Options</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">removeScripts</code></li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">removeStyles</code></li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">removeComments</code></li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">removeSVG</code></li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">removeIframes</code></li>
                <li>• <code className="bg-gray-100 dark:bg-gray-900 px-1 rounded">removeHidden</code></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Interaction</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
{`{
  "type": "interaction",
  "module": "interactions/load.js"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Parallel</h4>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
{`{
  "type": "parallel",
  "concurrency": 30,
  "module": "readers/details.js",
  "input": "output.json",
  "itemsPath": "events",
  "urlField": "url"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
