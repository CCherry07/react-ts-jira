import React from 'react';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }


const res:string = await (async function test(){
  return await Promise.resolve("asda")
})()
