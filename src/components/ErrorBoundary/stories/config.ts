import { StoryConfig } from "storybook_utils/packageConstants.ts"

export default {
  description: `Basic wrapper component for creating a custom ErrorBoundary. Implements the required lifecycle methods and passes any encountered errors to the child component by invoking its children as a function.
  
  Takes an optional \`logger\` prop for immediately responding to the error, with the full component stack trace`,
} as StoryConfig
