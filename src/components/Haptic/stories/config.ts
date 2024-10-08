import { StoryConfig } from "storybook_utils/packageConstants"
import HapticDemoString from "./demos/HapticDemo?raw"

export default {
  description: `Component to add visual feedback to an interactive component. Child elements will scale up on hover/focus and pop smaller when clicked/pressed.`,
  alternative: "useHaptic",
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: () => {
            return HapticDemoString
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
      ref: {
        table: {
          disable: true,
        },
      },
      component: {
        control: {
          type: null,
        },
        table: {
          type: {
            summary: "React.ElementType",
            detail:
              "string | ComponentClass<any, any> | FunctionComponent<any>",
          },
        },
      },
    },
  },
  stories: [
    {
      name: "Haptic",
      args: {
        animateReturn: true,
        type: "pop",
      },
    },
  ],
} as StoryConfig
