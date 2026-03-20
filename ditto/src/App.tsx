import { useState } from 'react'
import './App.css'
import { NavBar } from './components/NavBar'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/Onboarding'
import { ActionLayer } from './pages/ActionLayer'
import { SocialLayer } from './pages/SocialLayer'
import { useDittoStore } from './store/useDittoStore'
import type { Page } from './types'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const store = useDittoStore()

  function handleSendMessage(text: string) {
    store.addChatMessage({ role: 'user', text })
  }

  function handleDittoReply(text: string) {
    store.addChatMessage({ role: 'ditto', text })
  }

  return (
    <div className="app-layout">
      <NavBar
        current={currentPage}
        onNavigate={setCurrentPage}
        onboardingProgress={store.onboardingProgress}
      />
      <main className="app-main">
        {currentPage === 'dashboard' && (
          <Dashboard
            traits={store.traits}
            onboardingProgress={store.onboardingProgress}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'onboarding' && (
          <Onboarding
            chatMessages={store.chatMessages}
            sources={store.sources}
            onboardingProgress={store.onboardingProgress}
            onSendMessage={handleSendMessage}
            onToggleSource={store.toggleSource}
            onAddDittoReply={handleDittoReply}
            onIncrementProgress={store.incrementOnboarding}
          />
        )}
        {currentPage === 'action' && <ActionLayer />}
        {currentPage === 'social' && (
          <SocialLayer
            incomingMessages={store.incomingMessages}
            negotiations={store.negotiations}
            onSummarize={store.summarizeMessage}
            onDismiss={store.dismissMessage}
            onResolveNegotiation={store.resolveNegotiation}
          />
        )}
      </main>
    </div>
  )
}

export default App
