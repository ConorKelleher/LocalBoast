import { StoryConfig } from "storybook_utils/packageConstants.ts"
import { DEFAULT_OPTIONS as USE_ANIMATED_TEXT_DEFAULT_OPTIONS } from "hooks/useAnimatedText"
import {
  getButtonAnimatedTextDemoString,
  getLoopingAnimatedTextDemoString,
} from "./demos/AnimatedTextDemo"
import { StoryContext } from "@storybook/react"

export default {
  description: `Component to allow per-character animating of any string. Simply pass in a string or array of strings as children and the component will pass through a self-updating string animating each character that is different from the previous children.`,
  alternative: "useAnimatedText",
  forceDemoComponent: true,
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: (_: string, context: StoryContext) => {
            return context.allArgs.type === "button"
              ? getButtonAnimatedTextDemoString(false)
              : getLoopingAnimatedTextDemoString(false)
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
