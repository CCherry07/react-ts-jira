import  { useRoutes } from 'react-router-dom'
import { LoginPage } from '../pages/login'
interface routeType{
  path:string,
  auth:boolean,
  component:()=>JSX.Element
}
const routes:routeType[] = [
  {
    path:"/",
    auth:false,
    component:LoginPage
  },
]


const Router = () => useRoutes(routes)
export default Router
