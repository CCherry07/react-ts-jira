import styled from "@emotion/styled";
type flexDirection = "row"|"row-reverse"|"column"|"column-reverse"
type justifyContent = "center" | "space-around"|"space-between"|"space-evenly"
type alignItems = "center"
interface propsType{
  flexDirection?:flexDirection
  alignItems?:alignItems
  justifyContent?:justifyContent
  marginRight?:number
  marginBottom?:number
}
export const Row = styled.div<propsType>`
  display:flex;
  flex-direction:${(props)=>props.flexDirection?props.flexDirection : "row"} ;
  align-items: center;
  justify-content: ${(props)=>props.justifyContent?props.justifyContent : "space-between"} ;
  > * {
    margin: 0 0; 
    margin-right: ${(props)=>props.marginRight?props.marginRight + "rem":0};
    margin-bottom: ${(props)=>props.marginBottom?props.marginBottom + "rem":0};
  }
`
