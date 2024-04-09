import { useUpdatingRef } from "localboast/hooks"
import {
  USE_SYNTAX_HIGHLIGHTING_DEFAULT_OPTIONS,
  useSyntaxHighlighting,
  UseSyntaxHighlightingOptions,
} from "localboast/hooks/useSyntaxHighlighting"
import { merge } from "localboast/utils"
import {
  ChangeEvent,
  Children,
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

const DEFAULT_COMPONENT = "code"

export type CodeProps<C extends ElementType = typeof DEFAULT_COMPONENT> = {
  /**
   * The actual text to apply syntax highlighting to. Must be an object or primitive that supports toString or an array of the same
   */
  children: PropsWithChildren["children"]
  /**
   * Custom component or tag name to use for wrapping the text (defaults to "code"). Must accept a ref prop
   */
  component?: C
  /**
   * Makes the code editable. This results in an overlayed, invisible text area that is actually interactible.
   * This component tracks edits through internal state and calls back with optional onChange prop to convey new value
   */
  editable?: boolean
  /**
   * Regular style object passed to the top-level `pre` tag in the component
   * Some styles are provided by default and can be overridden with this prop
   */
  style?: CSSProperties
  /**
   * Props passed straight to the <code> tag (or equivalent if a custom `component` prop is provided)
   * The style attribute will be merged with the existing one if provided. All other props will directly
   * overwrite anything else already provided by this component
   */
  codeProps?: Record<string, any>
  /**
   * Only called when editable is true. No local state used, relies on being fully controlled
   */
  onChange?: (newValue: string) => void
} & UseSyntaxHighlightingOptions &
  ComponentPropsWithoutRef<C>

export const CODE_DEFAULT_PROPS = {
  ...USE_SYNTAX_HIGHLIGHTING_DEFAULT_OPTIONS,
  component: DEFAULT_COMPONENT,
  editable: false,
  children: "",
  style: {},
  codeProps: {},
}

export const Code = <C extends ElementType>({
  children,
  ...otherProps
}: CodeProps<C>) => {
  const {
    style,
    component: CodeTag,
    codeProps,
    editable,
    onChange,
    ...syntaxHighlightingOptions
  } = merge(CODE_DEFAULT_PROPS, otherProps)
  const { highlightElement } = useSyntaxHighlighting(syntaxHighlightingOptions)
  const { colorScheme } = syntaxHighlightingOptions
  const codeContent = Array.isArray(children)
    ? Children.map(children, () => children.toString()).join("")
    : children?.toString()
  const onChangeRef = useUpdatingRef(onChange)
  const [dirtyCodeContent, setDirtyCodeContent] = useState(codeContent)
  const codeContentRef = useRef(codeContent)
  const dirtyCodeContentRef = useRef(dirtyCodeContent)
  const codeEl = useRef<HTMLElement>()

  // When props value changes, update our local state
  useEffect(() => {
    setDirtyCodeContent(codeContent)
    codeContentRef.current = codeContent
    dirtyCodeContentRef.current = codeContent
  }, [codeContent])

  // If we have an onChange callback and our dirty state differs from props
  useEffect(() => {
    if (
      onChangeRef.current &&
      codeContentRef.current !== dirtyCodeContentRef.current
    ) {
      onChangeRef.current(dirtyCodeContent)
    }
  }, [dirtyCodeContent, onChangeRef, codeContentRef])

  useEffect(() => {
    if (codeEl.current && !codeEl.current.classList.contains("hljs")) {
      highlightElement(codeEl.current)
    }
  }, [dirtyCodeContent, highlightElement])

  const onChangeEditableCode = useCallback((e: ChangeEvent) => {
    // @ts-ignore // todo fix this
    const newContent = e.target.value
    setDirtyCodeContent(newContent)
    dirtyCodeContentRef.current = newContent
  }, [])

  const updateCodeEl = (el: HTMLElement) => {
    if (el) {
      codeEl.current = el
      highlightElement(el)
    }
  }

  return (
    <pre style={{ position: "relative", overflow: "auto", ...style }}>
      <CodeTag
        ref={updateCodeEl}
        {...codeProps}
        style={{
          overflow: "visible",
          height: "100%",
          width: "100%",
          userSelect: editable ? "none" : undefined,
          ...codeProps?.style,
        }}
        className={codeProps?.className}
      >
        {dirtyCodeContent}
      </CodeTag>
      {!!editable && (
        <textarea
          value={dirtyCodeContent}
          onChange={onChangeEditableCode}
          style={{
            position: "absolute",
            inset: 0,
            resize: "none",
            width: "100%",
            height: "100%",
            padding: "1em", // todo - derive this automatically - it's theme specific
            backgroundColor: "transparent",
            overflow: "visible",
            border: "none",
            margin: 0,
            WebkitTextFillColor: "transparent",
            color: colorScheme === "dark" ? "white" : "black",
          }}
        />
      )}
    </pre>
  )
}

Code.defaultProps = CODE_DEFAULT_PROPS

export default Code
