import React from 'react'
import { Link ,Routes,Route ,Navigate} from 'react-router-dom'
import {PageEpic} from './epic'
import {PageSignboard} from './signboard'
export const PageProject =()=>{
  return (
    <div>
      <Link to={"signboard"}>看板</Link>
      <Link to={"epic"}>任务栏</Link>
        <Routes>
          <Route path='signboard' element={<PageSignboard></PageSignboard>}></Route>
          <Route path='epic' element={<PageEpic></PageEpic>}></Route>
          <Route path="*" element={<Navigate to={ window.location.pathname + "/signboard" } replace={true}/>} />
        </Routes>
    </div>
  )
}


