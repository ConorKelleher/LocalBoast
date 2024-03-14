import React from "react"
import type { Preview } from "@storybook/react"
import { addons } from "@storybook/manager-api"
import { MantineProvider, MantineProviderProps } from "@mantine/core"
import { appTheme } from "../../localboast.com/src/theme"

import "@mantine/core/styles.css"
import "./storybook.css"

import { DARK_THEME } from "./Themes"

const ThemeChangeProvider = (Story: () => React.ReactElement) => {
  // todo - actually do something with url themes or system themes or something
  // useEffect(() => {
  //   debugger
  //   addons.setConfig({
  //     theme: DARK_THEME,
  //   })
  // }, [])

  return <Story />
}
addons.setConfig({
  theme: DARK_THEME,
})

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
  },
}

export const decorators = [
  ThemeChangeProvider,
  (Story) => (
    <MantineProvider theme={appTheme as MantineProviderProps["theme"]}>
      <Story />
    </MantineProvider>
  ),
]

export default preview
