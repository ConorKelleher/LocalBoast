import useAnimatedText from "localboast/hooks/useAnimatedText"
import useInterval from "localboast/hooks/useInterval"
import { useState } from "react"

const texts = ["This is the first string", "This is the second string"]

const SomeComponent = () => {
  const [textIndex, setTextIndex] = useState(0)
  const textToAnimate = texts[textIndex]
  const animatingString = useAnimatedText(textToAnimate)

  useInterval(() => {
    setTextIndex((oldIndex) => (oldIndex + 1) % texts.length)
  }, 5000)

  return <p>{animatingString}</p>
}
