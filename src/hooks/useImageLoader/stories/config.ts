import {
  brokenBase64ImageURL,
  smileyBase64ImageURL,
} from "localboast/storybook_utils/constants"
import { StoryConfig } from "storybook_utils/packageConstants.ts"

export default {
  description: `Hook to programmatically load a provided image src and find whether the image is still loading and if it's failed to load.`,
  alternative: "ImageWithFallback",
  stories: [
    { name: "Working", args: { src: smileyBase64ImageURL, fallbackSrc: "" } },
    { name: "Broken", args: { src: brokenBase64ImageURL, fallbackSrc: "" } },
    {
      name: "BrokenWithFallback",
      args: { src: brokenBase64ImageURL, fallbackSrc: smileyBase64ImageURL },
    },
  ],
} as StoryConfig
