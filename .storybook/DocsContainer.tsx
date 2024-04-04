import {
  DocsContainer as BaseContainer,
  DocsContainerProps,
} from "@storybook/blocks"
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react"
import { DARK_THEME, LIGHT_THEME } from "./Themes"
import useMutationObserver from "../src/hooks/useMutationObserver"

export const DocsContainer: FC<PropsWithChildren<DocsContainerProps>> = ({
  children,
  context,
}) => {
  const [isDark, setDark] = useState(true)

  useMutationObserver(
    useMemo(() => document.querySelector("html")!, []),
    (mutations) => {
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
    },
    {
      attributes: true, //configure it to listen to attribute changes
    },
  )

  return (
    <BaseContainer theme={isDark ? DARK_THEME : LIGHT_THEME} context={context}>
      {children}
    </BaseContainer>
  )
}
