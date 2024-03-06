import { StoryConfig } from "storybook_utils/packageConstants"
import { StoryContext } from "@storybook/react"
import UseAnimatedTextButtonDemoString from "./demos/UseAnimatedTextButtonDemo?raw"
import UseAnimatedTextLoopingDemoString from "./demos/UseAnimatedTextLoopingDemo?raw"
import { USE_ANIMATED_TEXT_DEFAULT_OPTIONS } from "../useAnimatedText"

export default {
  alternative: "AnimatedText",
  description:
    "Hook to allow per-character animating of any string. Simply pass in a string and the component will return a self-updating string animating each character that is different from the previous provided value.",
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: (_: string, context: StoryContext) => {
            return context.allArgs.type === "button"
              ? UseAnimatedTextButtonDemoString
              : UseAnimatedTextLoopingDemoString
          },
        },
      },
    },
    argTypes: {
      options: {
        control: "object",
        table: {
          defaultValue: {
            summary: JSON.stringify(USE_ANIMATED_TEXT_DEFAULT_OPTIONS, null, 2),
          },
          type: {
            summary: "UseAnimatedTextOptions",
            detail: "{ msPerChar: number }",
          },
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
        text: "My value is being changed from this string to an empty string for the sake of a demo. Try your own string!",
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
