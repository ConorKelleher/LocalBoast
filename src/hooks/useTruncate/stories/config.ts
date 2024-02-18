// These imports must be relative - top level generateReadmes.ts file imports this directly and can't resolve absolute imports
import {
  StoryTypes,
  StoryConfig,
} from "../../../storybook_utils/packageConstants.ts"
import { UseTruncateDemo } from "./UseTruncateDemo.tsx"

export default {
  type: StoryTypes.Hook,
  name: "useTruncate",
  description: `Hook to allow any string rendered in the DOM to be programmatically truncated  with customizable truncation position, offsets and ellipsis.<br>
In most cases, the component-based solution (which simply wraps a call to this hook) is probably preferred.`,
  alternative: "Truncate",
  component: UseTruncateDemo,
  usage: `import { useTruncate } from "localboast"

const SomeComponent = () => {
  const [middleTruncatedText, ref] = useTruncate("This is my string that will be truncated", { from: TruncateFrom.Middle })

  return (
    <div ref={ref}>
      {middleTruncatedText}
    </div>
  )
}`,
} as StoryConfig
