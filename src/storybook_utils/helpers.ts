import {
  StoryTypes,
  githubMainBranch,
  octocatURL,
  storybookPath,
} from "./packageConstants.ts" // keep extension, generateReadmes.ts needs it

export const parseUnquotedJSON = (unquoted: string) =>
  JSON.parse(unquoted.replace(/([A-Za-z]+):/g, '"$1":'))

// Used for linking from github readme to storybook
export const getStoryURL = (type: StoryTypes, name: string) =>
  `${storybookPath}?path=/docs/${type.toLocaleLowerCase()}s-${name.toLocaleLowerCase()}`
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
