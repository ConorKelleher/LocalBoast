import type { Meta, StoryObj } from "@storybook/react"
import Code from ".."
// import SampleCode from "./SampleCode"

const meta = {
  title: "Components/Code",
  component: Code,
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
} satisfies Meta<typeof Code>

export default meta
type Story = StoryObj<typeof Code>

export const CodeBasic: Story = {
  args: {
    // children: SampleCode,
    children: "import React from 'react'; const thing = true;",
  },
}
