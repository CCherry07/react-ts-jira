import React from 'react'
import {Drawer,Button } from 'antd'
import { useDispatch,useSelector} from 'react-redux'
import {projectListSliceAction, selectProjectModalOpen} from '../project-list/projectList.slice'
interface pageProjectModalProps{
  pageProjectModalOpen:boolean
  onClose:()=>void
}
export  function PageProjectModal() {
  const dispatch = useDispatch()
  const projectModalOpen = useSelector(selectProjectModalOpen)
  return (
    <Drawer onClose={dispatch(projectListSliceAction.closeProjectModal)} visible={projectModalOpen} width={"100vw"}>
      PageProjectModal
      <Button onClick={dispatch(projectListSliceAction.closeProjectModal)}></Button>
    </Drawer>
  )
}
