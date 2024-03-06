import { StoryConfig } from "storybook_utils/packageConstants"
import { srcCode as sampleCodeSrc } from "./demos/CodeUsage"

export default {
  description: `Component to automatically syntax-highlight and preformat any code passed to it.
<br>

Uses a local copy of [highlight.js](https://github.com/highlightjs/highlight.js) under the hood to perform the syntax highlighting.`,
  alternative: "useSyntaxHighlighting",
  stories: [
    {
      name: "CodeBasic",
      args: {
        children: sampleCodeSrc,
        editable: false,
      },
    },
    {
      name: "CodeEditable",
      args: {
        children: sampleCodeSrc,
        editable: true,
      },
    },
    {
      name: "CodeCustomThemeName",
      args: {
        children: sampleCodeSrc,
        themeName: "monokai-sublime.min",
      },
    },
  ],
} as StoryConfig
