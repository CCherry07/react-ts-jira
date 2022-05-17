import styled from "@emotion/styled"
import React from 'react';
import { Button ,Dropdown ,Menu} from 'antd'
import { useAuth } from './context/auth-context';
import { ProjectListScreen } from "./pages/project-list"
import { Row } from './components/components'
import {ReactComponent as SoftwareLogo} from './assets/software-logo.svg'
export const AuthApp =()=>{
  const {loginOut , user} = useAuth()
  return (
    <Container>
      <Header>
        <Row marginRight={2} > 
          <SoftwareLogo width={"18rem"} color={"rgb(38,132 ,255)"}></SoftwareLogo>
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
      <Nav> nav </Nav>
      <Main>
        <ProjectListScreen></ProjectListScreen>
      </Main>

      <Aside>aside</Aside>
      <Footer>footer</Footer>
    </Container>
  )
}
const Container = styled.div`
  display:grid;
  grid-template-rows: 6rem calc(100vh - 6rem) 6rem;
  grid-template-columns: 20rem 1fr 20rem;
  grid-template-areas: 
  "header header header"
  "nav main aside"
  "footer footer footer"
  ;
  height:100vh;
  grid-gap:6rem ;
`

const Header = styled(Row)`
  width: 100vw;
  padding:3.2rem ;
  box-shadow: 0 0 5px rgba(0 ,0,0,0.5) ;
`

const HeaderLeft = styled.div`
  display:flex ;
  align-items: center;
`
const HeaderRight = styled.div`
  margin-right:2rem ;
`

const Main = styled.main`grid-area:main`
const Aside = styled.aside`grid-area:aside`
const Nav = styled.nav`grid-area:nav`
const Footer = styled.footer`grid-area:footer`

const PageHeader = styled.header `
  height:6rem;
`
const PageMain = styled.main`
  height: calc(100vh - 6rem);
`

