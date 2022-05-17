import styled from "@emotion/styled"
import React from 'react';
import { Button } from 'antd'
import { useAuth } from './context/auth-context';
import { ProjectListScreen } from "./pages/project-list"
import { Row } from './components/components'
export const AuthApp =()=>{
  const {loginOut} = useAuth()
  return (
    <Container>
      <Header>
        <Row marginRight={2} > 
          <h3> LOGO </h3>  
          <h3> CHERRY </h3>  
          <h3> LOVE </h3>  
        </Row>
        <HeaderRight><Button onClick={ loginOut }>登出</Button></HeaderRight>
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

const Header = styled.header`grid-area:header;
display: flex;
flex-direction: row;
align-items:center ;
justify-content: space-between;
`

const HeaderLeft = styled.div`
  display:flex ;
  align-items: center;
`
const HeaderRight = styled.div`
  
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

