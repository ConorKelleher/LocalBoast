import React from "react"
import type { Preview } from "@storybook/react"
import { MantineProvider, MantineThemeOverride } from "@mantine/core"
import { appTheme } from "../../localboast.com/src/theme"

import "@mantine/core/styles.css"
import "./storybook.css"

import { DARK_THEME } from "./Themes"
import { DocsContainer } from "./DocsContainer"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    deepControls: { enabled: true },
    layout: "fullscreen",
    docs: {
      theme: DARK_THEME,
      container: DocsContainer,
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider theme={appTheme as MantineThemeOverride}>
        <Story />
      </MantineProvider>
    ),
  ],
}

export default preview
