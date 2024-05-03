import { StoryConfig } from "storybook_utils/packageConstants"
import UseHapticDemoString from "./demos/UseHapticDemo?raw"

export default {
  description: `Hook to add visual feedback to an interactive component. Returns styles and event handlers to provide to an element to allow scaling up on hover/focus and a "pop" smaller when clicked/pressed.`,
  alternative: "Haptic",
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: () => {
            return UseHapticDemoString
          },
        },
      },
    },
    argTypes: {
      delayedOnClick: {
        control: {
          type: null,
        },
      },
    },
  },
  stories: [
    {
      name: "UseHaptic",
      args: {
        animateReturn: true,
        type: "pop",
      },
    },
  ],
} as StoryConfig
