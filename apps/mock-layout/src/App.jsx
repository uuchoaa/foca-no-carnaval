import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import SiteDetail from './pages/SiteDetail'
import ConfigEditor from './pages/ConfigEditor'
import Sidebar from './components/Sidebar'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedSite, setSelectedSite] = useState(null)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onSelectSite={(site) => {
          setSelectedSite(site)
          setCurrentPage('site-detail')
        }} />
      case 'site-detail':
        return <SiteDetail site={selectedSite} onEditConfig={() => setCurrentPage('config-editor')} />
      case 'config-editor':
        return <ConfigEditor site={selectedSite} />
      default:
        return <Dashboard onSelectSite={(site) => {
          setSelectedSite(site)
          setCurrentPage('site-detail')
        }} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page)
          if (page === 'dashboard') setSelectedSite(null)
        }}
        selectedSite={selectedSite}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
