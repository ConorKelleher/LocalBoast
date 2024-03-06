import * as fs from "fs"
import {
  TableOfContents,
  generatePackageReadme,
  generateStoryFile,
  getRuntimeConfig,
  populateTemplate,
} from "../src/storybook_utils/helpers"
import { capitalize } from "../src"

const rootPath = "src"

const exportFolders = ["components", "hooks", "utils"]

const contents: TableOfContents = {}

exportFolders.forEach((exportFolder) => {
  const exportContents: string[] = []
  const exportFolderPath = `${rootPath}/${exportFolder}`
  const items = fs.readdirSync(exportFolderPath)
  items.forEach(async (item) => {
    const modulePath = `${exportFolderPath}/${item}`
    const storiesPath = `${modulePath}/stories`
    const configPath = `${storiesPath}/config.ts`
    if (fs.existsSync(configPath)) {
      exportContents.push(item)
      const { default: configWithoutUsage } = await import(
        `${import.meta.url}/../../${configPath}`
      )
      const config = getRuntimeConfig(item, configWithoutUsage, storiesPath)

      fs.writeFileSync(
        `${modulePath}/README.md`,
        populateTemplate(generatePackageReadme(item, config)),
      )
      fs.writeFileSync(
        `${modulePath}/stories/${item}.stories.tsx`,
        generateStoryFile(item, config, storiesPath),
      )
    }
  })
  const templatePath = `${exportFolderPath}/README_TEMPLATE.md`
  if (fs.existsSync(templatePath)) {
    const exportTemplate = fs.readFileSync(templatePath, {
      encoding: "utf8",
      flag: "r",
    })

    fs.writeFileSync(
      `${exportFolderPath}/README.md`,
      populateTemplate(exportTemplate, exportContents),
    )
  }
  contents[capitalize(exportFolder)] = exportContents
})

const rootTemplate = fs.readFileSync("./README_TEMPLATE.md", {
  encoding: "utf8",
  flag: "r",
})

fs.writeFileSync(`./README.md`, populateTemplate(rootTemplate, contents))

console.log("Done generating readmes")
