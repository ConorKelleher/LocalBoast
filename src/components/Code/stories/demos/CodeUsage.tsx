import Code from "localboast/components/Code"

export const srcCode = `import React from "react"

const MyComponent = () => {
  return "This is a nice component, innit?"
}
`

export const SomeComponent = () => {
  return <Code>{srcCode}</Code>
}
