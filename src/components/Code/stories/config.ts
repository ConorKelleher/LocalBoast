import { StoryConfig } from "storybook_utils/packageConstants"
import SampleCode from "./SampleCode"

export default {
  description: `Component to automatically syntax-highlight and preformat any code passed to it.
  
  Uses a local copy of [highlight.js](https://github.com/highlightjs/highlight.js) under the hood to perform the syntax highlighting.`,
  alternative: "useSyntaxHighlighting",
  stories: [
    {
      name: "CodeBasic",
      args: {
        children: SampleCode,
        colorScheme: "dark",
      },
    },
  ],
} as StoryConfig
