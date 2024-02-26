import { StoryConfig } from "storybook_utils/packageConstants"

export default {
  description: `Hook to handle creation and cancellation of a recursive requestAnimationFrame loop.
Call the returned "start" function and provide a callback (which fires every time a new animation frame is created, passing back the progress [0..1]), and the total duration to run for`,
} as StoryConfig
