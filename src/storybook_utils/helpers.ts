import * as fs from "fs"
import {
  StoryConfig,
  StorySpec,
  StoryTypes,
  githubMainBranch,
  octocatURL,
  storybookPath,
} from "./packageConstants"
import { capitalize, isFirstLetterUppercase } from "localboast/utils"
import storiesTemplate from "./storiesTemplate"
import readmeTemplate from "./readmeTemplate"

// Used for linking from github readme to storybook
export const getStoryURL = (type: StoryTypes, name?: string) =>
  `${storybookPath}?path=/docs/${type.toLocaleLowerCase()}s${
    name ? `-${name.toLocaleLowerCase()}` : ""
  }--docs`
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

const DIRECT_REFERENCE_START = "__DR_START__"
const DIRECT_REFERENCE_END = "__DR_END__"
// Takes a string and returns a special escaped string.
// This helps remove the leading and trailing " chars from a string
// e.g const myArgsText = stringifyArgs({ component: directReference("DemoComponent") })
// => myArgsText === "{ component: DemoComponent }"
export const directReference = (value: string) => {
  return `${DIRECT_REFERENCE_START}${value}${DIRECT_REFERENCE_END}`
}

export const stringifyArgs = (args: object) => {
  const unsanitizedString = JSON.stringify(args, null, 2)
  return unsanitizedString
    .replace(RegExp(`["']${DIRECT_REFERENCE_START}`, "g"), "")
    .replace(RegExp(`${DIRECT_REFERENCE_END}["']`, "g"), "")
}

export const TITLE_PLACEHOLDER = "INSERT_TITLE_HERE"
export const STORY_TITLE_PLACEHOLDER = "INSERT_STORY_TITLE_HERE"
export const DESCRIPTION_PLACEHOLDER = "INSERT_DESCRIPTION_HERE"
export const LINKS_PLACEHOLDER = "INSERT_LINKS_HERE"
export const BANNER_PLACEHOLDER = "INSERT_BANNER_HERE"
export const CONTENTS_PLACEHOLDER = "INSERT_CONTENTS_HERE"
export const SHIELDS_PLACEHOLDER = "INSERT_SHIELDS_HERE"
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

const getShouldUseDedicatedDemoComponent = (
  elementName: string,
  storiesPath: string,
) => {
  if (getElementTypeFromName(elementName) !== StoryTypes.Component) {
    return true
  }
  const relativeDemoPath = getDemoComponentImportPath(elementName)
  const absoluteDemoPath = `${storiesPath}/../${relativeDemoPath}.tsx`
  return fs.existsSync(absoluteDemoPath)
}

const getDemoComponentName = (
  elementName: string,
  shouldUseDedicatedDemoComponent: boolean = true,
) =>
  shouldUseDedicatedDemoComponent
    ? `${capitalize(elementName)}Demo`
    : elementName
const getDemoComponentImportPath = (elementName: string) =>
  `stories/demos/${getDemoComponentName(elementName, true)}`

// jsx cli doesn't play nicely with the ?raw loader. Have to import it at runtime in order to get the correct usage file's source code
export const getRuntimeConfig = (
  elementName: string,
  storyConfig: StoryConfig,
  storiesPath: string,
) => {
  const runtimeConfig = {
    ...storyConfig,
  }
  let usageFilePath
  const dedicatedUsagePath = `${storiesPath}/demos/${capitalize(
    elementName,
  )}Usage.tsx`
  if (fs.existsSync(dedicatedUsagePath)) {
    usageFilePath = dedicatedUsagePath
  } else {
    const relativeImportPath = getDemoComponentImportPath(elementName)
    if (relativeImportPath) {
      // Don't use direct component source code as usage. If no dedicated demo, just skip
      usageFilePath = `${storiesPath}/../${relativeImportPath}.tsx`
    }
  }

  if (usageFilePath && fs.existsSync(usageFilePath)) {
    runtimeConfig.usage = fs.readFileSync(usageFilePath, {
      encoding: "utf8",
      flag: "r",
    })
  }
  return runtimeConfig
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
      .replaceAll(DESCRIPTION_PLACEHOLDER, storyConfig.description || "")
      .replaceAll(
        USAGE_TITLE_PLACEHOLDER,
        storyConfig.usage ? "<h3>Usage</h3>" : "",
      )
      .replaceAll(USAGE_PLACEHOLDER, storyConfig.usage || "")
      .replace(/<h3>/g, '<h3 style="margin-bottom: -15px">') // remove spacing from h3 tags in mdx
      .replace(/<br><br>/g, "<br>") // md seemingly needs more spacing than mdx :shrug:
      .replaceAll(LINKS_PLACEHOLDER, links.join("<br><br>"))
      .replaceAll(HOW_TO_INSTALL_PLACEHOLDER, "<br>")
      .replaceAll("`", "\\`")
      .replaceAll("${", "\\${") + `<h3 style="margin-bottom: -10px">Demo</h3>`
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
      .replaceAll(USAGE_TITLE_PLACEHOLDER, storyConfig.usage ? "## Usage" : "")
      .replaceAll(USAGE_PLACEHOLDER, storyConfig.usage || "")
      .replaceAll(LINKS_PLACEHOLDER, links.join("<br>")) + FOOTER_PLACEHOLDER
  )
}

export const getStoryStories = (storySpecs?: StorySpec[]) =>
  storySpecs
    ? storySpecs
        .map(
          (storySpec) => `export const ${storySpec.name}: Story = {
  args: ${stringifyArgs(storySpec.args).replace(/\n/g, "\n  ")}
}`,
        )
        .join("\n")
    : `export const Default: Story = { args: {} }`

export const generateStoryFile = (
  elementName: string,
  storyConfig: StoryConfig,
  storiesPath: string,
) => {
  const storyType = getElementTypeFromName(elementName)
  const shouldUseDedicatedDemoComponent = getShouldUseDedicatedDemoComponent(
    elementName,
    storiesPath,
  )
  let relativeImportPath = ".."
  const demoComponentName = getDemoComponentName(
    elementName,
    shouldUseDedicatedDemoComponent,
  )
  if (shouldUseDedicatedDemoComponent) {
    const demoComponentImportPathFromExportFolder =
      getDemoComponentImportPath(elementName)
    relativeImportPath = `../${demoComponentImportPathFromExportFolder}`
  }
  let demoComponentImport = `import ${demoComponentName} from "${relativeImportPath}"`
  if (storyConfig.imports) {
    demoComponentImport += `\n${storyConfig.imports}`
  }
  return storiesTemplate
    .replaceAll(
      STORY_TITLE_PLACEHOLDER,
      `${capitalize(storyType)}s/${elementName}`,
    )
    .replaceAll(COMPONENT_IMPORT_PLACEHOLDER, demoComponentImport)
    .replaceAll(COMPONENT_PLACEHOLDER, demoComponentName)
    .replaceAll(
      DESCRIPTION_PLACEHOLDER,
      generateStoryReadme(elementName, storyConfig),
    )
    .replaceAll(STORIES_PLACEHOLDER, getStoryStories(storyConfig.stories))
}

export const getMarkdownComment = () =>
  "<!--- Autogenerated Readme. Do not edit. Edit the templates or config files instead. --->\n"

export const getStoryComment = (
  title: string,
) => `{/* Autogenerated Readme. Do not edit. Edit the templates or config files instead. */}
import { Meta } from "@storybook/blocks"

<Meta title="${title}" />
`

export const getMarkdownHowToInstall =
  () => `Install the entire module as a dependency from npm as normal:

\`\`\`bash
npm i localboast
# or
yarn add localboast
\`\`\`

**Note**: As this library is intended to be all-inclusive, it has no dependencies other than peer-dependencies of \`react\` and \`react-dom\`. This means it should have minimal compatibility issues with any app.`

export const getMarkdownFooter = () => `## Docs/Example

This library is developed and documented through storybook.
A static build of this storybook app can be found at https://LocalBoast.com/docs
(Note: that entire website is built as a showcase of sorts for the LocalBoast library, but the \`/docs\` route is a direct embed of the full storybook app).

While I intend on keeping the above public build up to date with the functionality of this library, I cannot guarantee that it'll always be up to date. If you need docs for the latest and greatest, you can run it locally by cloning this repository and running \`yarn run storybook\`

## Live Development

In an attempt to be somewhat unique, the development of this project is largely happening live on stream over on [Twitch](https://twitch.tv/localboast) or on [YouTube Live](http://youtube.com/channel/UCt-IaL4qQsOU6_rbS7zky1Q/live). A record of all past live streams and other video documentation can also be found at the above YouTube channel.

## Donations

I'm working on this instead of having a job that pays me. So for the time being, I'm going to be funded through generosity alone. If you're feeling generous, here are some links:

- [Buy me a Coffee](https://localboast.com/kofi) (Ko-fi - will show up on stream if I'm live)
- [Patreon](https://localboast.com/patreon)

## License

MIT © [ConorKelleher](https://github/com/ConorKelleher)`

export const getMarkdownShields =
  () => `[![npm](https://img.shields.io/npm/dm/localboast?label=Downloads)](https://www.npmjs.com/package/localboast)
  [![Ko-Fi](https://shields.io/badge/kofi-Buy_Me_a_Coffee-ffffff?logo=ko-fi&label=)](http://ko-fi.com/localboast)
  [![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dlocalboast%26type%3Dpatrons&style=flat&label=Patreon)](https://patreon.com/localboast)
  [![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCt-IaL4qQsOU6_rbS7zky1Q?label=Subscribers&style=flat&logo=Youtube)](http://youtube.com/channel/UCt-IaL4qQsOU6_rbS7zky1Q/live)
  [![Twitch Channel](https://img.shields.io/twitch/status/localboast?label=Twitch&style=flat&logo=Twitch)](http://twitch.tv/localboast)`

export const getMarkdownBanner = () =>
  `![BannerImage](assets/icons/ColourSolidWide.jpeg)`

export type TableOfContents = { [exportKey: string]: string[] }

export const getMarkdownTableOfContents = (
  contentsData: string[] | TableOfContents,
  parentPath?: string,
  isStorybook?: boolean,
) => {
  let table = ""

  if (Array.isArray(contentsData)) {
    console.log("is array. ContentsData: ", JSON.stringify(contentsData))
    table = contentsData
      .map((title) => {
        const pathConnector = isStorybook ? "-" : "/"
        const fileName = (parentPath ? parentPath + pathConnector : "") + title
        let filePath
        if (isStorybook) {
          if (parentPath) {
            filePath = getStoryURL(parentPath as StoryTypes, title)
          } else {
            filePath = getStoryURL(title as StoryTypes)
          }
        } else {
          filePath = fileName
        }

        return `- ${parentPath ? "####" : "###"} [${title}](${filePath})`
      })
      .join("\n")
  } else {
    table = Object.entries(contentsData)
      .map(([exportName, contents]) => {
        const storyType = exportName.slice(0, -1) as StoryTypes
        const exportFilePath = isStorybook
          ? getStoryURL(storyType)
          : `src/${exportName.toLocaleLowerCase()}`
        return `- ### [${exportName}](${exportFilePath})\n${getMarkdownTableOfContents(
          contents,
          isStorybook ? storyType : exportFilePath,
          isStorybook,
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
  storyTitle?: string,
  storyType?: StoryTypes,
) => {
  const isStorybook = !!storyTitle
  let populatedTemplate = template
    .replaceAll(HOW_TO_INSTALL_PLACEHOLDER, getMarkdownHowToInstall())
    .replaceAll(
      CONTENTS_PLACEHOLDER,
      contentsData
        ? getMarkdownTableOfContents(contentsData, storyType, isStorybook)
        : "",
    )
    .replaceAll(SHIELDS_PLACEHOLDER, getMarkdownShields())
    .replaceAll(BANNER_PLACEHOLDER, isStorybook ? "" : getMarkdownBanner())
    .replaceAll(FOOTER_PLACEHOLDER, getMarkdownFooter())
  if (isStorybook) {
    populatedTemplate = populatedTemplate.replace(
      /^/,
      getStoryComment(storyTitle),
    )
  } else {
    populatedTemplate = populatedTemplate.replace(/^/, getMarkdownComment())
  }
  return populatedTemplate
}
