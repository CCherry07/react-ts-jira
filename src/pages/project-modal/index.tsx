import React from 'react'
import {Drawer,Button } from 'antd'
import { useProjectsModal } from '../project-list/projectHooks'

export  function PageProjectModal() {
  const {projectCreateOpen , close} = useProjectsModal()
  return (
    <Drawer onClose={close} visible={projectCreateOpen} width={"100vw"}>
      PageProjectModal
      <Button onClick={close}></Button>
    </Drawer>
  )
}
