import { useCallback, useEffect, useRef, useState } from "react"
import darkThemeURL from "./themes/codeDark.css?url"
import lightThemeURL from "./themes/codeLight.css?url"

export interface UseSyntaxHighlightingOptions {
  /**
   * Optional language attribute to help syntax highlighting - hljs detects this automatically but specifying this may help with ambiguity and performance.
   */
  language?: string
  /**
   * Which of the default colour sets to use - light or dark
   * Note:
   * - This value is ignored if a custom "themeName" option is provided
   */
  colorScheme?: "light" | "dark"
  /**
   * File name of remote theme file to load (must be one of https://github.com/highlightjs/cdn-release/tree/main/build/styles - not including css extension - if the file is called test.min.css, call it "test.min")
   *
   * Note:
   * - Avoiding this prop and using only the default theme or customising it yourself uses only local code. Including a value for this prop will result in a remote call to load in a CSS file. This will likely cause issues with CORS etc and you may have to whitelist the cdn (https://cdnjs.cloudflare.com at the time of writing this)
   * - This value is ignored if a custom "themeURL" option is provided
   */
  themeName?: string
  /**
   * URL of a theme file compatible with highlight.js (see examples linked in description of themeName prop) or any URI that resolves to a css file
   * - Since this loads an external stylesheet, you'll likely run into issues with CORS. Any whitelisting concerns are yours to deal with
   */
  themeURL?: string
}
export const USE_SYNTAX_HIGHLIGHTING_DEFAULT_OPTIONS: UseSyntaxHighlightingOptions =
  {
    colorScheme: "dark",
  }

export const useSyntaxHighlighting = (
  options?: UseSyntaxHighlightingOptions,
) => {
  const [hljsLoaded, setHljsLoaded] = useState(false)
  const [themeLoaded, setThemeLoaded] = useState(false)
  const mergedOptions = {
    ...USE_SYNTAX_HIGHLIGHTING_DEFAULT_OPTIONS,
    ...options,
  }
  const hljsRef = useRef<typeof import("localboast/internal/highlight.min")>()

  // Dynamically import highlight.js on load to save on bundle size
  useEffect(() => {
    const importHljs = async () => {
      const { default: hljs } = await import(
        "localboast/internal/highlight.min"
      )
      hljsRef.current = hljs
      setHljsLoaded(true)
    }
    importHljs()
  }, [])

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
      if (hljsLoaded && themeLoaded && hljsRef.current) {
        hljsRef.current.highlightAll()
      }
    }, [hljsLoaded, themeLoaded]),
    highlightElement: useCallback(
      (el: HTMLElement) => {
        if (hljsLoaded && themeLoaded && hljsRef.current) {
          if (mergedOptions.language) {
            const currentClasses = Array.from(el.classList)
            const newClass = `language-${mergedOptions.language}`
            let hasClass = false
            currentClasses.forEach((currentClass) => {
              if (currentClass.startsWith("language-")) {
                if (currentClass === newClass) {
                  hasClass = true
                } else {
                  el.classList.remove(currentClass)
                }
              }
            })
            if (!hasClass) {
              el.classList.add(newClass)
            }
          }
          hljsRef.current.highlightElement(el)
        }
      },
      [hljsLoaded, themeLoaded, mergedOptions.language],
    ),
  }
}

export default useSyntaxHighlighting
