import React,{ useState } from 'react';
import { LoginPage } from '../pages/login';
import { RegisterPage } from './register'

import { Card , Button} from 'antd'
export const UnauthApp =()=>{
  const [ isRegister , setRegister] = useState( false)
  return (
    <div>
      <Card>
        <div style={{ display:"flex" ,flexDirection:"column", justifyContent:"center" ,alignItems:"center"}}>
        { isRegister? <RegisterPage></RegisterPage> : <LoginPage></LoginPage> }
        <Button style={{ margin:" .625rem 0"}} onClick={()=>setRegister( !isRegister ) }> 切换 { isRegister ? "登陆" : "注册" }</Button>
        </div>
      </Card>
    </div>
  )
}
