import React,{ useState } from 'react';
import { LoginPage } from '../pages/login';
import { RegisterPage } from './register'

import { Card , Button} from 'antd'
import styled from '@emotion/styled';

import logo  from '../assets/logo.svg';
import right  from '../assets/right.svg';
import left  from '../assets/left.svg';
export const UnauthApp =()=>{
  const [ isRegister , setRegister] = useState( false)
  return (
    <Container>
      <ShadowCard>
        <div style={{ display:"flex" ,flexDirection:"column", justifyContent:"center" ,alignItems:"center"}}>
        { isRegister? <RegisterPage></RegisterPage> : <LoginPage></LoginPage> }
        <Button style={{ margin:" .625rem 0"}} onClick={()=>setRegister( !isRegister ) }> 切换 { isRegister ? "登陆" : "注册" }</Button>
        </div>
      </ShadowCard>
    </Container>
  )
}

const Header = styled.header`
  background: url(${logo});
`

const ShadowCard = styled(Card)`
  width: 40rem;
  min-height:56rem ;
  padding:3.2rem 4rem ;
  border-radius: 0.3rem;
  box-shadow:rgba(0,0,0,0.1) 0 0 10px ;
  text-align:center ;
`

const Container = styled.div`
  display: flex;
  flex-direction:column ;
  align-items:center ;
  min-height: 100vh;
`
