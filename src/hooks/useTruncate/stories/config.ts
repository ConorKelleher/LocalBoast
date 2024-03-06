// These imports must be relative - top level generateReadmes.ts file imports this directly and can't resolve absolute imports
import { StoryConfig } from "storybook_utils/packageConstants.ts"

export default {
  name: "useTruncate",
  description: `Hook to allow any string rendered in the DOM to be programmatically truncated  with customizable truncation position, offsets and ellipsis.<br>
In most cases, the component-based solution (which simply wraps a call to this hook) is probably preferred.`,
  alternative: "Truncate",
} as StoryConfig
