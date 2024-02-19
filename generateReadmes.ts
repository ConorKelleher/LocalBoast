import * as fs from "fs"
import {
  TableOfContents,
  generatePackageReadme,
  populateTemplate,
} from "./src/storybook_utils/helpers"
import { capitalize } from "./src"

const rootPath = "src"

const exportFolders = ["components", "hooks", "utils"]

const contents: TableOfContents = {}

exportFolders.forEach((exportFolder) => {
  const exportContents: string[] = []
  const exportFolderPath = `${rootPath}/${exportFolder}`
  const items = fs.readdirSync(exportFolderPath)
  items.forEach(async (item) => {
    const modulePath = `${exportFolderPath}/${item}`
    const configPath = `${modulePath}/stories/config.ts`
    if (fs.existsSync(configPath)) {
      exportContents.push(item)
      const { default: config } = await import(
        `${import.meta.url}/../${configPath}`
      )

      fs.writeFileSync(`${modulePath}/README.md`, generatePackageReadme(config))
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
