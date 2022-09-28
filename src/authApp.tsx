import styled from "@emotion/styled"
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Button, Dropdown, Menu } from 'antd'
import { useAuth } from './context/auth-context';
import { ProjectListScreen } from "./pages/project-list"
import { Row } from './components/components'
import { ReactComponent as SoftwareLogo } from './assets/software-logo.svg'
import { useDocTitle } from "./hooks";
import { PageProject } from "./pages/project";
import { resetRouter } from "./utils";
import { PageProjectModal } from "./pages/project-modal";
import { ProjectPopover, UserPopover } from "./pages/components";


export default () => {
  useDocTitle("项目列表", false)
  return (
    <Container>
      <BrowserRouter>
        <PageHeader></PageHeader>
        <Main>
          <Routes>
            <Route path="/projects" element={<ProjectListScreen />} ></Route>
            <Route path="/projects/:projectId/*" element={<PageProject />} />
            <Route path="*" element={<Navigate to={"/projects"} replace={true} />} />
          </Routes>
        </Main>
        <PageProjectModal></PageProjectModal>
      </BrowserRouter>
    </Container>
  )
}

const PageHeader = () => {
  const { loginOut, user } = useAuth()
  return (
    <Header>
      <Row marginRight={2} >
        <Button style={{ padding: 0, border: "none" }} type="link" onClick={resetRouter}>
          <SoftwareLogo width={"17rem"} color={"rgb(38,132 ,255)"}></SoftwareLogo>
        </Button>
        <ProjectPopover></ProjectPopover>
        <UserPopover></UserPopover>
        <h3> CHERRY </h3>
        <h3> LOVE </h3>
      </Row>
      <HeaderRight>
        <Dropdown overlay={<Menu>
          <Menu.Item key="logout">
            <Button onClick={loginOut}>登出</Button>
          </Menu.Item>
        </Menu>}>
          <a onClick={e => e.preventDefault()}>
            Hi,{user?.name}
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

const Main = styled.main`grid-area:main;
display:flex ;
`

