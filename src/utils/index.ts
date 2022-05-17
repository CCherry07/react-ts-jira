
const isVoid =(value:unknown)=>value === (undefined || null || "") ? true :false
export const clearObject=(target:{ [key:string]:any })=>{
    const resObj = {...target}
    Object.keys(resObj).forEach((key:string)=>{
      if (isVoid(resObj[key])) {
          delete resObj[key]
      }
    })
    return resObj
}
