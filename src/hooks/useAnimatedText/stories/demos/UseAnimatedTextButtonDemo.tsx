import useAnimatedText from "localboast/hooks/useAnimatedText"
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

const UseAnimatedTextButtonDemo = () => {
  const [index, setIndex] = useState(0)
  const goalString = sampleStrings[index]
  const animatedText = useAnimatedText(goalString)

  return (
    <>
      <pre>{animatedText}</pre>
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

export default UseAnimatedTextButtonDemo
