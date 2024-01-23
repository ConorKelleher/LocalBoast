import * as fs from "fs"
// import { createRequire } from "node:module"

const rootPath = "src"

const exportFolders = ["components", "hooks", "helpers"]

exportFolders.forEach((exportFolder) => {
  const exportFolderPath = `${rootPath}/${exportFolder}`
  fs.readdir(exportFolderPath, function (_, items) {
    items.forEach(async (item) => {
      const modulePath = `${exportFolderPath}/${item}`
      const generatorPath = `${modulePath}/stories/generateReadme.ts`
      if (fs.existsSync(generatorPath)) {
        const { default: generateReadme } = await import(
          `${import.meta.url}/../${generatorPath}`
        )

        fs.writeFileSync(`${modulePath}/README.md`, generateReadme())
      }
    })
  })
})
