import {
  useTruncate,
  USE_TRUNCATE_DEFAULT_OPTIONS,
  UseTruncateOptions,
} from "localboast/hooks/useTruncate"
import { merge } from "localboast/utils/objectHelpers"
import { ComponentPropsWithoutRef, ElementType } from "react"

export { TruncateFrom } from "localboast/hooks/useTruncate"

const DEFAULT_COMPONENT = "span"

export type TruncateProps<C extends ElementType = typeof DEFAULT_COMPONENT> = {
  /**
   * Raw string that is to be truncated. If you want to use a custom component, use the "component" prop. Don't pass it as a child
   */
  children: string
  /**
   * Custom component or tag name to use for text rendering. Must accept a ref prop
   */
  component?: C
} & UseTruncateOptions &
  ComponentPropsWithoutRef<C>

export const TRUNCATE_DEFAULT_PROPS = {
  ...USE_TRUNCATE_DEFAULT_OPTIONS,
  children: "",
  component: DEFAULT_COMPONENT,
}

export const Truncate = <C extends ElementType>({
  children,
  ...otherProps
}: TruncateProps<C>) => {
  const {
    ellipsis,
    threshold,
    from,
    startOffset,
    endOffset,
    disableNativeTruncate,
    disableMutation,
    disableWarnings,
    component: Component,
    ...otherMergedProps
  } = merge(TRUNCATE_DEFAULT_PROPS, otherProps)
  const isValidChildType = typeof children === "string"
  const [truncatedText, ref] = useTruncate(isValidChildType ? children : "", {
    ellipsis,
    threshold,
    from,
    startOffset,
    endOffset,
    disableNativeTruncate,
    disableMutation,
    disableWarnings,
  })

  if (!isValidChildType) {
    if (!disableWarnings) {
      console.warn(
        'Truncate must have a single string child. Exiting early and rendering children.\n\n(Hide this warning by passing "disableWarnings: true" as a prop',
      )
    }
    return children
  }

  return (
    <Component ref={ref} {...otherMergedProps}>
      {truncatedText}
    </Component>
  )
}

Truncate.defaultProps = TRUNCATE_DEFAULT_PROPS

export default Truncate
