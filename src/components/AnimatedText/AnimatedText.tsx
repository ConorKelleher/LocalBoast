import {
  USE_ANIMATED_TEXT_DEFAULT_OPTIONS,
  useAnimatedText,
  UseAnimatedTextOptions,
} from "localboast/hooks/useAnimatedText"
import { merge } from "localboast/utils/objectHelpers"
import { Children, PropsWithChildren, useMemo } from "react"

export interface AnimatedTextProps
  extends UseAnimatedTextOptions,
    PropsWithChildren {}

export const ANIMATED_TEXT_DEFAULT_PROPS = {
  ...USE_ANIMATED_TEXT_DEFAULT_OPTIONS,
  children: "" as AnimatedTextProps["children"],
}

export const AnimatedText = (props: AnimatedTextProps) => {
  const { children, ...otherProps } = merge(ANIMATED_TEXT_DEFAULT_PROPS, props)
  return useAnimatedText(
    useMemo(() => {
      let childText = ""
      switch (true) {
        case typeof children === "string":
          childText = children
          break
        case Array.isArray(children):
          childText = Children.map(children, (child) => child.toString()).join(
            "",
          )
          break
        default:
          if (Array.isArray(children)) {
            childText = children.map((child) => child.toString()).join("")
          }
          if (children?.toString) {
            childText = children?.toString()
          }
      }
      return childText
    }, [children]),
    otherProps,
  )
}

AnimatedText.defaultProps = ANIMATED_TEXT_DEFAULT_PROPS

export default AnimatedText
