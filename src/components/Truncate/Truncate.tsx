import {
  useTruncate,
  USE_TRUNCATE_DEFAULT_OPTIONS,
  UseTruncateOptions,
} from "localboast/hooks/useTruncate"

export { TruncateFrom } from "localboast/hooks/useTruncate"

export interface TruncateProps extends UseTruncateOptions {
  /**
   * Raw string that is to be truncated. If you want to use a custom component, use the "tag" prop. Don't pass it as a child
   */
  children: string
  /**
   * Custom component or tag name to use for text rendering. Must accept a ref prop
   */
  tag?: React.ElementType | string
}

export const TRUNCATE_DEFAULT_PROPS = {
  ...USE_TRUNCATE_DEFAULT_OPTIONS,
  children: "",
  tag: "span",
}

export const Truncate = (props: TruncateProps) => {
  const { children: originalString, ...otherProps } = props
  const isValidChildType = typeof originalString === "string"
  const [truncatedText, ref] = useTruncate(
    isValidChildType ? originalString : "",
    otherProps,
  )

  if (!isValidChildType) {
    if (!props.disableWarnings) {
      console.warn(
        'Truncate must have a single string child. Exiting early and rendering children.\n\n(Hide this warning by passing "disableWarnings: true" as a prop',
      )
    }
    return originalString
  }

  const Tag = props.tag || "span"
  return <Tag ref={ref}>{truncatedText}</Tag>
}

Truncate.defaultProps = TRUNCATE_DEFAULT_PROPS

export default Truncate
