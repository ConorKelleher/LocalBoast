import { useAnimatedText, UseAnimatedTextOptions } from "localboast"
import { PropsWithChildren, useMemo } from "react"

export interface AnimatedTextProps
  extends PropsWithChildren,
    UseAnimatedTextOptions {}

export const AnimatedText = ({
  children,
  ...otherProps
}: AnimatedTextProps) => {
  return useAnimatedText(
    useMemo(() => {
      let childText = ""
      switch (true) {
        case typeof children === "string":
          childText = children as "string"
          break
        case Array.isArray(children) &&
          children.every((child) => typeof child === "string"):
          childText = (children as string[]).join("")
          break
        default:
          console.warn(
            "Children of AnimatedText must be string or array of strings. Returning children without modification",
          )
      }
      return childText
    }, [children]),
    otherProps,
  )
}

export default AnimatedText
