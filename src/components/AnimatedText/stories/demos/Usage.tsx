import { AnimatedText, useInterval } from "localboast"
import { useState } from "react"

const texts = ["This is the first string", "This is the second string"]

const SomeComponent = () => {
  const [textIndex, setTextIndex] = useState(0)
  const textToAnimate = texts[textIndex]

  useInterval(() => {
    setTextIndex((oldIndex) => (oldIndex + 1) % texts.length)
  }, 5000)

  return <AnimatedText>{textToAnimate}</AnimatedText>
}
