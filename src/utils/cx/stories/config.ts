import { StoryConfig } from "storybook_utils/packageConstants"

export default {
  description:
    "Function to concatenate one or more class names. Takes a variable number of arguments that are each either a string or an object, where the keys are conditional class names and the value's truthiness determines whether or not it should be concatenated.",
} as StoryConfig
