const process = require("process")
const viteTsconfig = require("vite-tsconfig-paths")
const tsconfigPaths = viteTsconfig.default

const { mergeConfig } = require("vite")

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-deep-controls",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
}
export default config
