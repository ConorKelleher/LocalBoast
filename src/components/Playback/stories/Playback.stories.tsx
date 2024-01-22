import type { Meta, StoryObj } from "@storybook/react"
import Playback from ".."

const meta = {
  title: "Components/Playback",
  component: Playback,
  parameters: {
    layout: "centered",
    // deepControls: { enabled: true },
    docs: {
      description: {
        component: `
Component to allow animated playback of pieces of text.<br>
Useful for code demos and tutorials.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          resize: "both",
          display: "block",
          border: "solid 1px",
          borderRadius: 5,
          overflow: "auto",
          width: 500,
        }}
      >
        <div style={{ height: "100%", width: "100%" }}>
          <Story />
        </div>
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Playback>

export default meta
type Story = StoryObj<typeof Playback>

export const PlaybackJS: Story = {
  args: {},
}
