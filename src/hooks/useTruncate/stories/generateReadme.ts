// These imports must be relative - top level generateReadmes.ts file imports this directly and can't resolve absolute imports
import {
  getGithubStoryLink,
  getGithubURL,
  getStoryGithubLink,
  getStoryURL,
} from "../../../storybook_utils/helpers.ts"
import { StoryTypes } from "../../../storybook_utils/packageConstants.ts"

const type: StoryTypes = StoryTypes.Hook
const name = "useTruncate"
const description = `Hook to allow any string rendered in the DOM to be programmatically truncated  with customizable truncation position, offsets and ellipsis.<br>
In most cases, the component-based solution (which simply wraps a call to this hook) is probably preferred.`
const alternative = "Truncate"

const generateReadme = () => `
<h1>${name}</h1>
${description}
<br><br>

INSERT_LINKS_HERE

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
  const links = []

  if (alternative) {
    const alternativeURL = getStoryURL(
      (type as StoryTypes) === StoryTypes.Component
        ? StoryTypes.Hook
        : StoryTypes.Component,
      alternative,
    )
    const alternativeHref = `See the ${
      type === StoryTypes.Hook ? "component" : "hook"
    }-based solution: [${alternative}](${alternativeURL})`
    links.push(alternativeHref)
  }
  links.push(getStoryGithubLink(type, name))

  return readme
    .replace(/.+\n/, "") // remove title from story since it's already there
    .replace(/<h3>/g, '<h3 style="margin-bottom: -15px">') // remove spacing from h3 tags in mdx
    .replace(/<br><br>/g, "<br>") // md seemingly needs more spacing than mdx :shrug:
    .replace("INSERT_LINKS_HERE", links.join("<br><br>"))
}

export const generatePackageReadme = () => {
  const readme = generateReadme()
  const links = []

  if (alternative) {
    const alternativeURL = getGithubURL(
      (type as StoryTypes) === StoryTypes.Component
        ? StoryTypes.Hook
        : StoryTypes.Component,
      alternative,
    )
    const alternativeHref = `See the ${
      type === StoryTypes.Hook ? "component" : "hook"
    }-based solution: [${alternative}](${alternativeURL})`
    links.push(alternativeHref)
  }
  links.push(getGithubStoryLink(type, name))

  return readme.replace("INSERT_LINKS_HERE", links.join("<br>"))
}
