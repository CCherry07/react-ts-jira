import styled from "@emotion/styled"
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BrowserRouter, Navigate, Route , Routes } from 'react-router-dom'
import { Button ,Dropdown ,Menu} from 'antd'
import { UnauthApp } from "./unAuth-app";
import { useAuth } from './context/auth-context';
import { ProjectListScreen } from "./pages/project-list"
import { Row } from './components/components'
import {ReactComponent as SoftwareLogo} from './assets/software-logo.svg'
import { useDocTitle} from "./hooks";
import { PageProject } from "./pages/project";
import { resetRouter } from "./utils";
import { PageProjectModal } from "./pages/project-modal";
import { ProjectPopover } from "./pages/components";



export const AuthApp =()=>{
  const [ pageProjectModalOpen , setPageProjectModalOpen ] = useState(false) 
  useDocTitle("项目列表",false)
  return (
    <Container>
      <PageHeader setPageProjectModalOpen={setPageProjectModalOpen}></PageHeader>
      <Main>
          <BrowserRouter>
            <Routes>
            <Route path="/projects" element={ <ProjectListScreen/>} ></Route>
            <Route path="/projects/:projectId/*" element={<PageProject/>}/>
            <Route path="*" element={<Navigate to={ "/projects" } replace={true}/>} />
            </Routes>
          </BrowserRouter>
      </Main>
      <PageProjectModal pageProjectModalOpen={pageProjectModalOpen}  onClose={()=>setPageProjectModalOpen(false)}></PageProjectModal>
    </Container>
  )
}

interface PageHeaderProps{
  setPageProjectModalOpen:Dispatch<SetStateAction<boolean>>
}

const PageHeader =({setPageProjectModalOpen}:PageHeaderProps)=>{
  const {loginOut , user} = useAuth()
  return(
    <Header>
    <Row marginRight={2} > 
      {/* <Button onClick={()=>setPageProjectModalOpen(true)}></Button> */}
      <Button style={{padding:0,border:"none"}} type="link" onClick={resetRouter}>
      <SoftwareLogo width={"17rem"} color={"rgb(38,132 ,255)"}></SoftwareLogo>
      </Button>
      <ProjectPopover setPageProjectModalOpen={setPageProjectModalOpen}></ProjectPopover>
      <h3> CHERRY </h3>  
      <h3> LOVE </h3>  
    </Row>
    <HeaderRight>
      <Dropdown overlay={<Menu>
        <Menu.Item key="logout">
        <Button onClick={ loginOut }>登出</Button> 
        </Menu.Item>
      </Menu>}>
        <a onClick={e=>e.preventDefault()}>
          Hi,{ user?.name }
        </a>
      </Dropdown>
      </HeaderRight>
  </Header>
  )
}

const Container = styled.div`
  display:grid;
  grid-template-rows: 6rem calc(100vh - 6rem) 6rem;
  grid-template-columns: 20rem 1fr 20rem;
  grid-template-areas: 
  "header header header"
  "main main main"
  "footer footer footer"
  ;
  height:100vh;
  /* grid-gap:3rem ; */
`

const Header = styled(Row)`
  width: 100vw;
  padding:3.2rem ;
  box-shadow: 0 0 5px rgba(0 ,0,0,0.5) ;
`

const HeaderRight = styled.div`
  margin-right:2rem ;
`

const Main = styled.main`grid-area:main`
const Aside = styled.aside`grid-area:aside`
const Nav = styled.nav`grid-area:nav`
const Footer = styled.footer`grid-area:footer`

const PageMain = styled.main`
  height: calc(100vh - 6rem);
`

