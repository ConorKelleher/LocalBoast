import type { Meta, StoryContext, StoryObj } from "@storybook/react"
import { UseTruncateDemo, renderDemoArgs } from "./UseTruncateDemo"
import { TruncateFrom } from ".."
import { default as storyConfig } from "./config"
import { getStoryMeta } from "storybook_utils/helpers"
import { merge } from "utils"

let meta = {
  title: "Hooks/useTruncate",
  parameters: {
    docs: {
      source: {
        transform: (_: string, context: StoryContext) => {
          return renderDemoArgs(context.allArgs)
        },
      },
    },
  },
  tags: ["autodocs"],
} as Meta<typeof UseTruncateDemo>

meta = merge(meta, getStoryMeta(storyConfig))
export default meta

type Story = StoryObj<typeof UseTruncateDemo>

const fullString =
  "This is my full, unadulterated string. This is sadly too long for the container"

export const TruncateEnd: Story = {
  args: {
    originalString: fullString,
  },
}
export const TruncateMiddle: Story = {
  args: {
    originalString: fullString,
    options: { from: TruncateFrom.Middle },
  },
}
export const TruncateStart: Story = {
  args: {
    originalString: fullString,
    options: { from: TruncateFrom.Start },
  },
}

export const TruncateOffsetStart: Story = {
  args: {
    originalString: fullString,
    options: { from: TruncateFrom.Start, startOffset: 4 },
  },
}
export const TruncateOffsetEnd: Story = {
  args: {
    originalString: fullString,
    options: { from: TruncateFrom.End, endOffset: 4 },
  },
}
export const TruncateMiddleOffsetEnd: Story = {
  args: {
    originalString: fullString,
    options: { from: TruncateFrom.Middle, endOffset: 15 },
  },
}
export const TruncateMiddleOffsetStart: Story = {
  args: {
    originalString: fullString,
    options: { from: TruncateFrom.Middle, startOffset: 15 },
  },
}
