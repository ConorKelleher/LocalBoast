// These imports must be relative - top level generateReadmes.ts file imports this directly and can't resolve absolute imports
import { getStoryGithubLink } from "../../../storybook_utils/helpers.ts"
import { StoryTypes } from "../../../storybook_utils/packageConstants.ts"

const generateReadme = () => `
<h1>useTruncate</h1>
Hook to allow any string rendered in the DOM to be programmatically truncated  with customizable truncation position, offsets and ellipsis.<br>
In most cases, the component-based solution (which simply wraps a call to this hook) is probably preferred.
<br><br>

See the component based solution: [Truncate](/docs/components-truncate--docs).
<br>

${getStoryGithubLink(StoryTypes.Hook, "useTruncate")}

<h3>Usage</h3>

\`\`\`javascript
import { useTruncate } from "localboast"

const SomeComponent = () => {
  const [middleTruncatedText, ref] = useTruncate("This is my string that will be truncated", { from: TruncateFrom.Middle })

  return (
    <div ref={ref}>
      {middleTruncatedText}
    </div>
  )
}
\`\`\``

export const generateStoryReadme = () => {
  const readme = generateReadme()
  return readme
    .replace(/.+\n/, "") // remove title from story since it's already there
    .replace(/<h3>/g, '<h3 style="margin-bottom: -15px">') // remove spacing from h3 tags in mdx
    .replace(/<br><br>/g, "<br>") // md seemingly needs more spacing than mdx :shrug:
}

export default generateReadme
