import { useCallback, useEffect, useState } from "react"
import hljs from "./helpers/highlight.min"
import darkThemeURL from "./themes/codeDark.css?url"
import lightThemeURL from "./themes/codeLight.css?url"

export interface UseSyntaxHighlightingOptions {
  /**
   * Which of the default colour sets to use - light or dark
   * Note: this value is ignored if a custom "themeName" option is provided
   */
  colorScheme?: "light" | "dark"
  /**
   * File name of remote theme file to load (must be one of https://github.com/highlightjs/cdn-release/tree/main/build/styles - not including css extension - if the file is called test.min.css, call it "test.min")
   * Note: using the default theme or customising it yourself uses only local code. Including a value for this will result in a remote call to load in a css file
   * - this will likely cause issues with CORS etc and you may have to whitelist the cdn (https://cdnjs.cloudflare.com at the time of writing this)
   * Note: this value is ignored if a custom "themeURL" option is provided
   */
  themeName?: string
  /**
   * URL of a theme file compatible with highlight.js Can be any of https://github.com/highlightjs/cdn-release/tree/main/build/styles or any URI that resolves to a css file
   */
  themeURL?: string
}
export const DEFAULT_USE_SYNTAX_HIGHLIGHTING_OPTIONS: UseSyntaxHighlightingOptions =
  {
    colorScheme: "dark",
  }

const useSyntaxHighlighting = (options?: UseSyntaxHighlightingOptions) => {
  const [themeLoaded, setThemeLoaded] = useState(false)
  const mergedOptions = {
    ...DEFAULT_USE_SYNTAX_HIGHLIGHTING_OPTIONS,
    ...options,
  }

  useEffect(() => {
    const isExternalTheme = !!(
      mergedOptions.themeName || mergedOptions.themeURL
    )
    const themeId = `lb_syntax_theme_${
      mergedOptions.themeURL ||
      mergedOptions.colorScheme ||
      mergedOptions.themeName
    }`

    if (document.getElementById(themeId)) {
      // if script already in dom, return early
      setThemeLoaded(true)
      return
    }
    setThemeLoaded(false)
    const head = document.querySelector("head")!
    const link = document.createElement("link")

    link.setAttribute("id", themeId)

    link.setAttribute("rel", "stylesheet")
    let linkHref
    if (isExternalTheme) {
      linkHref =
        mergedOptions.themeURL ||
        `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${mergedOptions.themeName}.css`
    } else if (mergedOptions.colorScheme === "dark") {
      linkHref = darkThemeURL
    } else {
      linkHref = lightThemeURL
    }
    link.setAttribute("href", linkHref)
    link.onload = () => {
      setThemeLoaded(true)
    }
    head.appendChild(link)

    return () => {
      if (link.parentNode && head.contains(link)) {
        // Roundabout way of removing link that may no longer be on head tag (especially with hot-reloading)
        link.parentNode.removeChild(link)
      }
    }
  }, [
    mergedOptions?.themeName,
    mergedOptions?.themeURL,
    mergedOptions?.colorScheme,
  ])

  return {
    highlightAll: useCallback(() => {
      if (themeLoaded) {
        hljs.highlightAll()
      }
    }, [themeLoaded]),
    highlightElement: useCallback(
      (el: HTMLElement) => {
        if (themeLoaded) {
          hljs.highlightElement(el)
        }
      },
      [themeLoaded],
    ),
  }
}

export default useSyntaxHighlighting
