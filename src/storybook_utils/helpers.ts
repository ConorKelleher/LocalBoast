import type { Meta } from "@storybook/react"
import {
  StoryConfig,
  StoryTypes,
  githubMainBranch,
  octocatURL,
  storybookPath,
} from "./packageConstants.ts" // keep extension, generateReadmes.ts needs it
import { merge } from "helpers/objectHelpers.ts"

export const parseUnquotedJSON = (unquoted: string) =>
  JSON.parse(unquoted.replace(/([A-Za-z]+):/g, '"$1":'))

// Used for linking from github readme to storybook
export const getStoryURL = (type: StoryTypes, name: string) =>
  `${storybookPath}?path=/docs/${type.toLocaleLowerCase()}s-${name.toLocaleLowerCase()}--docs`
export const getGithubStoryLink = (type: StoryTypes, name: string) =>
  `<h4>See [examples and full documentation](${getStoryURL(type, name)})</h4>`

// Used for linking from storybook story to github readme
export const getGithubURL = (type: StoryTypes, name: string) =>
  `${githubMainBranch}/src/${type.toLocaleLowerCase()}s/${name}`
export const getStoryGithubLink = (type: StoryTypes, name: string) =>
  `<h4>[<img src="${octocatURL}" height="25px" style="margin-bottom: -5px" />&nbsp;&nbsp;See this ${type}'s Source Code](${getGithubURL(
    type,
    name,
  )})</h4>`

const TITLE_PLACEHOLDER = "INSERT_TITLE_HERE"
const LINKS_PLACEHOLDER = "INSERT_LINKS_HERE"

const generateReadme = (
  config: StoryConfig,
) => `<!--- Auto-Generated Readme. Do not edit this. Instead edit the generateReadme function or the story's config.ts file --->
${TITLE_PLACEHOLDER}${config.description}
<br><br>

${LINKS_PLACEHOLDER}

<h3>Usage</h3>

\`\`\`javascript
${config.usage}
\`\`\``

export const generateStoryReadme = (storyConfig: StoryConfig) => {
  const readme = generateReadme(storyConfig)
  const links: string[] = []

  if (storyConfig.alternative) {
    const alternativeURL = getStoryURL(
      (storyConfig.type as StoryTypes) === StoryTypes.Component
        ? StoryTypes.Hook
        : StoryTypes.Component,
      storyConfig.alternative,
    )
    links.push(
      `See the ${
        storyConfig.type === StoryTypes.Hook ? "component" : "hook"
      }-based solution: [${storyConfig.alternative}](${alternativeURL})`,
    )
  }
  links.push(getStoryGithubLink(storyConfig.type, storyConfig.name))

  return (
    readme
      .replace(TITLE_PLACEHOLDER, "") // Storybook adds title by default, so can omit
      .replace(/<h3>/g, '<h3 style="margin-bottom: -15px">') // remove spacing from h3 tags in mdx
      .replace(/<br><br>/g, "<br>") // md seemingly needs more spacing than mdx :shrug:
      .replace(LINKS_PLACEHOLDER, links.join("<br><br>")) +
    `

    <h3 style="margin-bottom: -10px">Demo</h3>`
  )
}

export const generatePackageReadme = (storyConfig: StoryConfig) => {
  const readme = generateReadme(storyConfig)
  const links: string[] = []

  if (storyConfig.alternative) {
    const alternativeURL = getGithubURL(
      (storyConfig.type as StoryTypes) === StoryTypes.Component
        ? StoryTypes.Hook
        : StoryTypes.Component,
      storyConfig.alternative,
    )
    links.push(
      `See the ${
        storyConfig.type === StoryTypes.Hook ? "component" : "hook"
      }-based solution: [${storyConfig.alternative}](${alternativeURL})`,
    )
  }
  links.push(getGithubStoryLink(storyConfig.type, storyConfig.name))

  return readme
    .replace(TITLE_PLACEHOLDER, `<h1>${storyConfig.name}</h1>`)
    .replace(LINKS_PLACEHOLDER, links.join("<br>"))
}

// Returns a consistent Meta object type with common settings for structuring Storybook pages
export const getStoryMeta = (storyConfig: StoryConfig, mutations?: Meta) => {
  const base = {
    component: storyConfig.component,
    parameters: {
      layout: "centered",
      docs: {
        description: {
          component: generateStoryReadme(storyConfig),
        },
      },
      deepControls: { enabled: true },
    },
    tags: ["autodocs"],
  }
  if (mutations) {
    return merge(base, mutations)
  }
  return base
}
