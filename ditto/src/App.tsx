import { useState } from 'react'
import './App.css'
import { NavBar } from './components/NavBar'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { Onboarding } from './pages/Onboarding'
import { ActionLayer } from './pages/ActionLayer'
import { SocialLayer } from './pages/SocialLayer'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useDittoStore } from './store/useDittoStore'
import type { Page } from './types'

function AppContent() {
  const { user, isLoading, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const store = useDittoStore(Boolean(user))

  if (isLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">◈ Ditto</div>
          <p className="auth-sub">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div className="app-layout">
      <NavBar
        current={currentPage}
        onNavigate={setCurrentPage}
        onboardingProgress={store.onboardingProgress}
        onLogout={logout}
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
            onSendMessage={store.sendChatMessage}
            onToggleSource={store.toggleSource}
            onAddDittoReply={store.addDittoReply}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
