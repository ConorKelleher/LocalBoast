import {
  useSyntaxHighlighting,
  UseSyntaxHighlightingOptions,
} from "localboast/hooks/useSyntaxHighlighting"
import { useEffect, useRef } from "react"

export type CodeTagProps = Record<string, any>

export interface CodeProps extends UseSyntaxHighlightingOptions {
  children: string | string[]
  style?: React.CSSProperties
  codeProps?: CodeTagProps
  tag?: React.ElementType | string
}

export const Code = ({
  children,
  style,
  tag,
  codeProps,
  ...syntaxHighlightingOptions
}: CodeProps) => {
  const { highlightElement } = useSyntaxHighlighting(syntaxHighlightingOptions)
  const codeContent = Array.isArray(children) ? children.join("") : children
  const codeEl = useRef<HTMLElement>()

  useEffect(() => {
    if (codeEl.current) {
      codeEl.current.removeAttribute("data-highlighted")
      highlightElement(codeEl.current)
    }
  }, [codeContent, highlightElement])

  const updateCodeEl = (el: HTMLElement) => {
    if (el) {
      codeEl.current = el
      highlightElement(el)
    }
  }

  const CodeTag = tag || "code"

  return (
    <pre style={style}>
      <CodeTag
        ref={updateCodeEl}
        {...codeProps}
        className={codeProps?.className}
      >
        {children}
      </CodeTag>
    </pre>
  )
}

export default Code
