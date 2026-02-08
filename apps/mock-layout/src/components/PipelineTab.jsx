import { MousePointer, Camera, FileText, Repeat, CheckCircle, XCircle, Clock } from 'lucide-react'
import clsx from 'clsx'

export default function PipelineTab({ pipeline }) {
  const getIcon = (type) => {
    switch (type) {
      case 'interaction':
        return <MousePointer size={20} />
      case 'snapshot':
        return <Camera size={20} />
      case 'reader':
        return <FileText size={20} />
      case 'parallel':
        return <Repeat size={20} />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      case 'running':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Pipeline Execution Flow
        </h3>

        <div className="space-y-4">
          {pipeline.map((step, index) => (
            <div key={step.id}>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={clsx(
                    "p-3 rounded-lg",
                    step.status === 'success' && "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                    step.status === 'error' && "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                    step.status === 'running' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  )}>
                    {getIcon(step.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                        </h4>
                        {step.module && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {step.module}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {step.status === 'success' && <CheckCircle className="text-green-600 dark:text-green-400" size={20} />}
                        {step.status === 'error' && <XCircle className="text-red-600 dark:text-red-400" size={20} />}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {step.duration && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{step.duration}ms</span>
                        </div>
                      )}
                      {step.tokens && (
                        <div>
                          <span className="font-medium">{step.tokens}</span> tokens
                        </div>
                      )}
                      {step.itemsProcessed && (
                        <div>
                          <span className="font-medium">{step.itemsProcessed}</span> items processed
                        </div>
                      )}
                      {step.concurrency && (
                        <div>
                          Concurrency: <span className="font-medium">{step.concurrency}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {index < pipeline.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Pipeline Summary
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-600 dark:text-blue-400">Total Steps</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{pipeline.length}</p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400">Total Duration</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
                {pipeline.reduce((acc, step) => acc + (step.duration || 0), 0)}ms
              </p>
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400">Success Rate</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-300">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
