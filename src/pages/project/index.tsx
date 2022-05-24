import { Menu} from 'antd'
import styled from '@emotion/styled'
import { Link ,Routes,Route ,Navigate, useLocation} from 'react-router-dom'
import {PageEpic} from './epic'
import {PageSignboard} from './signboard'

const useCurrentRouteName = () =>{
  const units = useLocation().pathname.split("/")
  return units[units.length - 1]
}

export const PageProject =()=>{
  const currentRouteName = useCurrentRouteName()
  return (
    <Container>
      <Aside>
        <Menu mode='inline' selectedKeys={[currentRouteName]}>
          <Menu.Item key={"signboard"}>
            <Link to={"signboard"}>SIGNBOARD</Link> 
          </Menu.Item>
          <Menu.Item key={"epic"}>
          <Link to={"epic"}>MISSIONBOARD</Link>
          </Menu.Item>
        </Menu>
      </Aside>
       <Main>
       <Routes>
          <Route path='signboard' element={<PageSignboard></PageSignboard>}></Route>
          <Route path='epic' element={<PageEpic></PageEpic>}></Route>
          <Route path="*" element={<Navigate to={ window.location.pathname + "/signboard" } replace={true}/>} />
        </Routes>
       </Main>
    </Container>
  )
}

const Container =styled.div`
  display:grid ;
  grid-template-columns:16rem 1fr ;
  overflow: hidden;
`

const Aside = styled.aside`
  background-color: rgb(244,255,256);
  display:flex ;
  flex-direction:column ;
`

const Main = styled.div`
  box-shadow:-5px 0 5px #dcf4e8;
  display:flex ;
  overflow:hidden;
`
