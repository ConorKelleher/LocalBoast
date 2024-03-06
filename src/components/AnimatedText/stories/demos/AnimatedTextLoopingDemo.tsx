import AnimatedText, {
  AnimatedTextProps,
} from "localboast/components/AnimatedText"
import { useEffect, useState } from "react"

const AnimatedTextLoopingDemo = ({
  children,
  ...otherProps
}: AnimatedTextProps) => {
  const [clearString, setClearString] = useState(false)
  const stringToUse = clearString
    ? "My value has been changed. Try your own string!"
    : children

  useEffect(() => {
    const interval = setInterval(() => {
      setClearString((clear) => !clear)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <AnimatedText {...otherProps}>{stringToUse}</AnimatedText>
}

export default AnimatedTextLoopingDemo
