import type { Meta, StoryContext, StoryObj } from "@storybook/react"
import AnimatedTextDemo, {
  getButtonAnimatedTextDemoString,
  getLoopingAnimatedTextDemoString,
} from "./AnimatedTextDemo"
import { DEFAULT_OPTIONS as USE_ANIMATED_TEXT_DEFAULT_OPTIONS } from "hooks/useAnimatedText"
import { getStoryMeta } from "storybook_utils/helpers"
import { merge } from "utils"
import storyConfig from "./config"

let meta = {
  title: "Components/AnimatedText",
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
        defaultValue: { summary: USE_ANIMATED_TEXT_DEFAULT_OPTIONS.msPerChar },
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
  tags: ["autodocs"],
} as Meta<typeof AnimatedTextDemo>

meta = merge(meta, getStoryMeta(storyConfig))
export default meta

type Story = StoryObj<typeof AnimatedTextDemo>

export const LoopingExample: Story = {
  args: {
    children:
      "My value is being changed from this string to an empty string for the sake of a demo. Try your own string!",
  },
}
export const PagedExample: Story = {
  args: {
    type: "button",
  },
}
