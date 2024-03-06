import useAnimatedText from "localboast/hooks/useAnimatedText"
import { useState } from "react"

const sampleStrings = [
  "Test",
  "Test: this is a demo",
  "Test: this is a demo of animating text.",
  "Test: these are demos of animating text.",
  "Test: these are demos of animating text that I hope you like.",
]

const UseAnimatedTextButtonDemo = () => {
  const [index, setIndex] = useState(0)
  const goalString = sampleStrings[index]
  const animatedText = useAnimatedText(goalString)

  return (
    <>
      <pre>{animatedText}</pre>
      <button
        onClick={() =>
          setIndex((oldIndex) => (oldIndex + 1) % sampleStrings.length)
        }
      >
        {index < sampleStrings.length - 1 ? "Next" : "Reset"}
      </button>
    </>
  )
}

export default UseAnimatedTextButtonDemo
