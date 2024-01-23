import { StoryTypes, githubMainBranch, octocatURL } from "./packageConstants.ts" // keep extension, generateReadmes.ts needs it

export const parseUnquotedJSON = (unquoted: string) =>
  JSON.parse(unquoted.replace(/([A-Za-z]+):/g, '"$1":'))

export const getStoryGithubLink = (type: StoryTypes, name: string) =>
  `<h4>[<img src="${octocatURL}" height="25px" style="margin-bottom: -5px" />&nbsp;&nbsp;See this ${type}'s Source Code](${githubMainBranch}/src/${type.toLocaleLowerCase()}s/${name})</h4>`
