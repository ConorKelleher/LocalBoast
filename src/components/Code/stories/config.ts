import { StoryConfig } from "storybook_utils/packageConstants"
import { srcCode as sampleCodeSrc } from "./demos/CodeUsage"
import { CODE_DEFAULT_PROPS } from "../Code"

export default {
  description: `Component to automatically syntax-highlight and preformat any code passed to it.
<br>

Uses a local copy of [highlight.js](https://github.com/highlightjs/highlight.js) under the hood to perform the syntax highlighting.`,
  alternative: "useSyntaxHighlighting",
  metaMutations: {
    argTypes: {
      component: {
        control: {
          type: null,
        },
        table: {
          type: {
            summary: "React.ElementType",
            detail:
              "string | ComponentClass<any, any> | FunctionComponent<any>",
          },
        },
      },
      style: {
        control: {
          type: null,
        },
      },
      codeProps: {
        control: {
          type: null,
        },
      },
      onChange: {
        control: {
          type: null,
        },
      },
    },
  },
  stories: [
    {
      name: "CodeBasic",
      args: {
        children: sampleCodeSrc,
        editable: false,
        colorScheme: CODE_DEFAULT_PROPS.colorScheme,
      },
    },
    {
      name: "CodeEditable",
      args: {
        children: sampleCodeSrc,
        editable: true,
        colorScheme: CODE_DEFAULT_PROPS.colorScheme,
      },
    },
  ],
} as StoryConfig
