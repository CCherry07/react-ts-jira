
export const isFalsy=(target:unknown)=> target === 0 ? false :!target

export const clearObject=(target:any)=>{
    const resObj = {...target}
    Object.keys(resObj).forEach((key:string)=>{
      if (isFalsy(resObj[key])) {
          delete resObj[key]
      }
    })
    return resObj
}
