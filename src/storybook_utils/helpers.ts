import {
  StoryConfig,
  StorySpec,
  StoryTypes,
  githubMainBranch,
  octocatURL,
  storybookPath,
} from "./packageConstants.ts" // keep extension, generateReadmes.ts needs it
import { capitalize, isFirstLetterUppercase } from "utils"
import storiesTemplate from "./storiesTemplate.txt?raw"
import readmeTemplate from "./readmeTemplate.txt?raw"

export const parseUnquotedJSON = (unquoted: string) =>
  JSON.parse(unquoted.replaceAll(/([A-Za-z]+):/g, '"$1":'))

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

export const TITLE_PLACEHOLDER = "INSERT_TITLE_HERE"
export const STORY_TITLE_PLACEHOLDER = "INSERT_STORY_TITLE_HERE"
export const DESCRIPTION_PLACEHOLDER = "INSERT_DESCRIPTION_HERE"
export const LINKS_PLACEHOLDER = "INSERT_LINKS_HERE"
export const CONTENTS_PLACEHOLDER = "INSERT_CONTENTS_HERE"
export const HOW_TO_INSTALL_PLACEHOLDER = "INSERT_HOW_TO_INSTALL_HERE"
export const USAGE_TITLE_PLACEHOLDER = "INSERT_USAGE_TITLE_HERE"
export const USAGE_PLACEHOLDER = "INSERT_USAGE_HERE"
export const FOOTER_PLACEHOLDER = "INSERT_FOOTER_HERE"
export const COMPONENT_IMPORT_PLACEHOLDER = "INSERT_COMPONENT_IMPORT_HERE"
export const COMPONENT_PLACEHOLDER = "INSERT_COMPONENT_HERE"
export const STORIES_PLACEHOLDER = "INSERT_STORIES_HERE"

const getElementTypeFromName = (elementName: string): StoryTypes => {
  let type
  switch (true) {
    case isFirstLetterUppercase(elementName):
      type = StoryTypes.Component
      break
    case elementName.startsWith("use") &&
      isFirstLetterUppercase(elementName.slice(3)):
      type = StoryTypes.Hook
      break
    default:
      type = StoryTypes.Util
  }
  return type
}

export const generateStoryReadme = (
  elementName: string,
  storyConfig: StoryConfig,
) => {
  const links: string[] = []
  const storyType = getElementTypeFromName(elementName)

  if (storyConfig.alternative) {
    const alternativeURL = getStoryURL(
      storyType === StoryTypes.Component
        ? StoryTypes.Hook
        : StoryTypes.Component,
      storyConfig.alternative,
    )
    links.push(
      `See the ${
        storyType === StoryTypes.Hook ? "component" : "hook"
      }-based solution: [${storyConfig.alternative}](${alternativeURL})`,
    )
  }
  links.push(getStoryGithubLink(storyType, elementName))

  return (
    readmeTemplate
      .replaceAll(TITLE_PLACEHOLDER, "") // Storybook adds title by default, so can omit
      .replaceAll(DESCRIPTION_PLACEHOLDER, storyConfig.description)
      .replaceAll(USAGE_TITLE_PLACEHOLDER, "<h3>Usage</h3>")
      .replaceAll(USAGE_PLACEHOLDER, storyConfig.usage)
      .replaceAll(/<h3>/g, '<h3 style="margin-bottom: -15px">') // remove spacing from h3 tags in mdx
      .replaceAll(/<br><br>/g, "<br>") // md seemingly needs more spacing than mdx :shrug:
      .replaceAll(LINKS_PLACEHOLDER, links.join("<br><br>"))
      .replaceAll(HOW_TO_INSTALL_PLACEHOLDER, "<br>") +
    `

    <h3 style="margin-bottom: -10px">Demo</h3>`
  )
}

export const generatePackageReadme = (
  elementName: string,
  storyConfig: StoryConfig,
) => {
  const links: string[] = []
  const storyType = getElementTypeFromName(elementName)

  if (storyConfig.alternative) {
    const alternativeURL = getGithubURL(
      storyType === StoryTypes.Component
        ? StoryTypes.Hook
        : StoryTypes.Component,
      storyConfig.alternative,
    )
    links.push(
      `See the ${
        storyType === StoryTypes.Hook ? "component" : "hook"
      }-based solution: [${storyConfig.alternative}](${alternativeURL})`,
    )
  }
  links.push(getGithubStoryLink(storyType, elementName))

  return (
    readmeTemplate
      .replaceAll(TITLE_PLACEHOLDER, `<h1>${elementName}</h1>`)
      .replaceAll(DESCRIPTION_PLACEHOLDER, storyConfig.description)
      .replaceAll(USAGE_TITLE_PLACEHOLDER, "## Usage")
      .replaceAll(USAGE_PLACEHOLDER, storyConfig.usage)
      .replaceAll(LINKS_PLACEHOLDER, links.join("<br>")) + FOOTER_PLACEHOLDER
  )
}

export const getStoryStories = (storySpecs: StorySpec[]) =>
  storySpecs
    .map(
      (storySpec) => `export const ${storySpec.name} = {
  args: ${JSON.stringify(storySpec.args, null, 2)}
}`,
    )
    .join("\n")

export const generateStoryFile = (
  elementName: string,
  storyConfig: StoryConfig,
) => {
  const storyType = getElementTypeFromName(elementName)
  const demoComponentName =
    storyType === StoryTypes.Component
      ? elementName
      : `${capitalize(elementName)}Demo`
  const demoComponentImportPath =
    storyType === StoryTypes.Component ? ".." : `./demos/${demoComponentName}`
  const demoComponentImport = `import ${demoComponentName} from "${demoComponentImportPath}"`
  return storiesTemplate
    .replaceAll(STORY_TITLE_PLACEHOLDER, `${storyType}/${elementName}`)
    .replaceAll(COMPONENT_IMPORT_PLACEHOLDER, demoComponentImport)
    .replaceAll(COMPONENT_PLACEHOLDER, demoComponentName)
    .replaceAll(DESCRIPTION_PLACEHOLDER, storyConfig.description)
    .replaceAll(STORIES_PLACEHOLDER, getStoryStories(storyConfig.stories))
}

export const getMarkdownComment = () =>
  "<!--- Autogenerated Readme. Do not edit. Edit the templates or config files instead. --->\n"

export const getMarkdownHowToInstall =
  () => `Install the entire module as a dependency from npm as normal:

\`\`\`bash
npm i localboast
\`\`\`

or

\`\`\`bash
yarn add localboast
\`\`\`

**Note**: As this library is intended to be all-inclusive, it has no dependencies other than peer-dependencies of \`react\` and \`react-dom\`. This means it should have minimal compatibility issues with any app.`

export const getMarkdownFooter = () => `## Docs/Example

This library is developed and documented through storybook.
A static build of this storybook app can be found at https://LocalBoast.com/docs
(Note: that entire website is built as a showcase of sorts for the LocalBoast library, but the \`/docs\` route is a direct embed of the full storybook app).

While I intend on keeping the above public build up to date with the functionality of this library, I cannot guarantee that it'll always be up to date. If you need docs for the latest and greatest, you can run it locally by cloning this repository and running \`yarn run storybook\`

## Live Development

In an attempt to be somewhat unique, the development of this project is largely happening live on stream over on [Twitch](https://twitch.tv/localboast1) or on [YouTube Live](http://youtube.com/channel/UCt-IaL4qQsOU6_rbS7zky1Q/live). A record of all past live streams and other video documentation can also be found at the above YouTube channel.

## Donations

I'm working on this instead of having a job that pays me. So for the time being, I'm going to be funded through generosity alone. If you're feeling generous, here are some links:

- Buy me a Coffee (Ko-fi - will show up on stream if I'm live): https://ko-fi.com/localboast
- Patreon: https://patreon.com/LocalBoast

## License

MIT © [ConorKelleher](https://github/com/ConorKelleher)`

export type TableOfContents = { [exportKey: string]: string[] }

export const getMarkdownTableOfContents = (
  contentsData: string[] | TableOfContents,
  parentPath?: string,
) => {
  let table = ""

  if (Array.isArray(contentsData)) {
    console.log("is array. ContentsData: ", JSON.stringify(contentsData))
    table = contentsData
      .map(
        (title) =>
          `- [${title}](${parentPath ? parentPath + "/" : ""}${title})`,
      )
      .join("\n")
  } else {
    table = Object.entries(contentsData)
      .map(([exportName, contents]) => {
        const exportFilePath = `src/${exportName.toLocaleLowerCase()}`
        return `- [${exportName}](${exportFilePath})\n${getMarkdownTableOfContents(
          contents,
          exportFilePath,
        )
          .split("\n")
          .map((entry) => `\t${entry}`)
          .join("\n")}`
      })
      .join("\n")
  }

  return table
}

export const populateTemplate = (
  template: string,
  contentsData?: string[] | TableOfContents,
) =>
  template
    .replaceAll(/^/, getMarkdownComment())
    .replaceAll(HOW_TO_INSTALL_PLACEHOLDER, getMarkdownHowToInstall())
    .replaceAll(
      CONTENTS_PLACEHOLDER,
      contentsData ? getMarkdownTableOfContents(contentsData) : "",
    )
    .replaceAll(FOOTER_PLACEHOLDER, getMarkdownFooter())
