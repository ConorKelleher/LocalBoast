import {
  DocsContainer as BaseContainer,
  DocsContainerProps,
} from "@storybook/blocks"
import React, { FC, PropsWithChildren, useEffect, useState } from "react"
import { DARK_THEME, LIGHT_THEME } from "./Themes"

export const DocsContainer: FC<PropsWithChildren<DocsContainerProps>> = ({
  children,
  context,
}) => {
  const [isDark, setDark] = useState(true)

  useEffect(() => {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-mantine-color-scheme"
        ) {
          const colorScheme = (mutation.target as HTMLElement).getAttribute(
            "data-mantine-color-scheme",
          )
          if (colorScheme) setDark(colorScheme === "dark")
        }
      })
    })

    observer.observe(document.querySelector("html")!, {
      attributes: true, //configure it to listen to attribute changes
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <BaseContainer theme={isDark ? DARK_THEME : LIGHT_THEME} context={context}>
      {children}
    </BaseContainer>
  )
}
