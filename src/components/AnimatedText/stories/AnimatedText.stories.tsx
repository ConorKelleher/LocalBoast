import type { Meta, StoryContext, StoryObj } from "@storybook/react"
import AnimatedTextDemo, {
  getButtonAnimatedTextDemoString,
  getLoopingAnimatedTextDemoString,
} from "./AnimatedTextDemo"
import { DEFAULT_OPTIONS as USE_ANIMATED_TEXT_DEFAULT_OPTIONS } from "hooks/useAnimatedText"
import { getStoryGithubLink } from "storybook_utils/helpers"
import { StoryTypes } from "storybook_utils/packageConstants"

const meta = {
  title: "Components/AnimatedText",
  component: AnimatedTextDemo,
  parameters: {
    // layout: "centered",
    docs: {
      description: {
        component: `Component to allow per-character animating of any string. Simply pass in a string or array of strings as children and the component will pass through a self-updating string animating each character that is different from the previous children.

See the hook-based solution: <strong>[useAnimatedText](/docs/hooks-useAnimatedText--docs)</strong>.
<br><br>
${getStoryGithubLink(StoryTypes.Component, "AnimatedText")}`,
      },
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
} satisfies Meta<typeof AnimatedTextDemo>

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
