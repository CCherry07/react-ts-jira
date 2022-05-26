import './App.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PullpageError, PullpageLoading  } from './components/components' 
import React from 'react'
import { useAuth } from './context/auth-context'
const UnauthApp = React.lazy(()=>import("./unAuth-app"))
const AuthApp = React.lazy(()=>import("./authApp"))
function App() {
  const {user}  =useAuth()
  return (
    <div className='App'>
      <ErrorBoundary fallBackRender={PullpageError}>
        <React.Suspense fallback={<PullpageLoading></PullpageLoading>}>
      { user ? <AuthApp></AuthApp> : <UnauthApp></UnauthApp> }
      </React.Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
