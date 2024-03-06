import { StoryConfig } from "storybook_utils/packageConstants"

export default {
  description: `Hook to handle creation and cancellation of a recursive requestAnimationFrame loop.

Call the returned \`start\` function and provide a callback (which fires every time a new animation frame is created, passing back the progress [0..1]), and the total duration to run for.<br>
An \`animating\` boolean is also returned to let the caller know if the animation is in progress.<br>
A \`stop\` function is also returned to allow manually cancelling the animation loop. This is not required in most cases however, since any time a new invocation of \`start\` happens, the previous loop will cancel. Similarly, when the component unmounts, any running animations will also be cancelled.`,
  metaMutations: {
    parameters: {
      docs: {
        source: {
          code: null,
        },
      },
    },
  },
} as StoryConfig
