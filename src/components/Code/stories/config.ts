import { StoryTypes, StoryConfig } from "storybook_utils/packageConstants"
import Code from ".."

export default {
  type: StoryTypes.Component,
  name: "Code",
  description: `Component to automatically syntax-highlight and preformat any code passed to it.
  
  Uses a local copy of [highlight.js](https://github.com/highlightjs/highlight.js) under the hood to perform the syntax highlighting.`,
  alternative: "useSyntaxHighlighting",
  component: Code,
  usage: `import { Code } from "localboast"

const srcCode = \`
import React from "react"

const MyComponent = () => {
  return "This is a nice component, innit?
}

export default MyComponent
\`

const SomeComponent = () => {
  return (
    <Code>
      {srcCode}
    </Code>
  )
}`,
} as StoryConfig
