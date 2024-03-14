import AnimatedText, {
  AnimatedTextProps,
} from "localboast/components/AnimatedText"
import { useState } from "react"

const sampleStrings = [
  "Test",
  "Test: this is a demo",
  "Test: this is a demo of animating text.",
  "Test: these are demos of animating text.",
  "Test: these are demos of animating text that I hope you like.",
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
