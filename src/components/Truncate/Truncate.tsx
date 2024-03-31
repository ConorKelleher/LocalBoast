import {
  useTruncate,
  USE_TRUNCATE_DEFAULT_OPTIONS,
  UseTruncateOptions,
} from "localboast/hooks/useTruncate"
import { merge } from "localboast/utils/objectHelpers"

export { TruncateFrom } from "localboast/hooks/useTruncate"

export interface TruncateProps
  extends UseTruncateOptions,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
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
  const {
    children: originalString,
    ellipsis,
    threshold,
    from,
    startOffset,
    endOffset,
    disableNativeTruncate,
    disableMutation,
    disableWarnings,
    ...otherProps
  } = merge(TRUNCATE_DEFAULT_PROPS, props)
  const isValidChildType = typeof originalString === "string"
  const [truncatedText, ref] = useTruncate(
    isValidChildType ? originalString : "",
    {
      ellipsis,
      threshold,
      from,
      startOffset,
      endOffset,
      disableNativeTruncate,
      disableMutation,
      disableWarnings,
    },
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
  return (
    <Tag ref={ref} {...otherProps}>
      {truncatedText}
    </Tag>
  )
}

Truncate.defaultProps = TRUNCATE_DEFAULT_PROPS

export default Truncate
