import { useCallback, useEffect, useState } from "react"

/* <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script> */

/* <script>hljs.highlightAll();</script> */

const scriptId = "lb_syntax_highlight"

const useSyntaxHighlighting = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  useEffect(() => {
    if (document.getElementById(scriptId)) {
      // if script already in dom, return early
      return
    }
    const head = document.querySelector("head")!
    const script = document.createElement("script")
    const langScript = document.createElement("script")
    const link = document.createElement("link")

    script.setAttribute("id", scriptId)
    // todo - attach ids and check if they exist already

    link.setAttribute("rel", "stylesheet")
    link.setAttribute(
      "href",
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css",
    )
    script.setAttribute(
      "src",
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
    )
    script.onload = () => {
      setScriptLoaded(true)
    }
    langScript.setAttribute(
      "src",
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js",
    )

    head.appendChild(script)
    head.appendChild(link)
    // head.appendChild(langScript)

    return () => {
      head.removeChild(script)
      // head.removeChild(langScript)
      head.removeChild(link)
    }
  }, [])

  return {
    highlightAll: useCallback(() => {
      // todo actual typechecks
      // @ts-ignore
      if (window.hljs && scriptLoaded) {
        // @ts-ignore
        window.hljs.highlightAll()
      }
    }, [scriptLoaded]),
    highlightElement: useCallback(
      (el: HTMLElement) => {
        // @ts-ignore
        if (window.hljs && scriptLoaded) {
          // @ts-ignore
          window.hljs.highlightElement(el)
        }
      },
      [scriptLoaded],
    ),
  }
}

export default useSyntaxHighlighting
