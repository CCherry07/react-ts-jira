import React from 'react';
import { useAuth } from './context/auth-context';
import { ProjectListScreen } from "./pages/project-list"
export const AuthApp =()=>{
  const {loginOut} = useAuth()
  return (
    <div>
      <button onClick={ loginOut }>登出</button>
      <ProjectListScreen></ProjectListScreen>
    </div>
  )
}
