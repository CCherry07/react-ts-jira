import React from 'react'
import {Drawer,Button } from 'antd'
interface pageProjectModalProps{
  pageProjectModalOpen:boolean
  onClose:()=>void
}
export  function PageProjectModal({ pageProjectModalOpen,onClose  }:pageProjectModalProps) {
  return (
    <Drawer onClose={onClose} visible={pageProjectModalOpen} width={"100vw"}>
      PageProjectModal
      <Button onClick={onClose}></Button>
    </Drawer>
  )
}
