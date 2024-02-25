import type { Meta, StoryObj } from "@storybook/react"
import UseAnimationFramesDemo from "./UseAnimationFramesDemo"
import { merge } from "utils"
import { getStoryMeta } from "storybook_utils/helpers"
import storyConfig from "./config"

let meta = {
  title: "hooks/useAnimationFrames",
  tags: ["autodocs"],
} as Meta<typeof UseAnimationFramesDemo>

meta = merge(meta, getStoryMeta(storyConfig))
export default meta

type Story = StoryObj<typeof UseAnimationFramesDemo>

export const CodeBasic: Story = {
  args: {},
}
