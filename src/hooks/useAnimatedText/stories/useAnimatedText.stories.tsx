import type { Meta, StoryContext, StoryObj } from "@storybook/react"
import {
  getButtonAnimatedTextDemoString,
  getLoopingAnimatedTextDemoString,
} from "components/AnimatedText/stories/demos/AnimatedTextDemo"
import UseAnimatedTextDemo from "./UseAnimatedTextDemo"
import { DEFAULT_OPTIONS as USE_ANIMATED_TEXT_DEFAULT_OPTIONS } from ".."
import { getStoryGithubLink } from "storybook_utils/helpers"
import { StoryTypes } from "storybook_utils/packageConstants"

const meta = {
  title: "hooks/useAnimatedText",
  component: UseAnimatedTextDemo,
  parameters: {
    deepControls: { enabled: true },
    docs: {
      description: {
        component: `Hook to allow per-character animating of any string. Simply pass in a string and the component will return a self-updating string animating each character that is different from the previous provided value.

See the component-based solution: <strong>[AnimatedText](/docs/components-AnimatedText--docs)</strong>.

${getStoryGithubLink(StoryTypes.Hook, "useAnimatedText")}`,
      },
      source: {
        transform: (_: string, context: StoryContext) => {
          return context.allArgs.type === "button"
            ? getButtonAnimatedTextDemoString(true)
            : getLoopingAnimatedTextDemoString(true)
        },
      },
    },
  },
  argTypes: {
    text: {
      table: {
        type: { summary: "string" },
      },
    },
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
  tags: ["autodocs"],
} satisfies Meta<typeof UseAnimatedTextDemo>

export default meta
type Story = StoryObj<typeof UseAnimatedTextDemo>

export const LoopingExample: Story = {
  args: {
    text: "My value is being changed from this string to an empty string for the sake of a demo. Try your own string!",
  },
}
export const PagedExample: Story = {
  args: {
    type: "button",
  },
}
