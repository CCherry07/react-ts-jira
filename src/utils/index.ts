
const isVoid = (value: unknown) => value === (undefined || null || "") ? true : false
export const clearObject = (target: { [key: string]: any }) => {
  const resObj = { ...target }
  Object.keys(resObj).forEach((key: string) => {
    if (isVoid(resObj[key])) {
      delete resObj[key]
    }
  })
  return resObj
}

export const resetRouter = () => {
  window.location.href = window.location.origin
}

export const subset = <
  O extends Record<string, unknown>,
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};
