const ESCAPE_MAPPING: Record<string, string> = {
  '"': "&quot;",
  "&": "&amp;",
  "'": "&#39;",
  "<": "&lt;",
  ">": "&gt;",
}
const CHARS_TO_ESCAPE = Object.keys(ESCAPE_MAPPING)

const escapeHTML = (input: string) => {
  let output = input
  CHARS_TO_ESCAPE.forEach((charToEscape) => {
    output = output.replaceAll(charToEscape, ESCAPE_MAPPING[charToEscape])
  })
  return output
}

export default escapeHTML
