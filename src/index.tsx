import './wdyr'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DevTools, loadServer } from 'jira-dev-tool'
import { AppProviders } from './context'
import "antd/dist/antd.less"
loadServer(() => {
  return (ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppProviders>
      <DevTools></DevTools>
      <App></App>
    </AppProviders>
  ))
})
