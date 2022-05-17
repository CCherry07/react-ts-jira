import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { loadDevTools} from 'jira-dev-tool'
import { AppProviders } from './context'
import "antd/dist/antd.less"
loadDevTools(()=>{
  return (ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppProviders>
       <App></App> 
    </AppProviders>
  ))
})




