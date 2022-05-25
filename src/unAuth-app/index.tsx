import React,{ useState } from 'react';
import { LoginPage } from './login';
import { RegisterPage } from './register'

import { Card , Button , Divider,Typography} from 'antd'
import styled from '@emotion/styled';

import logo  from '../assets/logo.svg';
import right  from '../assets/right.svg';
import left  from '../assets/left.svg';
import { useDocTitle } from '../hooks';
export const UnauthApp =()=>{
  const [ isRegister , setRegister] = useState( false)
  const [ error , setError ] = useState<Error|null>(null)
  useDocTitle("欢迎jira",false)
  return (
    <Container>
      <Header></Header>
      <BackGround>
      <ShadowCard>
        <Title>
          { isRegister?"请注册":"请登陆" }
        </Title>
        <Typography.Text type='danger'>{error?.message}</Typography.Text>
        <div style={{ display:"flex" ,flexDirection:"column", justifyContent:"center"}}>
        { isRegister? <RegisterPage onError={setError}></RegisterPage> 
        : <LoginPage onError={setError}></LoginPage> }
        <Divider></Divider>
        <LongButton style={{ margin:" .625rem 0"}} 
        onClick={()=>setRegister( !isRegister ) }> 切换 { isRegister ? "登陆" : "注册" }</LongButton>
        </div>
      </ShadowCard>
      </BackGround>
    </Container>
  )
}
export const LongButton = styled(Button)`
  width:100% ;
`

const Title = styled.div`
  margin-bottom:2.4rem;
  color: rgb(94 , 108 ,132);
`

const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding:5rem 0 ;
  background-size: 8rem;
  width:100% ;
`
const BackGround = styled.div`
  position:absolute;
  width: 100%;
  height:100%;
  background-repeat:no-repeat ;
  background-attachment: fixed;
  background-position:left bottom,right bottom;
  background-image: url(${left}),url(${right});
  background-size:calc(((100vw - 40rem)/2) - 3.2rem) , calc(((100vw - 40rem)/2) - 3.2rem) , cover;
  display: flex;
  justify-content: center;
  align-items:center ;
`
const ShadowCard = styled(Card)`
  width: 40rem;
  min-height:56rem ;
  padding:3.2rem 4rem ;
  border-radius: 0.3rem;
  box-shadow:rgba(0,0,0,0.1) 0 0 10px ;
  text-align:center ;
`

export const Container = styled.div`
  display: flex;
  flex-direction:column ;
  align-items:center ;
  min-height: 100vh;
`
