import React, { ReactNode } from "react"
import {Draggable, DraggableProps, Droppable, DroppableProps, DroppableProvided, DroppableProvidedProps } from "react-beautiful-dnd"
type Dropprops = Omit<DroppableProps,"children"> & {children:ReactNode}
export const Drop = ({children,...props}:Dropprops)=>{
  return <Droppable {...props}>
    {
     (provided)=>{
       if (React.isValidElement(children)) {
         return React.cloneElement(children,
          {...provided.droppableProps,
          ref:provided.innerRef,
          provided
        })
       }
       return (<div></div>)
     } 
    }
  </Droppable>
}
type DropChildProps = Partial<{ 
  provided:DroppableProvided
} & DroppableProvidedProps & React.HTMLAttributes<HTMLDivElement>>
export const DropChild = React.forwardRef<HTMLDivElement,DropChildProps>(({children,...props} , ref)=>{
  return <div ref={ref} {...props}>
  {children}
   {props.provided?.placeholder}
  </div>
})

type DragProps = Omit<DraggableProps,"children"> & {children:ReactNode}
export const Drag = ({children,...props}:DragProps)=>{
  return (<Draggable {...props}>
    {
      provided=>{
        if (React.isValidElement(children)) {
          return React.cloneElement(children,{
            ...provided.dragHandleProps,
            ...provided.draggableProps,
            ref:provided.innerRef
          })
        }
      return <div></div>
      }
    }
  </Draggable>)
}
