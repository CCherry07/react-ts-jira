import './wdyr'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DevTools, loadServer } from 'jira-dev-tool'
import { AppProviders } from './context'
loadServer(() => {
  return (ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppProviders>
      <App></App>
    </AppProviders>
  ))
})
