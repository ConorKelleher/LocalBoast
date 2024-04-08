import AnimatedText, {
  AnimatedTextProps,
} from "localboast/components/AnimatedText"
import { useState } from "react"

const sampleStrings = [
  `export const USE_ANIMATED_TEXT_DEFAULT_OPTIONS = {
}`,
  `export const USE_ANIMATED_TEXT_DEFAULT_OPTIONS = {
  msPerChar: 15,
}`,
  `export const USE_ANIMATED_TEXT_DEFAULT_OPTIONS = {
  msPerChar: 25,
}`,
  `export const USE_ANIMATED_TEXT_DEFAULT_OPTIONS = {
  msPerChar: 25,
  someAttribute: false,
}`,
]

const AnimatedTextButtonDemo = (props: AnimatedTextProps) => {
  const [index, setIndex] = useState(0)
  const goalString = sampleStrings[index]

  return (
    <>
      <pre>
        <AnimatedText {...props}>{goalString}</AnimatedText>
      </pre>
      <button
        style={{ display: "flex", margin: "auto " }}
        onClick={() =>
          setIndex((oldIndex) => (oldIndex + 1) % sampleStrings.length)
        }
      >
        {index < sampleStrings.length - 1 ? "Next" : "Reset"}
      </button>
    </>
  )
}

export default AnimatedTextButtonDemo
