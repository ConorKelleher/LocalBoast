import React, { useEffect, useRef, useState } from "react"
import {
  IconApps,
  IconFileTypeDoc,
  IconFishHook,
  IconTools,
} from "@tabler/icons-react"
import useUpdatingRef from "../src/hooks/useUpdatingRef"
import { addons } from "@storybook/addons"
import { API_HashEntry } from "@storybook/types"
import LinkTo from "@storybook/addon-links/react"
import { linkTo } from "@storybook/addon-links"
import { DARK_THEME } from "./Themes"

const ICON_LOOKUP = {
  welcome: <div style={{ fontSize: 26, margin: "-5px -5px 0px -5px" }}>👋</div>,
  components: <IconApps height={18} />,
  hooks: <IconFishHook height={18} />,
  utils: <IconTools height={18} />,
  docs: <IconFileTypeDoc height={18} />,
}

const getIsRoot = (item: API_HashEntry) =>
  item.type.toLocaleLowerCase() === "root"

const getQueryParamsForItem = (item: API_HashEntry) =>
  getIsRoot(item)
    ? // ? linkTo(item.name)
      `?path=/docs/${item.name.toLocaleLowerCase()}--docs`
    : undefined

const getIsActiveCategory = (item: API_HashEntry, search: string) =>
  // getIsRoot(item) && `/${search}`.includes(getQueryParamsForItem(item)!)
  getIsRoot(item) && search.includes(item.id.replace(/--docs$/, ""))

const LabelRenderer = ({ item }: { item: API_HashEntry }) => {
  const [isActiveCategory, setIsActiveCategory] = useState(() =>
    getIsActiveCategory(item, window.location.search),
  )
  const lastUrlSearchRef = useUpdatingRef(window.location.search)
  const isActiveCategoryRef = useUpdatingRef(isActiveCategory)
  const itemRef = useUpdatingRef(item)
  const labelIcon = ICON_LOOKUP[item.name.toLocaleLowerCase()] ||
    ("parent" in item &&
      item.parent &&
      ICON_LOOKUP[item.parent.toLocaleLowerCase()]) || <div>•</div>
  const isRoot = getIsRoot(item)
  const isUnmountedRef = useRef(false)
  const newQuery = getQueryParamsForItem(item)

  useEffect(() => {
    const windowChangeListener = (url: Parameters<History["pushState"]>[2]) => {
      if (!url || isUnmountedRef.current) {
        return
      }
      const newSearch = typeof url === "string" ? url : url.search
      if (lastUrlSearchRef.current !== newSearch) {
        lastUrlSearchRef.current = newSearch
        const newIsActiveCategory = getIsActiveCategory(
          itemRef.current,
          newSearch,
        )
        if (newIsActiveCategory !== isActiveCategoryRef.current) {
          setIsActiveCategory(newIsActiveCategory)
        }
      }
    }
    const originalPushState = window.history.pushState
    window.history.pushState = function (state, _unused, url) {
      if (
        "onpushstate" in history &&
        typeof history.onpushstate == "function"
      ) {
        history.onpushstate({ state: state })
      }

      windowChangeListener(url)

      return originalPushState.apply(history, arguments)
    }

    return () => {
      // multiple async rewrites can leave us with some lingering listeners. Track mount state to allow early exits
      isUnmountedRef.current = true
      window.history.pushState = originalPushState
    }
  }, [])

  const LabelComponent = isRoot ? "a" : "div"
  const labelProps = {
    style: {
      display: "flex",
      textDecoration: "none",
      color: isActiveCategory ? "rgb(2, 156, 253)" : "inherit",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginLeft: "parent" in item && item.parent && 18,
    },
  }
  if (isRoot) {
    // @ts-ignore
    // labelProps.story = item.name
    // @ts-ignore
    // labelProps.onClick = linkTo(item.name)
    labelProps.href = `/${newQuery}`
  }
  return (
    // @ts-ignore
    <LabelComponent {...labelProps}>
      {labelIcon}
      {/* <h3>{!isFolderReadme ? JSON.stringify(item) : item.name}</h3> */}
      <h3>{item.name}</h3>
    </LabelComponent>
  )
}

LabelRenderer.displayName = "LabelRenderer"

addons.setConfig({
  theme: DARK_THEME,
  showToolbar: false,
  enableShortcuts: false,
  initialActive: "canvas",
  showRoots: false,
  sidebar: {
    collapsedRoots: ["components", "hooks", "utils"],
    renderLabel: (item: API_HashEntry) => <LabelRenderer item={item} />,
  },
  // managerHead: (head) => `
  //   ${head}
  //   <style>a[id$="--docs-only"] { display: none; }</style>
  // `,
})
