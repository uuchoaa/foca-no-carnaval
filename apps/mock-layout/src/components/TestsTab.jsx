import { CheckCircle, XCircle, Play } from 'lucide-react'
import clsx from 'clsx'

export default function TestsTab({ tests }) {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Results
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Play size={16} />
            <span>Run Tests</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Test Suites
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {tests.length} tests
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {tests.map((test, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {test.status === 'pass' ? (
                      <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                    ) : (
                      <XCircle className="text-red-600 dark:text-red-400" size={20} />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {test.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {test.duration}ms
                      </p>
                    </div>
                  </div>
                  <span className={clsx(
                    "text-xs font-medium px-2 py-1 rounded",
                    test.status === 'pass'
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  )}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tests</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{tests.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Passed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {tests.filter(t => t.status === 'pass').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Duration</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {tests.reduce((acc, t) => acc + t.duration, 0)}ms
            </p>
          </div>
        </div>

        <div className="mt-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
            ✓ All Tests Passed
          </h4>
          <p className="text-sm text-green-700 dark:text-green-400">
            All {tests.length} test suites passed successfully. Your extractors are working correctly.
          </p>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Test Coverage</h4>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Readers</span>
                <span className="text-gray-900 dark:text-white font-medium">100%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Interactions</span>
                <span className="text-gray-900 dark:text-white font-medium">100%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
