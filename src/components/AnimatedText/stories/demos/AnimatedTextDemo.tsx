import { useEffect, useState } from "react"
import { AnimatedText, AnimatedTextProps, useAnimatedText } from "localboast"
import { Stack } from "@mantine/core"

export type AnimatedTextDemoType = "button" | "plain"
interface AnimatedTextDemoProps extends AnimatedTextProps {
  type: AnimatedTextDemoType
}

const sampleStrings = [
  "Test",
  "Test: this is a demo",
  "Test: this is a demo of animating text.",
  "Test: these are demos of animating text.",
  "Test: these are demos of animating text that I hope you like.",
]

export const getButtonAnimatedTextDemoString = (
  hook: boolean,
) => `const sampleStrings = ${JSON.stringify(sampleStrings, null, 2)}

const ButtonAnimatedText = () => {
  const [index, setIndex] = useState(0)
  const goalString = sampleStrings[index]
  ${hook ? "\n  const animatedText = useAnimatedText(goalString)\n" : ""}
  return (
    <Stack align="center">
      <pre>${
        hook ? "{animatedText}" : "<AnimatedText>{goalString}</AnimatedText>"
      }</pre>
      <button
        onClick={() =>
          setIndex((oldIndex) => (oldIndex + 1) % sampleStrings.length)
        }
      >
        {index < sampleStrings.length - 1 ? "Next" : "Reset"}
      </button>
    </Stack>
  )
}
`

export const LoopingAnimatedTextDemo = ({
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

export const getLoopingAnimatedTextDemoString = (
  hook: boolean,
) => `export const LoopingAnimatedTextDemo = ({
  children,
  ...otherProps
}: AnimatedTextProps) => {
  const [clearString, setClearString] = useState(false)
  const stringToUse = clearString
    ? "My value has been changed. Try your own string!"
    : children
    ${
      hook
        ? "\n  const animatedString = useAnimatedText(children, otherProps)\n"
        : ""
    }
  useEffect(() => {
    const interval = setInterval(() => {
      setClearString((clear) => !clear)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return ${
    hook
      ? "animatedString"
      : "<AnimatedText {...otherProps}>{stringToUse}</AnimatedText>"
  }`

const ButtonAnimatedText = (props: AnimatedTextProps) => {
  const [index, setIndex] = useState(0)
  const goalString = sampleStrings[index]

  const animatedText = useAnimatedText(goalString, props)

  return (
    <Stack align="center">
      <pre>{animatedText}</pre>
      <button
        onClick={() =>
          setIndex((oldIndex) => (oldIndex + 1) % sampleStrings.length)
        }
      >
        {index < sampleStrings.length - 1 ? "Next" : "Reset"}
      </button>
    </Stack>
  )
}

const AnimatedTextDemo = ({ type, ...other }: AnimatedTextDemoProps) => {
  if (type === "button") {
    return <ButtonAnimatedText {...other} />
  }
  return <LoopingAnimatedTextDemo {...other} />
}

export default AnimatedTextDemo
