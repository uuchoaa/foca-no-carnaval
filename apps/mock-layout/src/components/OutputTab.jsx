import { Copy, Download } from 'lucide-react'
import { useState } from 'react'

export default function OutputTab({ data }) {
  const [copied, setCopied] = useState(false)
  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'output.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Extracted Data
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Copy size={16} />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">output.json</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.events?.length || 0} events
            </span>
          </div>
          <pre className="p-4 overflow-auto max-h-[600px] text-sm">
            <code className="text-gray-900 dark:text-gray-100">{jsonString}</code>
          </pre>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.events?.slice(0, 3).map(event => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Date:</span> {event.date}</p>
                <p><span className="font-medium">Time:</span> {event.time}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Participants:</span> {event.participants?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
