export type ClipboardData = string | ClipboardItems

export const copyToClipboard = (data: ClipboardData) => {
  let writePromise
  if (typeof data === "string") {
    writePromise = navigator.clipboard.writeText(data)
  } else {
    writePromise = navigator.clipboard.write(data)
  }
  return writePromise
}

export default copyToClipboard
