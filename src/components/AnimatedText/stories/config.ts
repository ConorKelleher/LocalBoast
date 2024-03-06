import { USE_ANIMATED_TEXT_DEFAULT_OPTIONS } from "localboast"
import { StoryConfig } from "storybook_utils/packageConstants.ts"
import { StoryContext } from "@storybook/react"
import AnimatedTextLoopingDemoString from "./demos/AnimatedTextLoopingDemo?raw"
import AnimatedTextButtonDemoString from "./demos/AnimatedTextButtonDemo?raw"

export default {
  description: `Component to allow per-character animating of any string. Simply pass in a string or array of strings as children and the component will pass through a self-updating string animating each character that is different from the previous children.`,
  alternative: "useAnimatedText",
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: (_: string, context: StoryContext) => {
            return context.allArgs.type === "button"
              ? AnimatedTextButtonDemoString
              : AnimatedTextLoopingDemoString
          },
        },
      },
    },
    argTypes: {
      msPerChar: {
        table: {
          defaultValue: {
            summary: USE_ANIMATED_TEXT_DEFAULT_OPTIONS.msPerChar,
          },
        },
      },
      children: {
        table: {
          type: { summary: "string | string[]" },
        },
      },
      type: {
        table: {
          disable: true,
        },
      },
    },
  },
  stories: [
    {
      name: "LoopingExample",
      args: {
        children:
          "My value is being changed from this string to an empty string for the sake of a demo. Try your own string!",
      },
    },
    {
      name: "PagedExample",
      args: {
        type: "button",
      },
    },
  ],
} as StoryConfig
