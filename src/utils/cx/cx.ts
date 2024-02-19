export type CSArg = string | { [key: string]: boolean }
const cx = (...args: CSArg[]) => {
  const classes: string[] = []
  args.forEach((arg) => {
    if (typeof arg === "string") {
      classes.push(arg)
    } else {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key)
        }
      })
    }
  })
  return classes.join(" ")
}
export default cx
