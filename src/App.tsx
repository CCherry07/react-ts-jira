import './App.css'
import { useAuth } from './context/auth-context'
import { AuthApp } from './authApp'
import { UnauthApp } from './unAuth-app'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PullpageError  } from './components/components'
function App() {
  const { user } = useAuth()
  return (
    <div className='App'>
      <ErrorBoundary fallBackRender={PullpageError}>
      { user ? <AuthApp></AuthApp> : <UnauthApp></UnauthApp> }
      </ErrorBoundary>
    </div>
  )
}

export default App
