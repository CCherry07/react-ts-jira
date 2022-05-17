import './App.css'
// import Routers from './router'
import { useAuth } from './context/auth-context'
import { AuthApp } from './authApp'
import { UnauthApp } from './unAuth-app'
function App() {
  const { user } = useAuth()
  return (
    <div>
     { user ? <AuthApp></AuthApp> : <UnauthApp></UnauthApp> }
    </div>
  )
}

export default App
