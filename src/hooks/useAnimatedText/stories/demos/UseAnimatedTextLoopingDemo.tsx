import useAnimatedText, {
  UseAnimatedTextOptions,
} from "localboast/hooks/useAnimatedText"
import { useEffect, useState } from "react"

interface AnimatedTextLoopingDemoProps extends UseAnimatedTextOptions {
  children: string
}

const UseAnimatedTextLoopingDemo = ({
  children,
  ...otherProps
}: AnimatedTextLoopingDemoProps) => {
  const [clearString, setClearString] = useState(false)
  const stringToUse = clearString
    ? "My value has been changed. Try your own string!"
    : children
  const animatedString = useAnimatedText(stringToUse, otherProps)

  useEffect(() => {
    const interval = setInterval(() => {
      setClearString((clear) => !clear)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return animatedString
}

export default UseAnimatedTextLoopingDemo
