// https://stackoverflow.com/a/19842865
const generateRandomId = (prefix?: string | number) => {
  const id = Math.random().toString(16).slice(2)
  return prefix === undefined ? id : `${prefix}_${id}`
}

export default generateRandomId
