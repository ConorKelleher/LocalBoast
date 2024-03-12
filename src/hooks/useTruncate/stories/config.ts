// These imports must be relative - top level generateReadmes.ts file imports this directly and can't resolve absolute imports
import { StoryContext } from "@storybook/react"
import { TRUNCATE_STORIES } from "localboast/components/Truncate/stories/config"
import { prettyPrint } from "localboast/utils"
import { StoryConfig } from "storybook_utils/packageConstants.ts"

export default {
  name: "useTruncate",
  description: `Hook to allow any string rendered in the DOM to be programmatically truncated  with customizable truncation position, offsets and ellipsis.<br>
In most cases, the component-based solution (which simply wraps a call to this hook) is probably preferred.`,
  alternative: "Truncate",
  imports: 'import { TruncateFrom } from "localboast/hooks/useTruncate"',
  stories: TRUNCATE_STORIES.map(({ args, ...otherStoryData }) => {
    const { children, ...otherArgs } = args
    return {
      ...otherStoryData,
      args: {
        ...otherArgs,
        originalString: children,
      },
    }
  }),
  metaMutations: {
    parameters: {
      docs: {
        source: {
          transform: (_originalString: string, context: StoryContext) => {
            const { originalString, ...otherArgs } = context.allArgs
            return `const originalString = "${originalString}";

const [truncatedString, ref] = useTruncate(originalString, ${prettyPrint(
              otherArgs,
              { singleLine: true },
            )})
            
// Attach ref returned from hook to the tag that wraps the string (so it can know available area)
return <div ref={ref}>{truncatedString}</div>`.replace(", { }", "")
          },
        },
      },
    },
  },
} as StoryConfig
